/* ============================================================
   DTaQ Employee Search Kiosk Application - index.js
   Refined to match Adobe XD specifications (0 to A-10)
   ============================================================ */

// Global Variables & State
var g_swiper = null;
var g_currentScreen = 'page-landing';
var g_jamoList = [];
var g_selectedEmpId = "261010"; // Default sample: 김진호
var g_activeDeptFilter = 'ALL';
var g_searchMode = 'employee';
var g_isEnglish = false;

// Sample Employee Database (Matches XD designs)
var g_employeeData = [
    {
        id: "240862",
        name: "김진호",
        dept: "안전혁신실",
        deptCode: "DEPT_SAFETY",
        pos: "선임연구원",
        jobDesc: "안전보건 관리체계 수립 및 총괄",
        photo: "images/img_photo.png",
        email: "jinho.kim@dtaq.re.kr",
        phone: "055-751-2408",
        duties: [
            "안전보건 관리체계 수립 및 총괄",
            "기관 안전점검 및 예방조치 계획 수립",
            "위험성평가 실시 및 개선대책 이행"
        ],
        history: [
            { date: "2022.03 ~ 현재", dept: "안전혁신실", pos: "선임연구원" },
            { date: "2019.01 ~ 2022.02", dept: "품질기획센터", pos: "연구원" },
            { date: "2016.05 ~ 2018.12", dept: "시험평가센터", pos: "연구보조원" }
        ]
    },
    {
        id: "201245",
        name: "김진호",
        dept: "법무실",
        deptCode: "DEPT_LEGAL",
        pos: "책임연구원",
        jobDesc: "국방품질 관련 법률 검토 및 계약 소송 지원",
        photo: "images/img_photo.png",
        email: "jh.kim@dtaq.re.kr",
        phone: "055-751-2012",
        duties: [
            "국방품질 관련 법률 검토 및 소송 지원",
            "기관 제규정 제·개정 심의 및 자문",
            "지식재산권 관리 및 법률 분쟁 대응"
        ],
        history: [
            { date: "2020.01 ~ 현재", dept: "법무실", pos: "책임연구원" },
            { date: "2015.07 ~ 2019.12", dept: "기획조정실", pos: "선임연구원" }
        ]
    },
    {
        id: "231467",
        name: "김진호",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "선임연구원",
        jobDesc: "중장기 국방품질보증 정책 및 전략 수립",
        photo: "images/img_photo.png",
        email: "jinho23@dtaq.re.kr",
        phone: "055-751-2314",
        duties: [
            "중장기 국방품질보증 정책 및 전략 수립",
            "국방기술품질원 발전계획 및 과제 기획",
            "정부 및 국방부 정책 대응 자료 작성"
        ],
        history: [
            { date: "2021.06 ~ 현재", dept: "정책기획실", pos: "선임연구원" },
            { date: "2018.02 ~ 2021.05", dept: "계획예산실", pos: "연구원" }
        ]
    },
    {
        id: "261010",
        name: "김진호",
        dept: "경영지원실",
        deptCode: "DEPT_MGMT",
        pos: "선임연구원",
        jobDesc: "품질정책 및 품질기획 수립",
        photo: "images/img_photo.png",
        email: "honggildong@dtaq.re.kr",
        phone: "055-111-1234",
        duties: [
            "품질정책 및 품질기획 수립",
            "국방품질 관리체계 기획 및 운영",
            "품질 관련 통계 분석 및 보고서 지원"
        ],
        history: [
            { date: "2021.01 ~ 현재", dept: "품질기획센터", pos: "선임연구원" },
            { date: "2018.07 ~ 2020.12", dept: "시험평가센터", pos: "연구원" },
            { date: "2016.01 ~ 2018.06", dept: "기술지원센터", pos: "연구원" },
            { date: "2014.01 ~ 2015.12", dept: "인증지원센터", pos: "연구보조원" },
            { date: "2012.03 ~ 2013.12", dept: "품질정보센터", pos: "인턴" }
        ]
    },
    {
        id: "224567",
        name: "김진호",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "연구원",
        jobDesc: "정책연구 사업 모니터링 및 실적 관리",
        photo: "images/img_photo.png",
        email: "jinho_p@dtaq.re.kr",
        phone: "055-751-2245",
        duties: [
            "정책연구 사업 모니터링 및 실적 관리",
            "부서 성과지표(KPI) 취합 및 제출"
        ],
        history: [
            { date: "2022.09 ~ 현재", dept: "정책기획실", pos: "연구원" }
        ]
    },
    {
        id: "251233",
        name: "김진호",
        dept: "인재개발실",
        deptCode: "DEPT_HR",
        pos: "연구원",
        jobDesc: "임직원 직무교육 및 역량강화 프로그램 운영",
        photo: "images/img_photo.png",
        email: "jinho_hr@dtaq.re.kr",
        phone: "055-751-2512",
        duties: [
            "임직원 직무교육 및 역량강화 프로그램 운영",
            "신입사원 OJT 및 인재육성 체계 구축"
        ],
        history: [
            { date: "2023.01 ~ 현재", dept: "인재개발실", pos: "연구원" }
        ]
    },
    {
        id: "264123",
        name: "김진호",
        dept: "첨단미래기술센터",
        deptCode: "DEPT_FUTURE",
        pos: "책임연구원",
        jobDesc: "무인·AI 첨단 무기체계 품질검증 기술 연구",
        photo: "images/img_photo.png",
        email: "jinho_tech@dtaq.re.kr",
        phone: "055-751-2641",
        duties: [
            "무인·AI 첨단 무기체계 품질검증 기술 연구",
            "미래 국방기술 신뢰성 평가 프레임워크 구축"
        ],
        history: [
            { date: "2019.04 ~ 현재", dept: "첨단미래기술센터", pos: "책임연구원" },
            { date: "2014.03 ~ 2019.03", dept: "기술연구소", pos: "선임연구원" }
        ]
    },
    {
        id: "201234",
        name: "김민준",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "수석연구원",
        jobDesc: "국방품질 발전전략 기획 총괄",
        photo: "images/img_photo.png",
        email: "mj.kim@dtaq.re.kr",
        phone: "055-751-2012",
        duties: ["국방품질 발전전략 기획 총괄"],
        history: [{ date: "2015.01 ~ 현재", dept: "정책기획실", pos: "수석연구원" }]
    },
    {
        id: "214556",
        name: "이서연",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "책임연구원",
        jobDesc: "대외 정책협력 및 국방 규정 분석",
        photo: "images/img_photo.png",
        email: "sy.lee@dtaq.re.kr",
        phone: "055-751-2145",
        duties: ["대외 정책협력 및 국방 규정 분석"],
        history: [{ date: "2017.03 ~ 현재", dept: "정책기획실", pos: "책임연구원" }]
    },
    {
        id: "220124",
        name: "박도윤",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "선임연구원",
        jobDesc: "국방품질 중장기 계획 수립",
        photo: "images/img_photo.png",
        email: "dy.park@dtaq.re.kr",
        phone: "055-751-2201",
        duties: ["국방품질 중장기 계획 수립"],
        history: [{ date: "2019.05 ~ 현재", dept: "정책기획실", pos: "선임연구원" }]
    },
    {
        id: "254212",
        name: "정하은",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "연구원",
        jobDesc: "품질정책 지표 분석 및 연구",
        photo: "images/img_photo.png",
        email: "he.jung@dtaq.re.kr",
        phone: "055-751-2542",
        duties: ["품질정책 지표 분석 및 연구"],
        history: [{ date: "2023.02 ~ 현재", dept: "정책기획실", pos: "연구원" }]
    },
    {
        id: "256478",
        name: "강서준",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "연구원",
        jobDesc: "연구사업 관리 및 성과 지원",
        photo: "images/img_photo.png",
        email: "sj.kang@dtaq.re.kr",
        phone: "055-751-2564",
        duties: ["연구사업 관리 및 성과 지원"],
        history: [{ date: "2023.07 ~ 현재", dept: "정책기획실", pos: "연구원" }]
    },
    {
        id: "265512",
        name: "한우진",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "연구원",
        jobDesc: "기획자료 편찬 및 운영 지원",
        photo: "images/img_photo.png",
        email: "wj.han@dtaq.re.kr",
        phone: "055-751-2655",
        duties: ["기획자료 편찬 및 운영 지원"],
        history: [{ date: "2024.01 ~ 현재", dept: "정책기획실", pos: "연구원" }]
    },
    {
        id: "270112",
        name: "이수민",
        dept: "감사실",
        deptCode: "DEPT_AUDIT",
        pos: "책임연구원",
        jobDesc: "기관 종합 감사 및 청렴도 향상 대책 수립",
        photo: "images/img_photo.png",
        email: "sm.lee@dtaq.re.kr",
        phone: "055-751-2701",
        duties: ["기관 종합 감사 및 청렴도 향상 대책 수립"],
        history: [{ date: "2018.01 ~ 현재", dept: "감사실", pos: "책임연구원" }]
    },
    {
        id: "281099",
        name: "박성우",
        dept: "조직인사실",
        deptCode: "DEPT_HR_ORG",
        pos: "선임연구원",
        jobDesc: "채용 및 인사평가 체계 관리",
        photo: "images/img_photo.png",
        email: "sw.park@dtaq.re.kr",
        phone: "055-751-2810",
        duties: ["채용 및 인사평가 체계 관리"],
        history: [{ date: "2020.05 ~ 현재", dept: "조직인사실", pos: "선임연구원" }]
    }
];

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

    // Try loading external employees.json, fallback to embedded
    $.getJSON("include/js/employees.json", function (data) {
        if (data && data.length > 0) {
            g_employeeData = data;
        }
    }).always(function () {
        // Initial setup for 김진호 sample
        selectEmployee("261010");
        showPage('page-landing');
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
                        '<div class="col-dept">' + emp.dept + '</div>' +
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
    $('#detail-dept').text(emp.dept);
    $('#detail-pos').text(emp.pos);
    $('#detail-job-desc').text(emp.jobDesc || (emp.duties && emp.duties[0]) || '');
    $('#detail-email').text(emp.email || 'honggildong@dtaq.re.kr');
    $('#detail-phone').text(emp.phone || '055-111-1234');
    if (emp.photo) {
        $('#detail-photo').attr('src', emp.photo);
        $('#led-photo').attr('src', emp.photo);
    }

    // Populate Timeline List
    var $timeline = $('#detail-timeline');
    $timeline.empty();
    
    var historyItems = (emp.history && emp.history.length > 0) ? emp.history : [
        { date: "2021.01 ~ 현재", dept: emp.dept, pos: emp.pos },
        { date: "2018.07 ~ 2020.12", dept: "품질기획센터", pos: "연구원" },
        { date: "2016.01 ~ 2018.06", dept: "기술지원센터", pos: "연구원" }
    ];

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
    $('#led-dept').text(emp.dept);
    $('#led-pos').text(emp.pos);
    $('#led-job-desc').text(emp.jobDesc || (emp.duties && emp.duties[0]) || '');
    $('#led-email').text(emp.email || 'honggildong@dtaq.re.kr');
    $('#led-phone').text(emp.phone || '055-111-1234');
    
    var $ledTimeline = $('#led-timeline');
    $ledTimeline.empty();
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
    console.log("showLedScreen called for employee ID:", empId);
    $('#led-modal').addClass('active');
    
    // Call system integration stub if bridge is present
    if (typeof setCallWebToAppSock === 'function') {
        try {
            setCallWebToAppSock("SHOW_LED", empId);
        } catch (e) {
            console.log("WebSocket bridge notice:", e);
        }
    }
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
    g_jamoList = [];
    syncSearchQuery('');

    if (mode === 'project') {
        $('.header-title').text('주요사업검색');
        $('#search-guide-title').html('<span>사업명, 부서별</span>로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('.sync-search-input').attr('placeholder', '사업명으로 검색');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('사업코드');
        $('#th-col-3').text('담당부서');
        $('#th-col-4').text('진행상태');

        renderEmployeeList(g_projectData);
    } else if (mode === 'ai') {
        $('.header-title').text('AI 검색');
        $('#search-guide-title').html('<span>AI 질의 및 키워드</span>로 검색하세요');
        $('#search-guide-sub').html('원하시는 키워드를 입력하시면 <span>AI 분석 결과</span>를 찾아드립니다.');
        $('.sync-search-input').attr('placeholder', 'AI 질의어 입력');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('코드');
        $('#th-col-3').text('부서명');
        $('#th-col-4').text('상태');

        renderEmployeeList(g_projectData);
    } else { // 'employee'
        $('.header-title').text('직원 정보 검색');
        $('#search-guide-title').html('<span>성명, 사번, 부서명</span>으로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('.sync-search-input').attr('placeholder', '성명, 사번, 부서명으로 검색하세요');

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

    // 2. Initial Consonant (초성) matching
    var textCho = getChosung(text);
    var queryCho = getChosung(query);
    if (textCho.includes(query) || textCho.includes(queryCho)) return true;

    // 3. Hangul.js search
    if (typeof Hangul !== 'undefined' && Hangul.search) {
        if (Hangul.search(text, query) >= 0) return true;
    }

    return false;
}

function clearSearchInput() {
    g_jamoList = [];
    syncSearchQuery('');
    var sourceData = (g_searchMode === 'project' || g_searchMode === 'ai') ? g_projectData : g_employeeData;
    
    // Filter by department if active
    if (g_activeDeptFilter !== 'ALL') {
        sourceData = sourceData.filter(function(item) {
            return item.dept.includes(g_activeDeptFilter);
        });
    }
    renderEmployeeList(sourceData);
}

function executeSearch() {
    var query = $('#global-search-input').val().trim();
    var sourceData = (g_searchMode === 'project' || g_searchMode === 'ai') ? g_projectData : g_employeeData;

    var filtered = sourceData.filter(function(item) {
        var matchQuery = !query || 
            isKoreanMatch(item.name, query) || 
            isKoreanMatch(item.id, query) || 
            isKoreanMatch(item.dept, query) ||
            isKoreanMatch(item.pos, query) ||
            isKoreanMatch(item.email, query);

        var matchDept = (g_activeDeptFilter === 'ALL') || (item.dept.includes(g_activeDeptFilter));
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
        var deptName = $(this).attr('data-dept');
        var deptText = $(this).text();

        $('.dept-dropdown-item').removeClass('active');
        $('.dept-dropdown-item[data-dept="' + deptName + '"]').addClass('active');

        $('.dept-dropdown-selected').text(deptText);
        $('.dept-dropdown-container').removeClass('open');
        $('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_down.svg');

        // Sync with organization tree
        syncDeptFilter(deptName, deptText);
    });

    // Click outside to close dropdown
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dept-dropdown-container').length) {
            $('.dept-dropdown-container').removeClass('open');
            $('.dept-dropdown-btn img').attr('src', 'images/ico_chevron_down.svg');
        }
    });
}

function syncDeptFilter(deptName, deptText) {
    g_activeDeptFilter = deptName;
    var heading = (deptName === 'ALL') ? '국방기술품질원' : deptText;
    $('#list-dept-heading').text(heading);

    // Sync tree selection
    $('.tree-root-item, .tree-leaf-item, .tree-folder-header').removeClass('active');
    if (deptName === 'ALL') {
        $('.tree-root-item').addClass('active');
    } else {
        $('[data-dept="' + deptName + '"]').addClass('active');
    }

    executeSearch();
}

// ============================================================
// Organization Tree & Filters
// ============================================================
function initOrgTree() {
    // Root node click
    $(document).on('click', '.tree-root-item', function(e) {
        e.stopPropagation();
        $('.dept-dropdown-selected').text('전체부서');
        $('.dept-dropdown-item').removeClass('active');
        $('.dept-dropdown-item[data-dept="ALL"]').addClass('active');
        syncDeptFilter('ALL', '국방기술품질원');
    });

    // Folder header click (Expand/Collapse + Select)
    $(document).on('click', '.tree-folder-header', function(e) {
        e.stopPropagation();
        var $folderNode = $(this).closest('.tree-folder-node');
        $folderNode.toggleClass('expanded');

        var deptName = $(this).attr('data-dept');
        var deptText = $(this).find('.tree-text').text();
        $('.dept-dropdown-selected').text(deptText);
        $('.dept-dropdown-item').removeClass('active');
        $('.dept-dropdown-item[data-dept="' + deptName + '"]').addClass('active');
        syncDeptFilter(deptName, deptText);
    });

    // Leaf item click
    $(document).on('click', '.tree-leaf-item', function(e) {
        e.stopPropagation();
        var deptName = $(this).attr('data-dept');
        var deptText = $(this).find('.tree-text').text();
        $('.dept-dropdown-selected').text(deptText);
        $('.dept-dropdown-item').removeClass('active');
        $('.dept-dropdown-item[data-dept="' + deptName + '"]').addClass('active');
        syncDeptFilter(deptName, deptText);
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
    });

    $('#card-proj-search').on('click', function () {
        setSearchMode('project');
        showPage('page-search');
    });

    $('#card-ai-search').on('click', function () {
        setSearchMode('ai');
        showPage('page-search');
    });

    // Search Input Bar click on list screen -> Toggle keyboard overlay (A-4.png)
    $('#page-list .trigger-keyboard-mode').on('click', function () {
        $('#list-vk-modal').toggle();
    });

    // Search Input Bar click on detail screen -> Switch to search screen
    $('#page-detail .trigger-keyboard-mode').on('click', function () {
        showPage('page-search');
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
