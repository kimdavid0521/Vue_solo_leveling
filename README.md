# Solo-Leveling

<div align="center">
<img width="329" alt="image" src="./bank-poke/src/assets/bankPoke.png">

</div>

# Bank-Poke
> **KB It's Your Life 6기 스켈레톤 프로젝트 ** <br/> **개발기간: 2025.04.07 ~ 2025.04.11**

## 배포 주소

> **프론트 서버** : 추후 주소 추가<br>


## 웹개발팀 소개

|        강영광     |        김태영       |       강지호        |       조승훈        |                                                                                                       
| :--------------: | :--------------------: | :----------------: | :------------------: |  
|   <img width="160px" src="bank-poke/src/assets/user-2935527_1280.png" />    |   <img width="160px" src="bank-poke/src/assets/user-2935527_1280.png" />   |     <img width="160px" src="bank-poke/src/assets/user-2935527_1280.png" />   |  <img width="160px" src="bank-poke/src/assets/user-2935527_1280.png" />   |
|   [@glorypang](https://github.com/glorypang)   |    [@kimdavid0521](https://github.com/kimdavid0521)  | [@dudujh0106](https://github.com/dudujh0106)  |  [@cho-seung-hoon](https://github.com/cho-seung-hoon)
| KB It's Your Life 6기 | KB It's Your Life 6기 | KB It's Your Life 6기 | KB It's Your Life 6기 |

## 프로젝트 소개

소비를 기록하고, 자산을 관리하며, 더 나은 금융 습관을 만들어가는 첫걸음!
BankPoke는 가계부 작성을 쉽고 즐겁게 도와주는 웹 서비스입니다.

## 시작 가이드
### Requirement

해당 프로젝트를 실행하기 위해 아래 환경이 필요합니다:

- [Node.js 18+](https://nodejs.org/)  
- [npm 9+](https://www.npmjs.com/)
- [json-server](https://github.com/typicode/json-server) (로컬 API 서버용)
- [Vue 3](https://vuejs.org/) (Vite 기반)
- **Bootstrap 5** (CDN 또는 npm 설치)
- **Fontawesome** (CDN 또는 npm 설치)


### Installation
``` bash
$ git clone https://github.com/your-username/BankPoke.git
$ cd BankPoke
```
#### Backend
```
$ npx json-server db.json
```

#### Frontend
```
$ cd BankPole
$ npm install 
$ npm run dev
```

---

## Stacks 🐈

###  Development Environment
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

###  Config & Package
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-000000?style=for-the-badge&logo=JSON&logoColor=white)

---

###  Frontend
![Vue.js](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FADA5E?style=for-the-badge&logo=pinia&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font%20Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)

---

### Communication & Collaboration
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
---

### 📝 Version Control & Deployment
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---
## 화면 구성 📺
| 메인 페이지  |  소개 페이지   |
| :-------------------------------------------: | :------------: |
|  <img width="329" src="https://user-images.githubusercontent.com/50205887/208036155-a57900f7-c68a-470d-923c-ff3c296ea635.png"/> |  <img width="329" src="https://user-images.githubusercontent.com/50205887/208036645-a76cf400-85bc-4fa2-af72-86d2abf61366.png"/>|  
| 강좌 소개 페이지   |  강의 영상 페이지   |  
| <img width="329" src="https://user-images.githubusercontent.com/50205887/208038737-2b32b7d2-25f4-4949-baf5-83b5c02915a3.png"/>   |  <img width="329" src="https://user-images.githubusercontent.com/50205887/208038965-43a6318a-7b05-44bb-97c8-b08b0495fba7.png"/>     |

---
## 주요 기능 📦

### ⭐️ 강좌 선택 및 강의 영상 시청 기능
- Scratch, Python 2개 강좌 및 각 강좌마다 10개 가량의 강의 영상 제공
- 추후 지속적으로 강좌 추가 및 업로드 예정

### ⭐️ 강의 관련 및 단체에 대한 자유로운 댓글 작성 가능
- Disqus를 이용하여 강의 관련 질문이나 단체에 대한 질문 작성 가능

### ⭐️ 이어 학습하기 기능
- Cookie 기능을 이용하여 이전에 학습했던 내용 이후부터 바로 학습 가능

---
## 아키텍쳐

### 디렉토리 구조
```bash
├── README.md
├── package-lock.json
├── package.json
├── strapi-backend : 
│   ├── README.md
│   ├── api : db model, api 관련 정보 폴더
│   │   ├── about
│   │   ├── course
│   │   └── lecture
│   ├── config : 서버, 데이터베이스 관련 정보 폴더
│   │   ├── database.js
│   │   ├── env : 배포 환경(NODE_ENV = production) 일 때 설정 정보 폴더
│   │   ├── functions : 프로젝트에서 실행되는 함수 관련 정보 폴더
│   │   └── server.js
│   ├── extensions
│   │   └── users-permissions : 권한 정보
│   ├── favicon.ico
│   ├── package-lock.json
│   ├── package.json
│   └── public
│       ├── robots.txt
│       └── uploads : 강의 별 사진
└── voluntain-app : 프론트엔드
    ├── README.md
    ├── components
    │   ├── CourseCard.js
    │   ├── Footer.js
    │   ├── LectureCards.js
    │   ├── MainBanner.js : 메인 페이지에 있는 남색 배너 컴포넌트, 커뮤니티 이름과 슬로건을 포함.
    │   ├── MainCard.js
    │   ├── MainCookieCard.js
    │   ├── NavigationBar.js : 네비게이션 바 컴포넌트, _app.js에서 공통으로 전체 페이지에 포함됨.
    │   ├── RecentLecture.js
    │   └── useWindowSize.js
    ├── config
    │   └── next.config.js
    ├── lib
    │   ├── context.js
    │   └── ga
    ├── next.config.js
    ├── package-lock.json
    ├── package.json
    ├── pages
    │   ├── _app.js
    │   ├── _document.js
    │   ├── about.js
    │   ├── course
    │   ├── index.js
    │   ├── lecture
    │   ├── newcourse
    │   ├── question.js
    │   └── setting.js
    ├── public
    │   ├── favicon.ico
    │   └── logo_about.png
    └── styles
        └── Home.module.css

```


```
-->
