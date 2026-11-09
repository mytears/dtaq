/* ============================================================
   DTaQ Employee Search Kiosk Application - index.js
   Refined to match Adobe XD specifications (0 to A-10)
   ============================================================ */

// Global Variables & State
var g_swiper = null;
var g_currentScreen = 'page-standby';
var g_jamoList = [];
var g_selectedEmpId = "261010"; // Default sample: 김진호
var g_activeDeptFilter = 'ALL';
var g_deptMatches = Object.create(null);
var g_deptCodesByName = Object.create(null);
var g_deptNamesByCode = Object.create(null);
var g_searchMode = 'employee';
var g_isEnglish = false;

// Employee data loaded from kiosk_contents.json
var g_employeeData = [];

// Project Data Database
var g_projectData = [
    { id: "PRJ-2026-001", name: "K2 전차 품질보증 및 성능개선 사업", dept: "안전혁신실", pos: "진행중", jobDesc: "체계 품질보증" },
    { id: "PRJ-2026-002", name: "KF-21 체계개발 품질검증 사업", dept: "첨단미래기술센터", pos: "진행중", jobDesc: "비행시험 품질검증" },
    { id: "PRJ-2026-003", name: "차세대 획득체계 AI 품질 분석 사업", dept: "정책기획실", pos: "기획중", jobDesc: "AI 분석 프레임워크" },
    { id: "PRJ-2026-004", name: "군수품 정기 품질검사 및 신뢰성 평가", dept: "경영지원실", pos: "진행중", jobDesc: "신뢰성 평가" },
    { id: "PRJ-2026-005", name: "방산 수출 지원 DQMS 인증 지원 사업", dept: "대외협력기획실", pos: "진행중", jobDesc: "DQMS 인증 지원" },
    { id: "PRJ-2026-006", name: "함정무기체계 신뢰성 평가 및 기술지원", dept: "법무실", pos: "완료", jobDesc: "해군 함정 체계평가" },
    { id: "PRJ-2026-007", name: "드론·무인체계 품질 검증 가이드라인 구축", dept: "인재개발실", pos: "진행중", jobDesc: "무인체계 품질가이드" }
];

// ============================================================
// Initialization Entry Point
// ============================================================
function setinit() {
    console.log("DTaQ Kiosk App Initialized via setinit()");
    
    // Bind Keyboard Buttons
    initVirtualKeyboard();

    // Bind Dropdown & Organization Tree Events
    initCustomDropdown();
    initOrgTree();

    // Bind Event Listeners
    initEventListeners();
    initKiosk();

    loadKioskContents().done(function (data) {
        if (!data) return;
        if (Array.isArray(data.employees_list)) g_employeeData = data.employees_list;
        if (Array.isArray(data.dept)) renderOrganization(data.dept);
    });
}

function setInit() {
    setinit();
}

$(document).ready(function () {
    setinit();
});

// ============================================================
// Page Navigation
// ============================================================
function showPage(pageId) {
    g_currentScreen = pageId;
    $('.page-container').removeClass('active').hide();
    
    var $target = $('#' + pageId);
    $target.show();
    setTimeout(function() {
        $target.addClass('active');
    }, 10);

    // If entering list page, update Swiper layout
    if (pageId === 'page-list' && g_swiper) {
        setTimeout(function() {
            g_swiper.update();
        }, 80);
    }

    // Sync input value across pages
    var currentQuery = $('#global-search-input').val();
    syncSearchQuery(currentQuery);
}

function syncSearchQuery(query) {
    $('#global-search-input').val(query);
    $('.sync-search-input').val(query);

    if (query && query.length > 0) {
        $('.btn-search-clear').addClass('visible');
    } else {
        $('.btn-search-clear').removeClass('visible');
    }
}

// ============================================================
// Swiper & Employee List Rendering (7 Fixed Slots per page)
// ============================================================
function renderEmployeeList(dataList) {
    var itemsPerPage = 7;
    var totalItems = dataList.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    $('#result-count').text(totalItems);

    var $wrapper = $('#emp-swiper-wrapper');
    $wrapper.empty();

    for (var p = 0; p < totalPages; p++) {
        var slideHtml = '<div class="swiper-slide"><div class="emp-list-group">';
        var startIdx = p * itemsPerPage;
        var endIdx = startIdx + itemsPerPage;

        for (var i = startIdx; i < endIdx; i++) {
            if (i < totalItems) {
                var emp = dataList[i];
                var clickAction = (g_searchMode === 'employee') 
                    ? 'selectEmployee(\'' + emp.id + '\')' 
                    : 'void(0)';
                
                slideHtml += 
                    '<div class="emp-row-card" onclick="' + clickAction + '">' +
                        '<div class="col-name">' + emp.name + '</div>' +
                        '<div class="col-id">' + emp.id + '</div>' +
                        '<div class="col-dept">' + $('<span>').text(getCurrentDeptName(emp)).html() + '</div>' +
                        '<div class="col-pos">' + emp.pos + '</div>' +
                        '<div class="row-arrow-icon"><img src="images/icon_listarrow.svg" alt="상세보기"></div>' +
                    '</div>';
            } else {
                // Empty placeholder slot matching A-7.png
                slideHtml += '<div class="emp-row-empty"></div>';
            }
        }

        slideHtml += '</div></div>';
        $wrapper.append(slideHtml);
    }

    // Initialize or Update Swiper
    if (g_swiper !== null) {
        g_swiper.destroy(true, true);
    }

    g_swiper = new Swiper('#emp-swiper', {
        direction: 'horizontal',
        loop: false,
        speed: 300,
        spaceBetween: 100,
        observer: true,
        observeParents: true,
        on: {
            init: function () {
                updatePageIndicator(1, totalPages);
            },
            slideChange: function () {
                updatePageIndicator(this.activeIndex + 1, totalPages);
            }
        }
    });

    updatePageIndicator(1, totalPages);
}

function updatePageIndicator(current, total) {
    $('#page-indicator').text(current + '/' + total);

    if (current <= 1) {
        $('#btn-prev-page').addClass('disabled');
    } else {
        $('#btn-prev-page').removeClass('disabled');
    }

    if (current >= total) {
        $('#btn-next-page').addClass('disabled');
    } else {
        $('#btn-next-page').removeClass('disabled');
    }
}

// ============================================================
// Employee Detail View & LED Fullscreen
// ============================================================
function selectEmployee(empId) {
    var emp = g_employeeData.find(function(item) { return item.id === empId; });
    if (!emp) return;

    g_selectedEmpId = empId;

    // Populate Profile Card
    $('#detail-name').text(emp.name);
    $('#detail-id').text(emp.id);
    var deptName = getCurrentDeptName(emp);
    $('#detail-dept').text(deptName);
    $('#detail-pos').text(emp.pos);
    $('#detail-job-desc').text(emp.jobDesc || (emp.duties && emp.duties[0]) || '');
    $('#detail-email').text(emp.email || 'honggildong@dtaq.re.kr');
    $('#detail-phone').text(emp.phone || '055-111-1234');
    if (emp.photo) {
        $('#detail-photo').attr('src', emp.photo);
        $('#led-photo').attr('src', emp.photo);
    }

    // Sync Right Sidebar (Search input & Department selection) to match A-8 -1
    if (emp.name) {
        $('.sync-search-input').val(emp.name);
        $('.btn-search-clear').addClass('visible');
    }
    if (deptName) {
        highlightDept(getDeptCode(emp), deptName).parents('.tree-folder-node').addClass('expanded');
    }

    // Populate Timeline List
    var $timeline = $('#detail-timeline');
    $timeline.empty();
    
    var historyItems = (emp.history && emp.history.length > 0) ? emp.history : [
        { date: "2021.01 ~ 현재", dept: "품질기획센터", pos: "선임연구원" },
        { date: "2018.07 ~ 2020.12", dept: "시험평가센터", pos: "연구원" },
        { date: "2016.01 ~ 2018.06", dept: "기술지원센터", pos: "연구원" }
    ];

    if (historyItems.length <= 1) {
        $timeline.addClass('no-line');
    } else {
        $timeline.removeClass('no-line');
    }

    historyItems.forEach(function(item) {
        $timeline.append(
            '<div class="timeline-item">' +
                '<img src="images/ico_career_dot.svg" class="timeline-dot" alt="">' +
                '<div class="timeline-date">' + item.date + '</div>' +
                '<div class="timeline-dept">' + item.dept + '</div>' +
                '<div class="timeline-pos">' + item.pos + '</div>' +
            '</div>'
        );
    });

    // Sync LED Modal Data
    $('#led-name').text(emp.name);
    $('#led-id').text(emp.id);
    $('#led-dept').text(deptName);
    $('#led-pos').text(emp.pos);
    $('#led-job-desc').text(emp.jobDesc || (emp.duties && emp.duties[0]) || '');
    $('#led-email').text(emp.email || 'honggildong@dtaq.re.kr');
    $('#led-phone').text(emp.phone || '055-111-1234');
    
    var $ledTimeline = $('#led-timeline');
    $ledTimeline.empty();
    if (historyItems.length <= 1) {
        $ledTimeline.addClass('no-line');
    } else {
        $ledTimeline.removeClass('no-line');
    }
    historyItems.forEach(function(item) {
        $ledTimeline.append(
            '<div class="timeline-item">' +
                '<img src="images/ico_career_dot.svg" class="timeline-dot" alt="">' +
                '<div class="timeline-date">' + item.date + '</div>' +
                '<div class="timeline-dept">' + item.dept + '</div>' +
                '<div class="timeline-pos">' + item.pos + '</div>' +
            '</div>'
        );
    });

    showPage('page-detail');
}

function showLedScreen(empId) {
    // Send to the external LED through led-bridge.js without changing the kiosk view.
}

function closeLedScreen() {
    $('#led-modal').removeClass('active');
}

// ============================================================
// ============================================================
// Virtual Keyboard using Hangul.js & Korean/English QWERTY Toggle
// ============================================================
var KEY_MAP_KO = {
    row2: ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    row3: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    row4: ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
};

var KEY_MAP_EN = {
    row2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    row3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    row4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
};

function updateKeyboardLayout() {
    var map = g_isEnglish ? KEY_MAP_EN : KEY_MAP_KO;

    $('.virtual-keyboard-modal').each(function () {
        var $modal = $(this);

        // Update Row 2 (10 keys)
        $modal.find('.vk-row-2 .vk-key').each(function (idx) {
            if (map.row2[idx] !== undefined) {
                $(this).attr('data-key', map.row2[idx]).text(map.row2[idx]);
            }
        });

        // Update Row 3 (9 keys)
        $modal.find('.vk-row-3 .vk-key').each(function (idx) {
            if (map.row3[idx] !== undefined) {
                $(this).attr('data-key', map.row3[idx]).text(map.row3[idx]);
            }
        });

        // Update Row 4 (7 character keys, excluding backspace/delete)
        $modal.find('.vk-row-4 .vk-key:not(.btn-vk-delete)').each(function (idx) {
            if (map.row4[idx] !== undefined) {
                $(this).attr('data-key', map.row4[idx]).text(map.row4[idx]);
            }
        });

        // Toggle Row 5 between Korean double consonants and English symbols/space
        if (g_isEnglish) {
            $modal.find('.vk-row-5-ko').hide();
            $modal.find('.vk-row-5-en').show().css('display', 'flex');
        } else {
            $modal.find('.vk-row-5-en').hide();
            $modal.find('.vk-row-5-ko').show().css('display', 'flex');
        }
    });
}

function initVirtualKeyboard() {
    // Virtual key click handler
    $(document).on('click', '.vk-key', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);
        var key = $this.attr('data-key');
        var action = $this.attr('data-action');

        // Han/Eng language toggle button
        if ($this.hasClass('btn-vk-lang')) {
            g_isEnglish = !g_isEnglish;
            updateKeyboardLayout();
            return;
        }

        if (action === 'delete') {
            g_jamoList.pop();
            var composed = Hangul.assemble(g_jamoList);
            syncSearchQuery(composed);
        } else if (action === 'search') {
            executeSearch();
        } else if (action === 'clear') {
            clearSearchInput();
        } else if (typeof key !== 'undefined') {
            g_jamoList.push(key);
            var assembledStr = Hangul.assemble(g_jamoList);
            syncSearchQuery(assembledStr);
        }
    });

    // Touch & Mouse active feedback for kiosk displays
    $(document).on('mousedown touchstart', '.vk-key', function () {
        $(this).addClass('active');
    });
    $(document).on('mouseup touchend mouseleave', '.vk-key', function () {
        $(this).removeClass('active');
    });

    // Physical keyboard input listener & synchronization
    $(document).on('input', '.sync-search-input', function () {
        var val = $(this).val();
        $('#global-search-input').val(val);
        $('.sync-search-input').not(this).val(val);
        if (val && val.length > 0) {
            $('.btn-search-clear').addClass('visible');
        } else {
            $('.btn-search-clear').removeClass('visible');
        }
        if (typeof Hangul !== 'undefined' && Hangul.disassemble) {
            g_jamoList = Hangul.disassemble(val);
        }
    });

    $(document).on('keypress', '.sync-search-input', function (e) {
        if (e.which === 13) {
            executeSearch();
        }
    });

    // Keyboard Close Button on search page -> executes search / navigates
    $('#vk-close-btn-search').on('click', function (e) {
        e.stopPropagation();
        executeSearch();
    });

    // Keyboard Close Button on list page overlay -> closes overlay
    $('#vk-close-btn-list').on('click', function (e) {
        e.stopPropagation();
        $('#list-vk-modal').hide();
    });

    // Ensure layout is initialized to Korean state
    updateKeyboardLayout();
}

// ============================================================
// Search Mode Configuration
// ============================================================
function setSearchMode(mode) {
    g_searchMode = mode;
    g_activeDeptFilter = 'ALL';
    $('.dept-dropdown-selected').text('전체부서');
    $('.dept-dropdown-container').removeClass('open');
    $('.dept-dropdown-item, .tree-root-item, .tree-folder-header, .tree-leaf-item').removeClass('active');
    $('.dept-dropdown-item[data-dept="ALL"], .tree-root-item[data-dept="ALL"]').addClass('active');
    $('.org-tree-content').scrollTop(0);
    $('.vk-key').removeClass('active');
    g_jamoList = [];
    syncSearchQuery('');

    if (mode === 'project') {
        $('#page-search .header-title, #page-list .header-title, #page-detail .header-title').text('주요사업검색');
        $('#search-guide-title').html('<span>사업명, 부서별</span>로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('#page-search .sync-search-input, #page-list .sync-search-input, #page-detail .sync-search-input').attr('placeholder', '사업명으로 검색');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('사업코드');
        $('#th-col-3').text('담당부서');
        $('#th-col-4').text('진행상태');

        renderEmployeeList(g_projectData);
    } else if (mode === 'ai') {
        $('#page-search .header-title, #page-list .header-title, #page-detail .header-title').text('AI 검색');
        $('#search-guide-title').html('<span>AI 질의 및 키워드</span>로 검색하세요');
        $('#search-guide-sub').html('원하시는 키워드를 입력하시면 <span>AI 분석 결과</span>를 찾아드립니다.');
        $('#page-search .sync-search-input, #page-list .sync-search-input, #page-detail .sync-search-input').attr('placeholder', 'AI 질의어 입력');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('코드');
        $('#th-col-3').text('부서명');
        $('#th-col-4').text('상태');

        renderEmployeeList(g_projectData);
    } else { // 'employee'
        $('#page-search .header-title, #page-list .header-title, #page-detail .header-title').text('직원 정보 검색');
        $('#search-guide-title').html('<span>성명, 사번, 부서명</span>으로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('#page-search .sync-search-input, #page-list .sync-search-input, #page-detail .sync-search-input').attr('placeholder', '성명, 사번, 부서명으로 검색하세요');

        $('#th-col-1').text('성명');
        $('#th-col-2').text('사번');
        $('#th-col-3').text('부서명');
        $('#th-col-4').text('직책');

        renderEmployeeList(g_employeeData);
    }
}

// Korean Initial Consonant (초성) Extractor & Search Helper
var CHO_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function getChosung(str) {
    if (!str) return "";
    var result = "";
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code >= 0xAC00 && code <= 0xD7A3) {
            var choIndex = Math.floor((code - 0xAC00) / (21 * 28));
            result += CHO_LIST[choIndex];
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

function isKoreanMatch(text, query) {
    if (!text || !query) return false;
    text = (text + "").toLowerCase();
    query = (query + "").toLowerCase();

    // 1. Direct text inclusion
    if (text.includes(query)) return true;

    // Only explicit consonant queries use initial-consonant matching.
    // Completed words such as 원장 must not match unrelated names like 이정민.
    if (/^[ㄱ-ㅎ]+$/.test(query)) {
        return getChosung(text).includes(query);
    }

    // Support unfinished syllables while typing, without weakening completed words.
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(query) && typeof Hangul !== 'undefined' && Hangul.search) {
        return Hangul.search(text, query) >= 0;
    }

    return false;
}

function getDeptCode(item) {
    if (g_deptNamesByCode[item.deptCode]) return item.deptCode;
    return g_deptCodesByName[item.dept] || item.deptCode || item.dept;
}

function getCurrentDeptName(item) {
    return g_deptNamesByCode[getDeptCode(item)] || item.dept || '';
}

function isDeptMatch(item, targetCode) {
    if (!targetCode || targetCode === 'ALL') return true;
    var code = getDeptCode(item);
    return code === targetCode || (g_deptMatches[targetCode] || []).includes(code);
}

// Start a fresh query whenever the kiosk search bar is tapped.
function openSearchKeyboard(target) {
    var pageId = $(target).closest('.page-container').attr('id');
    g_jamoList = [];
    syncSearchQuery('');
    if (pageId === 'page-business') {
        $('#business-keyboard').show();
    } else if (pageId === 'page-list') {
        $('#list-vk-modal').show();
    } else {
        if (pageId === 'page-detail') showPage('page-search');
        $('#page-search .virtual-keyboard-modal').show();
    }
}

function clearSearchInput() {
    g_jamoList = [];
    syncSearchQuery('');
    var sourceData = (g_searchMode === 'project' || g_searchMode === 'ai') ? g_projectData : g_employeeData;
    
    // Filter by department if active
    if (g_activeDeptFilter !== 'ALL') {
        sourceData = sourceData.filter(function(item) {
            return isDeptMatch(item, g_activeDeptFilter);
        });
    }
    renderEmployeeList(sourceData);
}

function executeSearch() {
    if (g_currentScreen === 'page-business') { searchWeapons(); return; }
    var query = $('#global-search-input').val().trim();
    var sourceData = (g_searchMode === 'project' || g_searchMode === 'ai') ? g_projectData : g_employeeData;

    var filtered = sourceData.filter(function(item) {
        var matchQuery = !query || 
            isKoreanMatch(item.name, query) || 
            isKoreanMatch(item.id, query) || 
            isKoreanMatch(getCurrentDeptName(item), query) ||
            isKoreanMatch(item.pos, query) ||
            isKoreanMatch(item.email, query);

        var matchDept = isDeptMatch(item, g_activeDeptFilter);
        return matchQuery && matchDept;
    });

    renderEmployeeList(filtered);
    $('#list-vk-modal').hide();
    showPage('page-list');
}

// ============================================================
// Custom Department Dropdown (A-2-bt.png)
// ============================================================
function initCustomDropdown() {
    // Toggle dropdown open/close
    $(document).on('click', '.dept-dropdown-header', function(e) {
        e.stopPropagation();
        var $container = $(this).closest('.dept-dropdown-container');
        var isOpen = $container.hasClass('open');
        $('.dept-dropdown-container').removeClass('open');
        $('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_down.svg');

        if (!isOpen) {
            $container.addClass('open');
            $container.find('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_up.svg');
        }
    });

    // Select item from dropdown
    $(document).on('click', '.dept-dropdown-item', function(e) {
        e.stopPropagation();
        var deptCode = $(this).attr('data-dept');
        var deptText = $(this).text();

        $('.dept-dropdown-container').removeClass('open');
        $('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_down.svg');

        // Sync with organization tree
        syncDeptFilter(deptCode, deptText);
    });

    // Click outside to close dropdown
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dept-dropdown-container').length) {
            $('.dept-dropdown-container').removeClass('open');
            $('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_down.svg');
        }
    });
}

function renderOrganization(departments) {
    var $lists = $('.dept-dropdown-list-wrap');
    var $trees = $('.org-tree-content');
    $lists.children().not('[data-dept="ALL"]').remove();
    $trees.children().not('.tree-root-item').remove();
    g_deptMatches = Object.create(null);
    g_deptCodesByName = Object.create(null);
    g_deptNamesByCode = Object.create(null);

    var $options = $('<div>');
    var $nodes = $('<div>');
    departments.forEach(function (department) {
        $nodes.append(renderDepartment(department, $options));
    });
    $options.children().appendTo($lists);
    $nodes.children().appendTo($trees);
}

function renderDepartment(department, $options) {
    var name = typeof department === 'string' ? department : department.name;
    var code = department.deptCode || name;
    var children = department.children || [];
    var active = code === g_activeDeptFilter;
    g_deptCodesByName[name] = code;
    g_deptNamesByCode[code] = name;

    $('<div class="dept-dropdown-item">').attr('data-dept', code).text(name)
        .toggleClass('active', active).appendTo($options);

    var $label = $('<span class="tree-text">').text(name);
    var matches = [code];
    if (!children.length) {
        g_deptMatches[code] = matches;
        return $('<div class="tree-leaf-item">').attr('data-dept', code).toggleClass('active', active)
            .append('<span class="tree-line"></span>', '<img src="images/ico_org_3.svg" class="tree-node-icon" alt="">', $label);
    }

    var $header = $('<div class="tree-folder-header">').attr('data-dept', code).toggleClass('active', active)
        .append('<span class="tree-toggle-arrow">▼</span>', '<img src="images/ico_org_2.svg" class="tree-node-icon" alt="">', $label);
    var $children = $('<div class="tree-folder-children">');
    children.forEach(function (child) {
        $children.append(renderDepartment(child, $options));
        matches = matches.concat(g_deptMatches[child.deptCode || child.name || child]);
    });
    g_deptMatches[code] = matches;
    return $('<div class="tree-folder-node expanded">').append($header, $children);
}

function highlightDept(deptCode, deptText) {
    var selector = '[data-dept="' + $.escapeSelector(deptCode) + '"]';
    $('.dept-dropdown-selected').text(deptCode === 'ALL' ? '전체부서' : deptText);
    $('.dept-dropdown-item').removeClass('active').filter(selector).addClass('active');
    return $('.tree-root-item, .tree-leaf-item, .tree-folder-header')
        .removeClass('active').filter(selector).addClass('active');
}

function syncDeptFilter(deptCode, deptText) {
    g_activeDeptFilter = deptCode;
    $('#list-dept-heading').text(deptCode === 'ALL' ? '국방기술품질원' : deptText);
    highlightDept(deptCode, deptText);
    executeSearch();
}

// ============================================================
// Organization Tree & Filters
// ============================================================
function initOrgTree() {
    // Root node click
    $(document).on('click', '.tree-root-item', function(e) {
        e.stopPropagation();
        syncDeptFilter('ALL', '국방기술품질원');
    });

    // Folder header click (Expand/Collapse + Select)
    $(document).on('click', '.tree-folder-header', function(e) {
        e.stopPropagation();
        var $folderNode = $(this).closest('.tree-folder-node');
        $folderNode.toggleClass('expanded');

        var deptCode = $(this).attr('data-dept');
        var deptText = $(this).find('.tree-text').text();
        syncDeptFilter(deptCode, deptText);
    });

    // Leaf item click
    $(document).on('click', '.tree-leaf-item', function(e) {
        e.stopPropagation();
        var deptCode = $(this).attr('data-dept');
        var deptText = $(this).find('.tree-text').text();
        syncDeptFilter(deptCode, deptText);
    });
}

// ============================================================
// Event Listeners Initialization
// ============================================================
function initEventListeners() {
    // Navigation Buttons
    $('.btn-home, .header-brand').on('click', function () {
        showPage('page-landing');
    });

    // Landing Page Card Clicks
    $('#card-emp-search').on('click', function () {
        setSearchMode('employee');
        showPage('page-search');
        $('#page-search .virtual-keyboard-modal').show();
    });

    $('#card-proj-search').on('click', function () {
        openBusiness();
    });

    var preparingPopupTimer;
    $('#card-ai-search').on('click', function () {
        var overlay = $('#preparing-overlay');
        var popup = $('#preparing-popup');
        if (!popup.length) {
            overlay = $('<div id="preparing-overlay" class="preparing-overlay">').appendTo('.main_cont');
            popup = $('<div id="preparing-popup" class="preparing-popup" role="status" aria-live="polite">').appendTo(overlay);
        }
        clearTimeout(preparingPopupTimer);
        $('#page-landing').prop('inert', true);
        overlay.show();
        popup.text('준비중입니다').show();
        preparingPopupTimer = setTimeout(function () {
            popup.hide().empty();
            overlay.hide();
            $('#page-landing').prop('inert', false);
        }, 2000);
    });

    // Input area and its search icon both open a fresh keyboard session.
    $('.trigger-keyboard-mode').on('click', function () {
        openSearchKeyboard(this);
    });

    // Swiper Prev/Next Buttons
    $('#btn-prev-page').on('click', function () {
        if (g_swiper) g_swiper.slidePrev();
    });

    $('#btn-next-page').on('click', function () {
        if (g_swiper) g_swiper.slideNext();
    });

    // Detail Action Buttons
    $('#btn-back-to-list').on('click', function () {
        showPage('page-list');
    });

    // LED Screen Button
    $('#btn-led-enlarge').on('click', function () {
        showLedScreen(g_selectedEmpId);
    });

    // LED Close Button
    $('#btn-close-led').on('click', function () {
        closeLedScreen();
    });

    // ESC key closes LED modal
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLedScreen();
            $('#list-vk-modal').hide();
        }
    });
}
