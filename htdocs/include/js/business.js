/* Business introduction: list and detail content comes from kiosk_contents.json. */
var businessState = { items: [], filtered: null, page: 0, selected: null, loaded: false };
var weaponsPerPage = 5;
function openBusiness(reload) {
    g_searchMode = 'project';
    syncSearchQuery(''); g_jamoList = [];
    businessState.selected = null;
    businessState.page = 0;
    businessState.filtered = null;
    $('#page-business .header-title').text('주요 사업 검색');
    $('#page-business .sync-search-input').attr('placeholder', '무기체계명으로 검색하세요.');
    $('#page-business').removeClass('showing-weapon');
    $('#business-main').html('<div class="business-guide"><p>대한민국을 지키는 <span>무기체계를 검색</span>하실 수 있습니다.</p><p><span>무기체계명</span>으로 검색하세요.</p></div>');
    $('#weapon-enlarge').hide();
    $('#weapon-led').removeClass('active');
    $('#weapon-led-card').empty();
    g_isEnglish = false;
    updateKeyboardLayout();
    showPage('page-business');
    if (businessState.loaded) { searchWeapons(); return; }
    $('#weapon-list').text('무기체계 정보를 불러오는 중입니다.');
    loadKioskContents(reload === true).done(function(data) {
        var weapons = data && data.weapons_list;
        if (!Array.isArray(weapons) || !weapons.every(function(w) {
            return w && typeof w.id === 'string' && typeof w.name === 'string' && Array.isArray(w.performance);
        })) { businessLoadError(); return; }
        businessState.items = weapons;
        businessState.loaded = true;
        if (g_currentScreen === 'page-business') searchWeapons();
    }).fail(businessLoadError);
}
function businessLoadError() {
    if (g_currentScreen !== 'page-business') return;
    $('#weapon-list').empty().append($('<p>').text('무기체계 정보를 불러오지 못했습니다.'))
        .append($('<button type="button">').text('다시 불러오기').on('click', function () { openBusiness(true); }));
}
function searchWeapons() {
    if (!businessState.loaded) return;
    var query = ($('#global-search-input').val() || '').replace(/\s/g, '').toLowerCase();
    var initials = getInitialQuery(query);
    var results = businessState.items.filter(function (weapon) {
        return initials ? matchesInitials(weapon.name, initials) : weapon.name.replace(/\s/g, '').toLowerCase().includes(query);
    });
    var previousResults = businessState.filtered;
    if (businessState.page === 0 && previousResults && previousResults.length === results.length &&
        results.every(function (weapon, index) { return weapon === previousResults[index]; })) return;

    businessState.filtered = results;
    businessState.page = 0;
    renderWeaponList();
}
function renderWeaponList() {
    var s = businessState, pages = Math.max(1, Math.ceil(s.filtered.length / weaponsPerPage));
    var rows = document.createDocumentFragment();
    s.filtered.slice(s.page * weaponsPerPage, (s.page + 1) * weaponsPerPage).forEach(function(w) {
        $('<button type="button" class="weapon-row">').append($('<span>').text(w.name)).toggleClass('selected', s.selected === w.id)
            .attr('aria-pressed', s.selected === w.id).data('weapon', w)
            .append($('<img src="images/icon_listarrow.svg" alt="">')).appendTo(rows);
    });
    if (!s.filtered.length) rows.append('검색 결과가 없습니다.');
    document.getElementById('weapon-list').replaceChildren(rows);
    $('#weapon-pagination').empty().append($('<span class="weapon-page-current">').text(s.page + 1)).append(document.createTextNode('/' + pages));
    $('#weapon-prev').prop('disabled', s.page === 0);
    $('#weapon-next').prop('disabled', s.page + 1 >= pages);
}
function weaponCard(w) {
    var branch = {army: ['육군', 1], navy: ['해군', 3], air: ['공군', 2]}[w.branch] || ['기타', 1];
    var card = $('<article class="weapon-detail">');
    card.append($('<h1>').text(w.name));
    card.append($('<div class="weapon-branch">').append($('<img alt="">').attr('src', 'images/ico_army_' + branch[1] + '.svg')).append(document.createTextNode(branch[0])));
    var body = $('<div class="weapon-body">').appendTo(card);
    var photo = $('<div class="weapon-photo" role="img" aria-label="이미지 준비중">').append($('<img class="weapon-watermark" src="images/img_logo.png" alt="">')).appendTo(body);
    if (w.image && /^(images\/)[^:]+$/.test(w.image)) {
        $('<img class="weapon-image">').attr({src:w.image, alt:w.name}).on('load', function(){ photo.addClass('has-image').attr('aria-label', w.name); }).on('error', function(){ $(this).remove(); photo.removeClass('has-image'); }).appendTo(photo);
    }
    var specs = $('<div class="weapon-specs">').appendTo(body);
    var table = $('<table class="weapon-table">').appendTo(specs);
    [['개발형태',w.development],['제조업체',w.manufacturer],['사업기간 / 양산',w.period],['주요성능',w.performance],['기타',w.description]].forEach(function(row) {
        var tr = $('<tr>').append($('<th scope="row">').text(row[0])).appendTo(table);
        var td = $('<td>').appendTo(tr);
        (Array.isArray(row[1]) ? row[1] : [row[1] || '자료 준비중']).forEach(function(v){ $('<div>').text(v).appendTo(td); });
    });
    return card;
}
function renderWeaponDetail(w) {
    $('#page-business').addClass('showing-weapon');
    document.getElementById('business-main').replaceChildren(weaponCard(w)[0]);
    $('#weapon-enlarge').show();
}
$(function() {
    var page = $('<section id="page-business" class="page-container">').appendTo('.main_cont');
    page.append($('#page-search .app-header').clone());
    page.find('.header-title').text('주요 사업 검색');
    page.append('<div id="business-main"></div><button type="button" id="weapon-enlarge">LED 화면으로 크게 보기</button><aside class="business-sidebar"><div class="business-search"><input class="sync-search-input" aria-label="무기체계 검색" placeholder="무기체계명으로 검색하세요."><button type="button" id="weapon-search" aria-label="검색"><img src="images/ico_search.svg" alt=""></button></div><div id="weapon-list" aria-live="polite"></div><nav class="weapon-pager" aria-label="무기 목록 페이지"><button id="weapon-prev" aria-label="이전 페이지"><img src="images/ico_page_l.svg" alt=""></button><span id="weapon-pagination">1/1</span><button id="weapon-next" aria-label="다음 페이지"><img src="images/ico_page_r.svg" alt=""></button></nav></aside>');
    $('#page-search .virtual-keyboard-modal').clone().attr('id','business-keyboard').appendTo(page);
    $('#weapon-search').on('click', searchWeapons);
    $('#weapon-list').on('click', '.weapon-row', function () {
        var weapon = $(this).data('weapon');
        if (businessState.selected === weapon.id) return;

        $(this).siblings('.selected').removeClass('selected').attr('aria-pressed', false);
        $(this).addClass('selected').attr('aria-pressed', true);
        businessState.selected = weapon.id;
        renderWeaponDetail(weapon);
    });
    $('#weapon-prev, #weapon-next').on('click', function () {
        if (!businessState.filtered) return;
        businessState.page += this.id === 'weapon-next' ? 1 : -1;
        renderWeaponList();
    });
    // led-bridge.js handles the enlarge button without changing the kiosk view.
});
