/* Business introduction: list and detail content comes from kiosk_contents.json. */
var businessState = { items: [], filtered: [], page: 0, selected: null, loaded: false };
function openBusiness(reload) {
    g_searchMode = 'project';
    syncSearchQuery(''); g_jamoList = [];
    businessState.selected = null;
    businessState.page = 0;
    $('#page-business .header-title').text('주요 사업 검색');
    $('#page-business .sync-search-input').attr('placeholder', '무기체계명으로 검색하세요.');
    $('#business-main').empty().append($('<div class="business-guide">').html('대한민국을 지키는 <span>무기체계를 검색</span>하실 수 있습니다.<br><span>무기체계명</span>으로 검색하세요'));
    $('#weapon-enlarge').hide();
    $('#weapon-led').removeClass('active');
    $('#weapon-led-card').empty();
    g_isEnglish = false;
    updateKeyboardLayout();
    showPage('page-business');
    $('#business-keyboard').show();
    if (businessState.loaded) { searchWeapons(); $('#business-keyboard').show(); return; }
    $('#weapon-list').text('무기체계 정보를 불러오는 중입니다.');
    loadKioskContents(reload === true).done(function(data) {
        var weapons = data && data.weapons_list;
        if (!Array.isArray(weapons) || !weapons.every(function(w) {
            return w && typeof w.id === 'string' && typeof w.name === 'string' && Array.isArray(w.performance);
        })) { businessLoadError(); return; }
        businessState.items = weapons;
        businessState.loaded = true;
        if (g_currentScreen === 'page-business') {
            searchWeapons();
            $("#business-keyboard").show();
        }
    }).fail(businessLoadError);
}
function businessLoadError() {
    if (g_currentScreen !== 'page-business') return;
    $('#weapon-list').empty().append($('<p>').text('무기체계 정보를 불러오지 못했습니다.'))
        .append($('<button type="button">').text('다시 불러오기').on('click', function () { openBusiness(true); }));
}
function searchWeapons() {
    var query = ($('#global-search-input').val() || '').replace(/\s/g, '').toLowerCase();
    businessState.filtered = businessState.items.filter(function(w) { return w.name.replace(/\s/g, '').toLowerCase().indexOf(query) !== -1; });
    businessState.page = 0;
    renderWeaponList();
    $('#business-keyboard').hide();
}
function renderWeaponList() {
    var s = businessState, pages = Math.max(1, Math.ceil(s.filtered.length / 10));
    $('#weapon-list').empty();
    s.filtered.slice(s.page * 10, s.page * 10 + 10).forEach(function(w) {
        $('<button type="button" class="weapon-row">').text(w.name).toggleClass('selected', s.selected === w.id)
            .attr('aria-pressed', s.selected === w.id).on('click', function() {
                s.selected = w.id; renderWeaponDetail(w); renderWeaponList(); $('#business-keyboard').hide();
            }).append($('<img src="images/icon_listarrow.svg" alt="">')).appendTo('#weapon-list');
    });
    if (!s.filtered.length) $('#weapon-list').text('검색 결과가 없습니다.');
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
    var table = $('<table class="weapon-table">').appendTo(body);
    [['개발형태',w.development],['제조업체',w.manufacturer],['사업기간 / 양산',w.period],['주요성능',w.performance],['기타',w.description]].forEach(function(row) {
        var tr = $('<tr>').append($('<th scope="row">').text(row[0])).appendTo(table);
        var td = $('<td>').appendTo(tr);
        (Array.isArray(row[1]) ? row[1] : [row[1] || '자료 준비중']).forEach(function(v){ $('<div>').text(v).appendTo(td); });
    });
    return card;
}
function renderWeaponDetail(w) {
    $('#business-main').empty().append(weaponCard(w)); $('#weapon-enlarge').show();
}
$(function() {
    var page = $('<section id="page-business" class="page-container">').appendTo('.main_cont');
    page.append($('#page-search .app-header').clone());
    page.find('.header-title').text('주요 사업 검색');
    page.find('.btn-home, .header-brand').on('click', function(){ showPage('page-landing'); });
    page.append('<div id="business-main"><div class="business-guide">대한민국을 지키는 <span>무기체계를 검색</span>하실 수 있습니다.<br><span>무기체계명</span>으로 검색하세요</div></div><button type="button" id="weapon-enlarge">LED 화면으로 크게 보기</button><aside class="business-sidebar"><div class="business-search"><input class="sync-search-input" aria-label="무기체계 검색" placeholder="무기체계명으로 검색하세요."><button type="button" id="weapon-search" aria-label="검색"><img src="images/ico_search.svg" alt=""></button></div><div id="weapon-list" aria-live="polite"></div><nav class="weapon-pager" aria-label="무기 목록 페이지"><button id="weapon-prev" aria-label="이전 페이지"><img src="images/ico_page_l.svg" alt=""></button><span id="weapon-pagination">1/1</span><button id="weapon-next" aria-label="다음 페이지"><img src="images/ico_page_r.svg" alt=""></button></nav></aside>');
    var keyboard = $('#page-search .virtual-keyboard-modal').clone().attr('id','business-keyboard').appendTo(page);
    keyboard.find('[id]').removeAttr('id');
    keyboard.find('.vk-close-btn').on('click', function(){ keyboard.hide(); });
    page.find('.business-search').on('click', function(){ openSearchKeyboard(this); });
    $('#weapon-prev, #weapon-next').on('click', function(){ businessState.page += this.id === 'weapon-next' ? 1 : -1; renderWeaponList(); });
    // led-bridge.js handles the enlarge button without changing the kiosk view.
});
