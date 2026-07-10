# 맛집 공유 서비스 [니맛대로] - Frontend

사용자 참여(맛집 등록 요청, 리뷰, 신고) 기반 맛집 정보 공유 및 관리 웹 서비스
<br><br>

<img width="600" alt="image" src="https://github.com/user-attachments/assets/cf3cb909-6e83-429b-bcbd-253f13b5fd62" />


<br><br>

### 🔗 Link
- 🌐 배포 사이트 : https://the-way-you-taste.vercel.app
<br><br>
- 🎬 [시연 영상 바로가기 →](https://drive.google.com/file/d/1_KJ2dRvbtXWWgIKGapKBwEmorx42Ctz4/view?usp=sharing) 
<br><br>
- ⚙️ [Backend Repository 바로가기 →](https://github.com/kminjoo9093/SpringBoot_Food-Map-Project_TheWayYouTaste)

<br>

### 🛠 Frontend Stack

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-000000?style=for-the-badge)
![Typescript](https://img.shields.io/badge/Typescript-000000?style=for-the-badge&logo=typescript)


<br><br>

## 🔍 기여한 부분

#### **지도 찾기 페이지 개발** &emsp;

- [브라우저 Geolocation API](./src/hooks/useGeolocation.js)와 [카카오 로컬 API활용한 좌표 → 행정구역 변환 로직](./src/hooks/useInitLocationInfo.js)을 활용하여 <br>
초기 별도의 사용자 입력 없이 지역 자동 설정 및 [주변 맛집 리스트를 즉시 제공](./src/pages/search/SearchStore.js)하여 탐색 단계 최소화 및 사용자 경험 개선
- [검색 상태를 URL Query Parameter 중심 구조로 재설계하고, Zustand 기반 UI 상태와의 동기화](./src/pages/search/SearchStore.js)를 통해 검색 조건 유지 및 상태 불일치 문제 해결
- 지도 onIdle 이벤트로 사용자 인터랙션 기반 [뷰포트 범위 내 데이터 재조회](./src/api/storeApi.js#L30-L46) 구현 및 **범위 내 재검색 버튼**도입 으로 불필요한 데이터 요청 최소화 및 검색 범위 제한 문제 해결
- 이미지 WebP 포맷 변환, CDN 기반 리사이징, 지도 마커 클러스터 지연 렌더링 적용을 통해 LCP 약 1.7s → 0.9~1.2s 로 개선
- [계층형 지역 선택 구조(시도 → 시군구 → 읍면동)](./src/components/RegionModal.js)로 불필요한 API 호출 방지 및 잘못된 하위 선택 차단
- [카카오 지도 API 연동 및 MarkerClusterer, CustomOverlay를 활용한 맛집 데이터 시각화](./src/components/MapComponent.js)
- **TanStack Query를 활용하여 서버 상태와 클라이언트 상태를 분리**하고, 쿼리 키 설계를 통해 데이터 캐싱 관리 및 재사용 구조 구축
- 포트폴리오 배포 환경 제약으로 기존 '시 전체' 맛집 데이터 조회 방식 사용이 어려운 문제를 클라이언트 측 조회 로직 개선으로 해결



<br><br>

#### 기타 기능 구현

- 메인페이지에서 위치 & 필터링 기반 맛집 검색
- 헤더, 푸터, 메뉴 및 로그인 페이지 반응형 구현

<br><br><br>

## 💡 문제 해결 및 성과

#### **1. 검색 상태와 UI상태 분리 및 동기화로 검색 조건 유지 및 상태 불일치 문제 해결**

- **문제**
  - 기존 Zustand 및 로컬 상태를 중심으로 검색 조건을 관리하여 새로고침 시 검색 상태가 유지되지 않고,<br/>
    실제 검색 조건과 UI선택 상태가 일치하지 않는 문제 발생 
    <br/>
    
- **해결**
  -  URL Query Parameter를 실제 검색 상태로 재설계하고, Zustand 기반 전역 상태(지역/카테고리 필터)는 UI 선택 상태로 역할 분리
    <br/>
    
- **결과**
  - 새로고침 및 페이지 재진입 시 검색 조건 복원
  - URL 공유를 통한 동일 검색 결과 재현 가능
  - 실제 검색 조건과 UI 선택 상태 일치

<br><br>

#### **2. 행정구역 중심의 검색 제한 문제 해결을 위해 ‘범위 내 재검색’ 기능 구현으로 동적 검색 환경 제공** &emsp; 

- **문제**
  - 사용자의 지도 이동 및 확대/축소에 따른 지역 변화에 대응하기 위해 고정된 행정구역 경계를 벗어나 <br/>
    **실시간으로 다중 지역 데이터를 통합 조회해야 할 필요성**을 인식
    <br/>
    
- **해결**
  - [**‘범위 내 재검색' 기능**](./src/pages/search/SearchStore.js)을 도입하여  <br/>
     특정 행정 구역 기반 검색에서 **뷰포트 좌표(positionAreaRef) 기반 검색으로 전환**
  - 지도 이동 시 최신 뷰포트 좌표를 저장하고, 사용자 요청 시 해당 범위의 데이터만 조회하도록 설계
  - 검색 모드를 분리하여 지역 검색과 지도 기반 검색에 맞는 UI 제공
    <br/>
    
- **결과**
  - 사용자가 보고 있는 지도 영역 기준으로 데이터를 조회할 수 있는 동적 검색 환경 구축
  - **데이터 조회 시점을 제어하여 불필요한 API 요청 감소**
 
<br><br>


#### **3. 지역 리스트의 '시 전체' 데이터 누락 문제 해결을 위해 행정 구역 코드 패턴 분석 기반의 데이터 파싱 로직 재설계**

- **문제**
  - 지역 선택 시 '구'가 포함된 지역의 경우 **'시 전체' 데이터가 제공되지 않아** <br/> 사용자가 상위 행정구역을 선택할 수 없는 문제 발생
    <br/>
    
- **해결**
  - 행정구역 코드 패턴 기반의 데이터 파싱 로직 설계
    1. 지역명을 분리 및 행정구역 단위(시·군·구)를 판별
    2. '구'가 포함된 지역은 상위 행정구역 조회를 지원할 수 있도록 **'시+구' 데이터와 '시' 데이터를 각각 추출**하도록 설계
    3. 설계 내용을 백엔드 담당자와 공유하여 데이터 적재 로직에 반영
    <br/>
    
- **결과**
  - **행정구역 데이터 누락 없이 시·구 단위 조회가 가능한 구조 구축**
  - 기존에 조회할 수 없었던 상위 지역 검색을 지원하여 **사용자 검색 범위 확대**

