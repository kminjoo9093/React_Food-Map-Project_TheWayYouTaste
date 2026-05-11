# 맛집 공유 서비스 [니맛대로] - Frontend

사용자 참여(맛집 등록 요청, 리뷰, 신고) 기반 맛집 정보 공유 및 관리 웹 서비스
<br><br>

<img width="600" alt="image" src="https://github.com/user-attachments/assets/cf3cb909-6e83-429b-bcbd-253f13b5fd62" />
<img width="550" alt="image" src="https://github.com/user-attachments/assets/a2df2246-e4fb-4a0c-898d-a0d4541783f2" />


<br><br>

### 🔗 Link
🌐 [배포 링크 바로가기 →](https://the-way-you-taste.vercel.app) <br>
초기 접속 시 서버가 활성화되는 데 약 30초~1분의 로딩 시간이 소요될 수 있습니다. 잠시만 기다려주시면 감사하겠습니다.
<br><br>
🎬 [시연 영상 바로가기 →](https://drive.google.com/file/d/1_KJ2dRvbtXWWgIKGapKBwEmorx42Ctz4/view?usp=sharing) 
<br><br>
[Backend Repository 바로가기 →](https://github.com/kminjoo9093/SpringBoot_Food-Map-Project_TheWayYouTaste)

<br>

### 🛠 Frontend Stack

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-000000?style=for-the-badge)

<br><br>

## 🔍 기여한 부분

#### **지도 찾기 페이지 개발** &emsp;

- **[현재 위치 기반 좌표](./src/hooks/useGeolocation.js) → [행정구역 변환 및 지역 세팅](./src/hooks/useInitLocationInfo.js) → [지역 기반 맛집 데이터 로딩](./src/pages/search/SearchStore.js#L95-L105)** 흐름 설계로 <br>
초기에 별도의 사용자 입력 없이 지역 자동 설정 및 주변 맛집 리스트 즉시 제공하여 탐색 단계 최소화
- 포트폴리오 배포 환경 제약으로 기존 '시 전체' 맛집 데이터 조회 방식 사용이 어려운 문제를 [클라이언트 측 조회 로직 개선](./src/api/storeApi.js#L12-L21)으로 해결
- **URL Query Parameter와 전역 상태(지역, 음식 카테고리 필터)를 동기화**하여 페이지 간 이동 시 검색 조건 유지 및 실제 적용된 검색 조건과 UI 선택 상태 간 불일치 방지
- [카카오 지도 API 연동 및 MarkerClusterer, CustomOverlay를 활용한 맛집 데이터 시각화](./src/components/MapComponent.js)
- 지도 idle 이벤트를 사용하여 사용자 인터렉션 기반 [뷰포트 범위 내 데이터 재조회](./src/api/storeApi.js#L30-L46) 구현 및 
**범위 내 재검색 버튼**으로 불필요한 데이터 요청 최소화
- **Zustand** 기반 전역 상태 관리 : 시도/시군구/읍면동 지역과 카테고리 필터 상태를 전역으로 관리하여 컴포넌트 간 상태 공유
- **TanStack Query를 활용하여 서버 상태와 클라이언트 상태를 분리**하고, 쿼리 키 설계를 통해 데이터 캐싱 및 재사용 구조 구축
- [계층형 지역 선택 구조(시도 → 시군구 → 읍면동)로 불필요한 API 호출 방지 및 잘못된 하위 선택 차단](./src/components/RegionModal.js)

<br><br>

#### **맛집 상세 페이지 개발** &emsp; [ 코드 보기 → ](./src/pages/store/StoreDetail.js)

- URL 파라미터 기반으로 데이터 조회
- [매장 편의시설 데이터를 사용자 친화적인 텍스트로 변환 후 표시하고, <br/>
  아이콘 매핑은 CSS 클래스와 연결하여 UI 스타일을 동적으로 적용](./src/pages/store/StoreDetail.js#L63-L83)

<br><br>

#### 기타 기능 구현

- 메인페이지에서 위치 & 필터링 기반 맛집 검색
- 헤더, 푸터, 메뉴 및 로그인 페이지 반응형 구현

<br><br><br>

## 💡 문제 해결 및 성과

#### **1. 데이터 검색 범위가 제한되는 문제를 해결하기 위해 ‘범위 내 재검색’ 버튼 추가로 데이터 호출 메커니즘 전환** &emsp; 

- **문제**
  - 사용자의 지도 이동 및 확대/축소에 따른 지역 변화에 대응하기 위해 고정된 행정구역 경계를 벗어나 <br/>
    **실시간으로 다중 지역 데이터를 통합 조회해야 할 필요성**을 인식
    <br/>
    
- **해결**
  - [**‘범위 내 재검색' 버튼**을 데이터 호출 파라미터 전환 트리거로 활용](./src/pages/search/SearchStore.js#L199-L230)하여  <br/>
     특정 행정 구역 중심에서 **뷰포트 좌표(positionAreaRef) 기반 호출로 검색 메커니즘 변경**
  - 지도 idle이벤트와 useRef(positionAreaRef)를 활용하여 지도 이동 시 최신 뷰포트 좌표만 저장하고, <br/>
    ‘범위 내 재검색' 버튼 클릭 시 해당 좌표로 API를 호출하도록하여 불필요한 리렌더링 최소화
  - isChangedRegion 플래그를 통해 지역 선택 모드/지도 이동 모드 구분으로 검색 컨텍스트에 맞는 데이터 매핑 구현
    <br/>
    
- **결과**
  - 사용자 중심의 동적 검색 환경 구축을 통해 검색 유연성을 확보
  - **필요한 시점에만 데이터를 호출함으로써 불필요한 네트워크 비용 절감**

<br><br>

#### **2. 지역 코드 패턴 분석 기반의 파싱 로직 재설계로 데이터 누락 0% 의 무결성 확보**

- **문제**
  - 외부 API로 지역 정보를 불러올 때 시/군/구 단위에서 ‘구’가 존재하는 시의 경우 <br/>
    **‘시 전체’ 데이터 누락**으로 사용자가 해당 데이터를 선택할 수 없음을 확인
    <br/>
    
- **해결**
  - 행정구역 코드 패턴 기반의 데이터 파싱 로직 설계
    - 공백을 구분자로 **지역명을 분리**(Split)하고, **배열 길이**에 따라 **행정구역 단위를 판별**하는 로직 수립
    - 구가 있는 지역의 경우(배열의 길이가 2) <br/>
       '시+구' 명칭 & 5자리 코드와 함께 **'시' 명칭 & 앞 4자리 코드를 별도로 추출** 
    - 설계한 로직을 백엔드 담당자와 공유하여 데이터 적재 로직에 반영될 수 있도록 협업 진행
    <br/>
    
- **결과**
  - '구' 단위 상위 행정구역(시 전체) **누락 문제 100% 해결**
  - ‘시 전체’ 선택이 가능하도록 개선하여 **사용자 검색 범위 확장**
  - DB 적재 전 데이터 존재 검증을 함으로써 동일한 데이터 중복 적재 방지

<br><br>

## 회고

기능 중심으로 빠르게 구현하면서 SearchStore.js 컴포넌트 책임이 다소 커진 부분이 있어 리팩토링을 진행할 필요성이 있다.
