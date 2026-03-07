# 맛집 찾기 프로젝트 니맛대로
사용자 참여(맛집 등록 요청, 리뷰, 신고) 기반 맛집 정보 공유 및 관리 웹 서비스

<br>
시연 영상 : https://drive.google.com/file/d/1_KJ2dRvbtXWWgIKGapKBwEmorx42Ctz4/view?usp=sharing

<br><br>

### Tech Skills
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript)
![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react)
![Java](https://img.shields.io/badge/Java-000000?style=for-the-badge&logo=Java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-000000?style=for-the-badge&logo=springboot)
![JPA](https://img.shields.io/badge/JPA-000000?style=for-the-badge&logo=JPA)
![Oracle](https://img.shields.io/badge/Oracle-000000?style=for-the-badge&logo=oracle)
![SQL](https://img.shields.io/badge/SQL-000000?style=for-the-badge&logo=SQL)


<br><br>

## 기여한 부분


#### **지도 찾기 페이지 개발** &emsp; [ 코드 보기 → ](./src/pages/search)

- 위치/지도 기반 맛집 검색 및 리스트 조회 기능
- 지역/음식 카테고리 필터링 기반 맛집 검색 기능
- **카카오 지도 API 연동 및 클러스터, 마커 활용** &emsp; [ 코드 보기 → ](./src/pages/search/MapComponent.js)
- 지도 API의 idle 이벤트를 사용한 사용자 인터렉션 기반 **뷰포트 범위 내 데이터 재조회** 구현
- 현재 위치 기반 지역 상태 관리 및 초기 데이터 로딩 로직을 **커스텀 훅(useRegionSetting)으로 캡슐화**하여 컴포넌트의 책임 분리 &emsp; [ 코드 보기 → ](./src/pages/search/hook/useRegionSetting.js)
- 초기 로딩 시 사용자 위치 기반 **행정구역 자동 선택** 및 주변 맛집 리스트 즉시 노출로 **탐색 단계 최소화**
- **계층형 지역 선택 구조**(시도 → 시군구 → 읍면동)로 **불필요한 API 호출을 방지 및 잘못된 하위 선택 차단** &emsp; [ 코드 보기 → ](./src/pages/search/RegionModal.js)

<br><br>

#### **맛집 상세 페이지 개발** &emsp; [ 코드 보기 → ](./src/pages/search/StoreDetail.js)

- 지도 찾기 페이지의 마커 인포윈도우와 좌측 리스트 클릭 시 해당 맛집 상세페이지로 이동
- 맛집 리스트 –> 상세 페이지 구조를 RESTful GET 방식으로 설계하고,
    URL 파라미터 기반으로 상세 데이터를 조회하도록 구현
    
<br><br>

#### 기타 기능 구현

- 메인페이지에서 위치 & 필터링 기반 맛집 검색
- 헤더, 푸터, 메뉴 및 로그인 페이지 반응형 구현

<br><br><br>

## 문제 해결 및 성과

#### **1. 데이터 검색 범위가 제한되는 문제를 해결하기 위해 ‘범위 내 재검색’ 버튼 추가로 데이터 호출 메커니즘 전환** &emsp; [ 코드 보기 → ](./src/pages/search/SearchStore.js#L176-L205)

- **문제**
    - 사용자의 지도 이동 및 확대/축소에 따른 지역 변화에 대응하기 위해 고정된 행정구역 경계를 벗어나
        
        **실시간으로 다중 지역 데이터를 통합 조회해야 할 필요성**을 인식
        
- **해결**
    
    - **‘범위 내 재검색' 버튼**을 데이터 호출 파라미터 전환 트리거로 활용하여  
        특정 행정 구역 중심에서 **뷰포트 좌표(positionAreaRef) 기반 호출로 검색 메커니즘 변경**
        
    - 지도 idle이벤트와 useRef(positionAreaRef)를 활용하여 지도 이동 시 최신 뷰포트 좌표만 저장하고,
        ‘범위 내 재검색' 버튼 클릭 시 해당 좌표로 API를 호출하도록하여 불필요한 리렌더링 최소화
        
    - isChangedRegion 플래그를 통해 지역 선택 모드/지도 이동 모드 구분으로 검색 컨텍스트에 맞는 데이터 매핑 구현
    
- **결과**
    - 사용자 중심의 동적 검색 환경 구축을 통해 검색 유연성을 확보
    - **필요한 시점에만 데이터를 호출함으로써 불필요한 네트워크 비용 절감**
        
 <br><br>       

#### **2. 지역 코드 패턴 분석 기반의 파싱 로직 재설계로 데이터 누락 0% 의 무결성 확보**

- **문제**
    - 외부 API로 지역 정보를 불러올 때 시/군/구 단위에서 ‘구’가 존재하는 시의 경우
        
        **‘시 전체’ 데이터 누락**으로 사용자가 해당 데이터를 선택할 수 없음을 확인
        
- **해결**
    
    - 행정구역 코드 패턴 기반의 데이터 파싱 로직 설계
        1. 공백을 구분자로 **지역명을 분리**(Split)하고, **배열 길이**에 따라 **행정구역 단위를 판별**하는 로직 수립
        2. 배열의 길이가 2인 구가 있는 지역의 경우 
            '시+구' 명칭 & 5자리 코드와 함께 **'시' 명칭 & 앞 4자리 코드를 별도로 추출** 후 두 데이터 모두 DB에 적재
            
- **결과**
    - '구' 단위 상위 행정구역(시 전체) **누락 문제 100% 해결**
    - ‘시 전체’ 선택이 가능하도록 개선하여 **사용자 검색 범위 확장**
    - DB 적재 전 데이터 존재 검증을 함으로써 동일한 데이터 중복 적재 방지

<br><br>

## 회고
기능 중심으로 빠르게 구현하면서 SearchStore.js 컴포넌트 책임이 다소 커진 부분이 있어 리팩토링을 진행할 필요성이 있다.
