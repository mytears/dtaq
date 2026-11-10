/* Standby/welcome content and inactivity lifecycle. Paths are relative to index.html. */
var kioskState = { idleMs: 180000, timer: null, lastActivity: 0, welcomeTimer: null };
var kioskContentsRequest = null;

function loadKioskContents(reload) {
    if (!reload && kioskContentsRequest) return kioskContentsRequest;

    var request = $.getJSON('data/kiosk_contents.json');
    kioskContentsRequest = request;
    request.fail(function () {
        if (kioskContentsRequest === request) kioskContentsRequest = null;
    });
    return request;
}

function findKioskWelcome(content, now) {
    if (!content || !Array.isArray(content.welcome_list)) return null;

    var today = String(now.getFullYear()).padStart(4, '0') +
        String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    var time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    var dayFormat = /^\d{8}$/;
    var timeFormat = /^((?:[01]\d|2[0-3])[0-5]\d)(?:[0-5]\d)?$/;

    var ending = null;
    for (var item of content.welcome_list) {
        if (!item || !dayFormat.test(item.sday) || !dayFormat.test(item.eday) ||
            today < item.sday || item.eday < today) continue;

        var start = timeFormat.exec(item.stime)?.[1];
        var end = timeFormat.exec(item.etime)?.[1];
        if (!start || !end || time < start || end < time) continue;

        if (start === time) return item;
        if (!ending) {
            if (end !== time) return item;
            // A reservation starting this minute takes priority over this one.
            ending = item;
        }
    }
    return ending;
}

function refreshKioskWelcome() {
    if (kioskState.welcome === undefined) return;
    var content = findKioskWelcome(kioskState.welcome, new Date());
    if (content === kioskState.activeWelcome) return;
    kioskState.activeWelcome = content;
    applyKioskWelcome(content);
}

function applyKioskMedia($layer, type, path) {
    var media = typeof path === 'string' && /^(commonfiles|images)\/[\w./-]+$/.test(path) ? path : '';
    var image = !type || type === 'IMG' ? media : '';
    var source = type === 'MOV' ? media : '';
    $layer.css('background-image', image ? 'url("' + image + '")' : '');

    var video = $layer.children('.kiosk-video')[0];
    video.hidden = !source;
    if ((video.getAttribute('src') || '') === source) return;
    video.pause();
    if (source) {
        video.src = source;
    } else {
        video.removeAttribute('src');
        video.load();
    }
}

function syncKioskVideos() {
    var standbyVisible = g_currentScreen === 'page-standby' && !document.hidden;
    var welcomeVisible = !$('#welcome-screen').prop('hidden');
    $('#page-standby .kiosk-video').each(function () {
        var isWelcomeVideo = this.parentNode.id !== 'page-standby';
        if (standbyVisible && welcomeVisible === isWelcomeVideo && !this.hidden) {
            if (this.paused) this.play().catch(function () {});
        } else if (!this.paused) {
            this.pause();
        }
    });
}

function applyKioskWelcome(content) {
    var visible = Boolean(content);
    content = content || {};
    var $welcome = $('#welcome-screen');
    applyKioskMedia($welcome, content.bg_type, content.bg_path ?? content.background);
    applyKioskMedia($('#welcome-media'), content.type, content.file_path);
    $welcome.prop('hidden', !visible);
    $('#standby-start').prop('hidden', visible);
    syncKioskVideos();
}

function resetKioskSearch() {
    setSearchMode('employee');
    g_selectedEmpId = null;
    g_isEnglish = false;
    updateKeyboardLayout();
    $('.tree-folder-node').removeClass('expanded');
    $('.virtual-keyboard-modal').hide();
    $('#led-modal, #weapon-led').removeClass('active');
    $('#preparing-overlay').hide();
    $('#page-landing').prop('inert', false);
    businessState.selected = null;
    businessState.page = 0;
    businessState.filtered = [];
    $('#weapon-list, #weapon-led-card, #business-main').empty();
    $('#weapon-enlarge').hide();
}

function enterKioskStandby() {
    clearTimeout(kioskState.timer);
    kioskState.timer = null;
    $('#led-modal, #weapon-led').removeClass('active');
    $('#preparing-overlay').hide();
    $('#page-landing').prop('inert', false);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    refreshKioskWelcome();
    showPage('page-standby');
}

function recordKioskActivity() {
    if (g_currentScreen === 'page-standby') return;
    kioskState.lastActivity = Date.now();
    clearTimeout(kioskState.timer);
    kioskState.timer = setTimeout(enterKioskStandby, kioskState.idleMs);
}

function initKiosk() {
    showPage('page-standby');
    $('#page-standby').on('click', function () {
        refreshKioskWelcome();
        if (!$('#welcome-screen').prop('hidden')) return;
        resetKioskSearch();
        showPage('page-landing');
        recordKioskActivity();
    });
    ['pointerdown', 'keydown', 'wheel'].forEach(function (eventName) {
        document.addEventListener(eventName, recordKioskActivity, { capture: true, passive: true });
    });
    document.addEventListener('visibilitychange', function () {
        syncKioskVideos();
        if (document.hidden) return;
        refreshKioskWelcome();
        if (g_currentScreen !== 'page-standby' &&
            Date.now() - kioskState.lastActivity >= kioskState.idleMs) enterKioskStandby();
    });
    loadKioskContents().done(function (data) {
        kioskState.welcome = (data && data.welcome) || null;
        refreshKioskWelcome();
        if (kioskState.welcome && Array.isArray(kioskState.welcome.welcome_list) && kioskState.welcomeTimer === null) {
            kioskState.welcomeTimer = setInterval(refreshKioskWelcome, 1000);
        }
        var content = data && data.standby;
        if (!content) return;
        applyKioskMedia($('#page-standby'), content.type, content.file_path ?? content.background);
        syncKioskVideos();
        if (typeof content.title === 'string') $('.standby-title').text(content.title);
        if (typeof content.subtitle === 'string') $('.standby-subtitle').text(content.subtitle);
        var idleSeconds = content.idelTime === undefined ? content.idleSeconds : content.idelTime;
        if (typeof idleSeconds === 'number' && isFinite(idleSeconds) && idleSeconds > 0) {
            kioskState.idleMs = idleSeconds * 1000;
            if (g_currentScreen !== 'page-standby') recordKioskActivity();
        }
    }).fail(function () {
        kioskState.welcome = null;
        refreshKioskWelcome();
    });
}
