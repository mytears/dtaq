/* Standby/welcome content and inactivity lifecycle. Paths are relative to index.html. */
var kioskState = { idleMs: 180000, timer: null, lastActivity: 0 };
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

function applyKioskWelcome(content) {
    content = content || {};
    var visible = content.show === true;
    var $welcome = $('#welcome-screen');
    if (typeof content.background === 'string' && /^(commonfiles|images)\/[\w./-]+$/.test(content.background)) {
        $welcome.css('background-image', 'url("' + content.background + '")');
    }
    ['subtitle', 'title', 'message', 'scheduleTitle', 'schedule'].forEach(function (key) {
        var selectors = {
            subtitle: '.welcome-subtitle', title: '.welcome-title', message: '.welcome-message',
            scheduleTitle: '.welcome-schedule-title', schedule: '.welcome-schedule-text'
        };
        $welcome.find(selectors[key]).text(typeof content[key] === 'string' ? content[key] : '');
    });
    $welcome.prop('hidden', !visible);
    $('#standby-start').prop('hidden', visible);
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
        if (!$('#welcome-screen').prop('hidden')) return;
        resetKioskSearch();
        showPage('page-landing');
        recordKioskActivity();
    });
    ['pointerdown', 'keydown', 'wheel'].forEach(function (eventName) {
        document.addEventListener(eventName, recordKioskActivity, { capture: true, passive: true });
    });
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && g_currentScreen !== 'page-standby' &&
            Date.now() - kioskState.lastActivity >= kioskState.idleMs) enterKioskStandby();
    });
    loadKioskContents().done(function (data) {
        applyKioskWelcome(data && data.welcome);
        var content = data && data.standby;
        if (!content) return;
        if (typeof content.background === 'string' && /^(commonfiles|images)\/[\w./-]+$/.test(content.background)) {
            $('#page-standby').css('background-image', 'url("' + content.background + '")');
        }
        if (typeof content.title === 'string') $('.standby-title').text(content.title);
        if (typeof content.subtitle === 'string') $('.standby-subtitle').text(content.subtitle);
        var idleSeconds = content.idelTime === undefined ? content.idleSeconds : content.idelTime;
        if (typeof idleSeconds === 'number' && isFinite(idleSeconds) && idleSeconds > 0) {
            kioskState.idleMs = idleSeconds * 1000;
            if (g_currentScreen !== 'page-standby') recordKioskActivity();
        }
    }).fail(function () {
        applyKioskWelcome(null);
    });
}
