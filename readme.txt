quasar 프로젝트 241109

내 노트패드에 위 이름으로 저장됨.

Quasar v1은 Vue 2를 사용하므로, Chart.js와의 호환성을 확인하세요.

실행
quasar dev

http://localhost:8080

"quasar": "^1.0.0",
"@fullcalendar/core": "^5.11.5",

vue@2.7.16 <-- 현재 버전.
vuex@3.6.2
(vuex 3.x.x과 vue 2.x.x과 호완 되는 것.)
Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.


Vue 2용 FullCalendar는, @fullcalendar/vue 5.x 버전을 사용해야 합니다.
Vue 2에서 Vue 3용 FullCalendar(6.x 버전)를 사용하면 호환성 문제가 발생합니다.
FullCalendar 6.x부터는 Vue 2 지원이 중단되었습니다. Vue 3로 마이그레이션할 계획이 없는 경우 FullCalendar 5.x를 유지하세요.

여기 vue2에도 composition API - setup()을 플러그인 설치하면 사용할 수 있다.


이 강의 --todo
끝부문에 안드로이드, 맥등에서 앱 실행하는 것 보여줌. 39'41

--------
그럼, props값을 자식에서 수정될때, 부모로 emit하고, 부모에서 데이터를 서버에 저장해야 하나?

네, 일반적으로 props 값을 자식에서 수정할 때 부모로 emit하고, 부모에서 데이터를 서버에 저장하는 것이 권장되는 구조입니다. 이 방식은 Vue의 단방향 데이터 흐름 원칙을 유지하면서도 데이터를 서버와 동기화하는 데 유용합니다.

----
colums중복 콘솔 에러 -- vue2로 바꿔야.

Vue 2 project(Quasar v1)
https://v1.quasar.dev/


******* LecturerMain.vue *******
<!-- 강사 정보를 보여주는 섹션 -->
<NewStudentForLecturer />
<AllStudentForLecturer :lessons="lessonsData"/>
<LecturerCalendar />
  - <FullCalendar>
  - <ScheduleDetailForLecturer> <-- emit



안드로이드 설정중
Checking Java JDK and Android SDK versions
ANDROID_HOME=undefined (recommended setting)
ANDROID_SDK_ROOT=undefined (DEPRECATED)
Using Android SDK: C:\Users\USER\AppData\Local\Android\sdk
Could not find an installed version of Gradle either in Android Studio,
or on your system to install the gradle wrapper. Please include gradle
in your path, or install Android Studio
에러 남. 241110

