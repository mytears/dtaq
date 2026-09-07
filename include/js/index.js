/* ============================================================
   DTaQ Employee Search Kiosk Application - index.js
   ============================================================ */

// Global Variables & State
var g_swiper = null;
var g_currentScreen = 'page-landing';
var g_jamoList = [];
var g_selectedEmpId = null;
var g_activeDeptFilter = 'ALL';

// Sample Employee Database (15 Records matching design)
var g_employeeData = [
    {
        id: "240862",
        name: "김진호",
        dept: "안전혁신실",
        deptCode: "DEPT_SAFETY",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
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
        photo: "include/images/emp_jinho.jpg",
        email: "jh.kim@dtaq.re.kr",
        phone: "055-751-2012",
        duties: [
            "국방품질 관련 법률 검토 및 계약 소송 지원",
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
        photo: "include/images/emp_jinho.jpg",
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
        photo: "include/images/emp_jinho.jpg",
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
            { date: "2014.01 ~ 2015.12", dept: "인증지원센터", pos: "연구보조원" }
        ]
    },
    {
        id: "224567",
        name: "김진호",
        dept: "정책기획실",
        deptCode: "DEPT_POLICY",
        pos: "연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "jinho_p@dtaq.re.kr",
        phone: "055-751-2245",
        duties: [
            "정책연구 사업 모니터링 및 실적 관리",
            "부서 성과지표(KPI) 취합 및 제출",
            "기획회의 운영 지원 및 기록 관리"
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
        photo: "include/images/emp_jinho.jpg",
        email: "jinho_hr@dtaq.re.kr",
        phone: "055-751-2512",
        duties: [
            "임직원 직무교육 및 역량강화 프로그램 운영",
            "신입사원 OJT 및 인재육성 체계 구축",
            "교육훈련 만족도 조사 및 평가 분석"
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
        photo: "include/images/emp_jinho.jpg",
        email: "jinho_tech@dtaq.re.kr",
        phone: "055-751-2641",
        duties: [
            "무인·AI 첨단 무기체계 품질검증 기술 연구",
            "미래 국방기술 신뢰성 평가 프레임워크 구축",
            "산학연 합동 연구과제 총괄 관리"
        ],
        history: [
            { date: "2019.04 ~ 현재", dept: "첨단미래기술센터", pos: "책임연구원" },
            { date: "2014.03 ~ 2019.03", dept: "기술연구소", pos: "선임연구원" }
        ]
    },
    {
        id: "270112",
        name: "이수민",
        dept: "감사실",
        deptCode: "DEPT_AUDIT",
        pos: "책임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "sm.lee@dtaq.re.kr",
        phone: "055-751-2701",
        duties: [
            "기관 종합 감사 및 청렴도 향상 대책 수립",
            "일상감사 및 계약 검토 업무",
            "부패방지 경영시스템 운영"
        ],
        history: [
            { date: "2018.01 ~ 현재", dept: "감사실", pos: "책임연구원" }
        ]
    },
    {
        id: "281099",
        name: "박성우",
        dept: "조직인사실",
        deptCode: "DEPT_HR_ORG",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "sw.park@dtaq.re.kr",
        phone: "055-751-2810",
        duties: [
            "채용 및 인사평가 체계 관리",
            "조직개편 및 정원 관리",
            "노사관계 및 복리후생 운용"
        ],
        history: [
            { date: "2020.05 ~ 현재", dept: "조직인사실", pos: "선임연구원" }
        ]
    },
    {
        id: "292301",
        name: "최윤정",
        dept: "계획예산실",
        deptCode: "DEPT_BUDGET",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "yj.choi@dtaq.re.kr",
        phone: "055-751-2923",
        duties: [
            "연간 예산 편성 및 집행 관리",
            "국회 및 기재부 예산 심의 대응",
            "재정성과평가 및 예산 이·전용 관리"
        ],
        history: [
            { date: "2021.03 ~ 현재", dept: "계획예산실", pos: "선임연구원" }
        ]
    },
    {
        id: "301455",
        name: "정민재",
        dept: "대외협력기획실",
        deptCode: "DEPT_COOP",
        pos: "연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "mj.jung@dtaq.re.kr",
        phone: "055-751-3014",
        duties: [
            "국방 유관기관 협력 네트워크 구축",
            "언론 홍보 및 대외 소통 관리",
            "기관 홍보물 제작 및 설명회 개최"
        ],
        history: [
            { date: "2022.01 ~ 현재", dept: "대외협력기획실", pos: "연구원" }
        ]
    },
    {
        id: "312890",
        name: "강현우",
        dept: "국제협력실",
        deptCode: "DEPT_INTL",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "hw.kang@dtaq.re.kr",
        phone: "055-751-3128",
        duties: [
            "해외 군수품 품질보증 상호수락 협정(MOU) 체결",
            "방산 수출 지원 품질인증 총괄",
            "국제 방산 품질 회의 참석 및 기술 교류"
        ],
        history: [
            { date: "2019.08 ~ 현재", dept: "국제협력실", pos: "선임연구원" }
        ]
    },
    {
        id: "324102",
        name: "조예은",
        dept: "정보화지원실",
        deptCode: "DEPT_IT",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "ye.cho@dtaq.re.kr",
        phone: "055-751-3241",
        duties: [
            "기관 정보시스템 구축 및 통합 유지보수",
            "품질보증 정보망(DQMS) 운영 총괄",
            "클라우드 및 데이터베이스 관리"
        ],
        history: [
            { date: "2020.02 ~ 현재", dept: "정보화지원실", pos: "선임연구원" }
        ]
    },
    {
        id: "335611",
        name: "윤도현",
        dept: "정보보안안전부",
        deptCode: "DEPT_SEC",
        pos: "책임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "dh.yoon@dtaq.re.kr",
        phone: "055-751-3356",
        duties: [
            "국방 정보보안 체계 관리 및 침해사고 대응",
            "보안점검 및 개인정보보호 관리체계 수립",
            "방산업체 보안 진단 및 컨설팅"
        ],
        history: [
            { date: "2017.09 ~ 현재", dept: "정보보안안전부", pos: "책임연구원" }
        ]
    },
    {
        id: "346722",
        name: "장서연",
        dept: "원장실",
        deptCode: "DEPT_DIR",
        pos: "선임연구원",
        photo: "include/images/emp_jinho.jpg",
        email: "sy.jang@dtaq.re.kr",
        phone: "055-751-3467",
        duties: [
            "원장 보좌 및 기관 주요 일정 조정",
            "VIP 의전 및 대외 주요 행사 관리",
            "기관장 지시사항 이행 점검"
        ],
        history: [
            { date: "2021.11 ~ 현재", dept: "원장실", pos: "선임연구원" }
        ]
    }
];

// ============================================================
// First execution entry point required by user specification
// ============================================================
function setinit() {
    console.log("DTaQ Kiosk App Initialized via setinit()");
    
    // Bind Keyboard Buttons
    initVirtualKeyboard();

    // Bind Organization Tree Events
    initOrgTree();

    // Bind Event Listeners
    initEventListeners();

    // Load Employee Data from JSON file with fallback
    $.getJSON("include/js/employees.json", function (data) {
        if (data && data.length > 0) {
            g_employeeData = data;
        }
        renderEmployeeList(g_employeeData);
    }).fail(function () {
        console.warn("Could not load employees.json via AJAX, using embedded array fallback.");
        renderEmployeeList(g_employeeData);
    });

    // Initial Screen Setup
    showPage('page-landing');
}

// Case alias for safety
function setInit() {
    setinit();
}

// jQuery Document Ready
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
        }, 100);
    }

    // Sync input value across pages
    var currentQuery = $('#global-search-input').val();
    $('.sync-search-input').val(currentQuery);
}

// ============================================================
// Swiper & Employee List Rendering
// ============================================================
function renderEmployeeList(dataList) {
    var itemsPerPage = 7;
    var totalItems = dataList.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    $('#result-count').text(totalItems);

    var $wrapper = $('#emp-swiper-wrapper');
    $wrapper.empty();

    if (totalItems === 0) {
        $wrapper.append(
            '<div class="swiper-slide">' +
                '<div style="text-align:center; padding: 100px; font-size:24px; color:#64748b;">' +
                    '검색 결과가 없습니다.' +
                '</div>' +
            '</div>'
        );
    } else {
        for (var p = 0; p < totalPages; p++) {
            var slideHtml = '<div class="swiper-slide"><div class="emp-list-group">';
            var startIdx = p * itemsPerPage;
            var endIdx = Math.min(startIdx + itemsPerPage, totalItems);

            for (var i = startIdx; i < endIdx; i++) {
                var emp = dataList[i];
                slideHtml += 
                    '<div class="emp-row-card" onclick="selectEmployee(\'' + emp.id + '\')">' +
                        '<div class="col-name">' + emp.name + '</div>' +
                        '<div class="col-id">' + emp.id + '</div>' +
                        '<div class="col-dept">' + emp.dept + '</div>' +
                        '<div class="col-pos">' + emp.pos + ' <span class="row-arrow-icon">›</span></div>' +
                    '</div>';
            }

            slideHtml += '</div></div>';
            $wrapper.append(slideHtml);
        }
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
// Employee Detail View
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
    $('#detail-email').text(emp.email);
    $('#detail-phone').text(emp.phone);

    // Duties List
    var $dutiesList = $('#detail-duties-list');
    $dutiesList.empty();
    emp.duties.forEach(function(duty) {
        $dutiesList.append('<div class="duties-item">' + duty + '</div>');
    });

    // Timeline List
    var $timeline = $('#detail-timeline');
    $timeline.empty();
    emp.history.forEach(function(item) {
        $timeline.append(
            '<div class="timeline-item">' +
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

    showPage('page-detail');
}

// ============================================================
// Virtual Keyboard using Hangul.js
// ============================================================
function initVirtualKeyboard() {
    // Key click handler
    $(document).on('click', '.vk-key', function (e) {
        e.preventDefault();
        var key = $(this).attr('data-key');
        var action = $(this).attr('data-action');
        var $input = $('#global-search-input');

        if (action === 'delete') {
            g_jamoList.pop();
            var composed = Hangul.assemble(g_jamoList);
            $input.val(composed);
            $('.sync-search-input').val(composed);
        } else if (action === 'search') {
            executeSearch();
        } else if (action === 'clear') {
            g_jamoList = [];
            $input.val('');
            $('.sync-search-input').val('');
        } else if (key) {
            g_jamoList.push(key);
            var assembledStr = Hangul.assemble(g_jamoList);
            $input.val(assembledStr);
            $('.sync-search-input').val(assembledStr);
        }
    });
}

// Project Data Database
var g_searchMode = 'employee';
var g_projectData = [
    { id: "PRJ-2026-001", name: "K2 전차 품질보증 및 성능개선 사업", dept: "안전혁신실", pos: "진행중" },
    { id: "PRJ-2026-002", name: "KF-21 체계개발 품질검증 사업", dept: "첨단미래기술센터", pos: "진행중" },
    { id: "PRJ-2026-003", name: "차세대 획득체계 AI 품질 분석 사업", dept: "정책기획실", pos: "기획중" },
    { id: "PRJ-2026-004", name: "군수품 정기 품질검사 및 신뢰성 평가", dept: "경영지원실", pos: "진행중" },
    { id: "PRJ-2026-005", name: "방산 수출 지원 DQMS 인증 지원 사업", dept: "대외협력기획실", pos: "진행중" },
    { id: "PRJ-2026-006", name: "함정무기체계 신뢰성 평가 및 기술지원", dept: "법무실", pos: "완료" },
    { id: "PRJ-2026-007", name: "드론·무인체계 품질 검증 가이드라인 구축", dept: "인재개발실", pos: "진행중" }
];

function setSearchMode(mode) {
    g_searchMode = mode;
    g_jamoList = [];
    $('#global-search-input').val('');

    if (mode === 'project') {
        $('.header-title').text('주요사업검색');
        $('#search-guide-title').html('<span>사업명, 부서별</span>로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('.sync-search-input').attr('placeholder', '사업명으로 검색').val('');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('사업코드');
        $('#th-col-3').text('담당부서');
        $('#th-col-4').text('진행상태');

        renderEmployeeList(g_projectData);
    } else if (mode === 'ai') {
        $('.header-title').text('AI 검색');
        $('#search-guide-title').html('<span>AI 질의 및 키워드</span>로 검색하세요');
        $('#search-guide-sub').html('원하시는 키워드를 입력하시면 <span>AI 분석 결과</span>를 찾아드립니다.');
        $('.sync-search-input').attr('placeholder', 'AI 질의어 입력').val('');

        $('#th-col-1').text('사업명');
        $('#th-col-2').text('코드');
        $('#th-col-3').text('부서명');
        $('#th-col-4').text('상태');

        renderEmployeeList(g_projectData);
    } else { // 'employee'
        $('.header-title').text('직원 정보 검색');
        $('#search-guide-title').html('<span>성명, 사번, 부서명</span>으로 검색하세요');
        $('#search-guide-sub').html('부서를 선택하시면 <span>부서별 검색</span>을 하실 수 있습니다.');
        $('.sync-search-input').attr('placeholder', '성명, 사번, 부서명으로 검색하세요').val('');

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

    // 3. Hangul.js disassembly search
    if (typeof Hangul !== 'undefined' && Hangul.search) {
        if (Hangul.search(text, query) >= 0) return true;
    }

    return false;
}

function clearSearchInput() {
    g_jamoList = [];
    $('#global-search-input').val('');
    $('.sync-search-input').val('');
    var sourceData = (g_searchMode === 'project' || g_searchMode === 'ai') ? g_projectData : g_employeeData;
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
            isKoreanMatch(item.pos, query);

        var matchDept = (g_activeDeptFilter === 'ALL') || (item.dept.includes(g_activeDeptFilter));
        return matchQuery && matchDept;
    });

    renderEmployeeList(filtered);
    showPage('page-list');
}

// ============================================================
// Organization Tree & Filters
// ============================================================
function initOrgTree() {
    $(document).on('click', '.tree-label', function (e) {
        e.stopPropagation();
        var $node = $(this).parent('.tree-node');
        
        // Toggle collapse/expand
        if ($node.hasClass('expanded')) {
            $node.removeClass('expanded');
        } else {
            $node.addClass('expanded');
        }

        // Active highlight
        $('.tree-label').removeClass('active');
        $(this).addClass('active');

        // Filter by dept
        var deptName = $(this).attr('data-dept');
        if (deptName) {
            g_activeDeptFilter = deptName;
            $('#list-dept-heading').text(deptName === 'ALL' ? '국방기술품질원' : deptName);
            executeSearch();
        }
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

    // Landing Page Card Clicks -> Open Corresponding Search Mode
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

    // Search Input Bar click on list/detail screens -> Open Keyboard Mode (Screen 4)
    $('.trigger-keyboard-mode').on('click', function () {
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

    $('#btn-led-enlarge').on('click', function () {
        $('#led-modal').addClass('active');
    });

    $('#btn-close-led').on('click', function () {
        $('#led-modal').removeClass('active');
    });

    // Keyboard Close Button
    $('#vk-close-btn').on('click', function () {
        showPage('page-list');
    });

    // Department Select Box Change
    $('#dept-select').on('change', function () {
        var selectedVal = $(this).val();
        g_activeDeptFilter = selectedVal;
        $('#list-dept-heading').text(selectedVal === 'ALL' ? '국방기술품질원' : selectedVal);
        executeSearch();
    });
}
