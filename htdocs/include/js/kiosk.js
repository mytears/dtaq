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

    var starting = null;
    for (var item of content.welcome_list) {
        if (!item || !dayFormat.test(item.sday) || !dayFormat.test(item.eday) ||
            today < item.sday || item.eday < today) continue;

        var start = timeFormat.exec(item.stime)?.[1];
        var end = timeFormat.exec(item.etime)?.[1];
        if (!start || !end || time < start || end < time) continue;

        // Keep an earlier reservation through its entire end minute.
        if (start < time && (end === time || !starting)) return item;
        if (!starting) starting = item;
    }
    return starting;
}

function refreshKioskWelcome() {
    if (kioskState.welcome === undefined) return;
    var content = findKioskWelcome(kioskState.welcome, new Date());
    if (content === kioskState.activeWelcome) return;
    kioskState.activeWelcome = content;
    applyKioskWelcome(content);
}

function resolveKioskMediaPath(path) {
    if (typeof path !== 'string' || !path.trim()) return '';

    try {
        return new URL(path, document.baseURI).href;
    } catch {
        return '';
    }
}

function resolveKioskPhotoPath(path) {
    var photoUrl = resolveKioskMediaPath(path);
    var imagesDir = resolveKioskMediaPath('images/');
    var fileUrl = photoUrl.split(/[?#]/, 1)[0];
    var sampleImages = ['img_photo.png', 'img_photo111.png', 'weapon-k9-sample.png'];
    return sampleImages.some(function (file) {
        return fileUrl === imagesDir + file;
    }) ? '' : photoUrl;
}

function applyKioskMedia($layer, type, path) {
    var media = resolveKioskMediaPath(path);
    var image = !type || type === 'IMG' ? media : '';
    var source = type === 'MOV' ? media : '';
    $layer.css('background-image', image ? 'url(' + JSON.stringify(image) + ')' : '');

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
    var visitor = typeof content.visitor === 'string' ? content.visitor.trim() : '';
    var schedule = typeof content.schedule === 'string' ? content.schedule.trim() : '';
    applyKioskMedia($welcome, content.bg_type, content.bg_path ?? content.background);
    applyKioskMedia($('#welcome-media'), content.type, content.file_path);
    $('#welcome-greeting').prop('hidden', !visitor || Boolean(content.file_path));
    $('.welcome-visitor').text(visitor);
    $('.welcome-schedule').prop('hidden', !schedule);
    $('.welcome-schedule-text').text(schedule);
    $welcome.prop('hidden', !visible);
    $('#standby-start').prop('hidden', visible);
    syncKioskVideos();
}

function resetKioskSearch() {
    setSearchMode('employee');
    g_selectedEmpId = null;
    g_isEnglish = false;
    updateKeyboardLayout();
    $('#led-modal, #weapon-led').removeClass('active');
    $('#preparing-overlay').hide();
    $('#page-landing').prop('inert', false);
    closeWeaponDetail();
    businessState.page = 0;
    businessState.filtered = null;
    $('#weapon-list, #weapon-led-card').empty();
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
    var stage = document.querySelector('.main_cont');
    function fitStage() {
        var scale = Math.min(window.innerWidth / stage.offsetWidth, window.innerHeight / stage.offsetHeight);
        stage.style.setProperty('--stage-scale', scale);
    }
    fitStage();
    window.addEventListener('resize', fitStage);
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
