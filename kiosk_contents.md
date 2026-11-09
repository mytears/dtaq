# 키오스크 JSON 백엔드 연동 안내

키오스크는 화면을 열 때 `data/kiosk_contents.json`을 읽습니다. 백엔드에서 이 경로로 UTF-8 JSON 객체를 내려주면 됩니다. 대기 시간 키는 `idelTime`이고, 무기 목록은 최상위 `weapons_list` 배열입니다.

| 키 | 형태 | 어디에 쓰나요? |
| --- | --- | --- |
| `welcome` | 객체 | 방문객 환영 화면 |
| `standby` | 객체 | 대기 화면의 배경과 문구, 대기 시간 |
| `dept` | 배열 | 조직도, 부서 선택 목록, 상위 부서 검색 |
| `employees_list` | 배열 | 직원 검색과 상세 화면 |
| `weapons_list` | 배열 | 무기체계 검색과 상세 화면 |

## `welcome` · 방문객 환영 화면

| 키 | 형태 | 의미 |
| --- | --- | --- |
| `show` | 불리언 | `true`면 대기 화면에 환영 화면을 띄웁니다. `false`면 일반 시작 버튼을 표시합니다. |
| `background` | 문자열 | 배경 이미지 경로. 예시 `commonfiles/bg_welcome-1.png` |
| `subtitle` | 문자열 | 제목 위의 짧은 문구. 예시 `WELCOME` |
| `title` | 문자열 | 환영 대상. 예시 `방문단` |
| `message` | 문자열 | 환영 인사. 예시 `방문을 환영합니다` |
| `scheduleTitle` | 문자열 | 일정 항목 제목. 예시 `일정` |
| `schedule` | 문자열 | 시간, 장소 등 일정 내용 |

## `standby` · 대기 화면

| 키 | 형태 | 의미 |
| --- | --- | --- |
| `background` | 문자열 | 배경 이미지 경로. 예시 `commonfiles/bg_screen.png` |
| `title` | 문자열 | 시작 버튼의 큰 문구 |
| `subtitle` | 문자열 | 시작 버튼의 작은 문구 |
| `idelTime` | 양수 | 마지막 조작 후 대기 화면으로 돌아갈 때까지의 시간(초). 기본값은 `180`입니다. |

배경 경로는 키오스크 `index.html` 기준으로 `commonfiles/` 또는 `images/`에서 시작합니다. 시작 버튼의 깜빡임은 화면에서 2초 주기로 처리합니다.

## `dept` · 조직도와 부서 선택

부서마다 `name`(화면에 표시할 부서명)과 `deptCode`(고유한 부서 코드 문자열)를 넣습니다. 하위 부서가 있으면 `children` 배열 안에 같은 형식으로 넣습니다. 배열에 적은 순서대로 조직도와 드롭다운에 표시되며, 상위 부서를 선택하면 그 아래 모든 단계의 부서가 검색 범위에 들어갑니다.

직원의 `employees_list[].deptCode`는 조직도의 소속 부서 코드와 같아야 합니다. 부서 이름이 바뀌면 조직도의 `name`만 바꾸고 코드는 유지해 주세요. 예를 들어 `고정익팀`의 이름을 바꿔도 코드가 `QLT_AIR_FW`면 해당 직원이 새 부서명으로 표시되고 검색됩니다. 코드로 찾을 수 없는 기존 직원 데이터는 `dept`의 이름으로 연결합니다.

직원 데이터에서 확인할 수 없었던 `감사`와 상위 부서 15곳에는 현재 파일에서 사용할 코드를 지정했습니다. 백엔드에 공식 코드가 있으면 조직도와 해당 직원의 코드를 함께 맞춰 주세요. `ALL`은 화면의 전체부서 선택에 사용합니다.

## `employees_list` · 직원 목록

직원 한 명을 객체 하나로 넣습니다.

| 키 | 형태 | 의미 |
| --- | --- | --- |
| `id` | 문자열 | 직원마다 고유한 사번. 앞자리 `0`이 있을 수 있으므로 문자열로 전달합니다. |
| `name` | 문자열 | 직원 이름 |
| `dept` | 문자열 | 직원 데이터의 현재 근무 부서명. 조직도에서 이름을 찾을 수 없을 때 표시합니다. |
| `deptCode` | 문자열 | 현재 근무 부서의 코드. 조직도에 있는 같은 코드의 부서와 연결됩니다. |
| `pos` | 문자열 | 현재 직책 또는 직급 |
| `email` | 문자열 | 업무 이메일 |
| `phone` | 문자열 | 업무 전화번호 |
| `photo` | 문자열 | 프로필 사진 경로. 예시 `images/employee.png` |
| `duties` | 문자열 배열 | 담당 업무 목록. 첫 항목을 직원 상세 화면과 LED 화면에 표시합니다. |
| `history` | 객체 배열 | 상세 화면에 입력 순서대로 표시할 근무이력 |

`history` 항목에는 `date`(근무 기간 문구), `dept`(당시 부서), `pos`(당시 직책)를 문자열로 넣습니다. `history`가 비어 있으면 현재 화면은 샘플 이력을 표시합니다.

직원 검색어는 이름, 사번, 현재 부서명, 현재 직책, 이메일을 대상으로 합니다. 부서 필터에는 현재 부서 코드를 사용합니다.

## `weapons_list` · 무기체계 목록

키오스크는 `weapons_list` 배열에서 무기체계 목록을 읽고 `name`으로 검색합니다.

| 키 | 형태 | 의미 |
| --- | --- | --- |
| `id` | 문자열 | 무기체계마다 고유한 ID |
| `name` | 문자열 | 무기체계 이름 |
| `branch` | 문자열 | `army`(육군), `navy`(해군), `air`(공군) 중 하나. 그 외 값은 기타로 표시합니다. |
| `image` | 문자열 | 무기 사진 경로. `images/`로 시작하며 사진이 없으면 빈 문자열을 사용합니다. |
| `development` | 문자열 | 개발형태 |
| `manufacturer` | 문자열 | 제조업체 |
| `period` | 문자열 | 사업기간 또는 양산 시기 |
| `performance` | 문자열 배열 | 주요 성능. 성능 정보가 없으면 `[]`를 전달합니다. |
| `description` | 문자열 | 기타 설명 |

각 무기 항목에는 문자열 `id`, 문자열 `name`, 배열 `performance`가 필요합니다.

## 전체 JSON 예시

```json
{
  "welcome": {
    "show": false,
    "background": "commonfiles/bg_welcome-1.png",
    "subtitle": "WELCOME",
    "title": "방문단",
    "message": "방문을 환영합니다",
    "scheduleTitle": "일정",
    "schedule": "10:00 본관 회의실"
  },
  "standby": {
    "background": "commonfiles/bg_screen.png",
    "title": "화면을 터치해주세요",
    "subtitle": "TOUCH TO START",
    "idelTime": 180
  },
  "dept": [
    {
      "name": "품질연구본부",
      "deptCode": "QLT",
      "children": [
        {
          "name": "항공센터",
          "deptCode": "QLT_AIR",
          "children": [{ "name": "고정익팀", "deptCode": "QLT_AIR_FW" }]
        }
      ]
    }
  ],
  "employees_list": [
    {
      "id": "000001",
      "name": "홍길동",
      "dept": "고정익팀",
      "deptCode": "QLT_AIR_FW",
      "pos": "연구원",
      "email": "employee@example.com",
      "phone": "000-0000-0000",
      "photo": "images/employee.png",
      "duties": ["항공기 품질 점검"],
      "history": [
        { "date": "2023.01 ~ 2024.12", "dept": "품질기획실", "pos": "연구원" }
      ]
    }
  ],
  "weapons_list": [
    {
      "id": "weapon-01",
      "name": "예시 무기체계",
      "branch": "army",
      "image": "",
      "development": "국내 개발",
      "manufacturer": "예시 제조사",
      "period": "2024~2026",
      "performance": ["성능 항목 1", "성능 항목 2"],
      "description": "기타 설명"
    }
  ]
}
```
