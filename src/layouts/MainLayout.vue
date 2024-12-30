<template>
<!--    <Header/>-->

  <q-layout view="lHh Lpr lFf">


    <!--  q-header -->
    <q-header elevated>
      <q-toolbar>
        <!-- 햄버거 메뉴 버튼 -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>

      <div>
        <div class="text-subtitle1">{{todayDate}}</div>
      </div>

      <!-- 로그인, 회원가입, 고객센터 -->
      <q-btn flat label="로그인" color="primary" class="q-mr-sm" @click="goToLogin" />
      <q-btn flat label="회원가입" color="primary" class="q-mr-sm" @click="goToSignUp" />
      <q-btn flat label="고객센터" color="primary" class="q-mr-sm" @click="goToSupport" />
      <q-btn flat label="로그아웃" color="primary" class="q-mr-sm" @click="goToLogOut" />
      <q-img
        src="../statics/coffee.jpg"
        class="header-image absolute-top"/>

    </q-header>

    <!--  drawer start -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="600"
    >
      <q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item
            to="/"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>

            <q-item-section>
              Todo
            </q-item-section>
          </q-item>

          <q-item
            to="/main"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              MainPage
            </q-item-section>
          </q-item>

          <q-item
            to="/login"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              login
            </q-item-section>
          </q-item>


          <q-item
            to="/lecturerMain"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              lecturerMain
            </q-item-section>
          </q-item>

          <q-item
            to="/lecturerList"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              lecturerList
            </q-item-section>
          </q-item>

          <q-item
            to="/StudentMainCalendar"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              StudentMainCalendar
            </q-item-section>
          </q-item>

          <q-item
            to="/enrollment"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              enrollment
            </q-item-section>
          </q-item>

          <q-item
            to="/payment"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              payment
            </q-item-section>
          </q-item>

          <q-item
            to="/admin"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              admin
            </q-item-section>
          </q-item>

          <q-item
            to="/joinLecturerForm"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              joinLecturerForm
            </q-item-section>
          </q-item>

          <q-item
            to="/joinStudentForm"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              joinStudentForm
            </q-item-section>
          </q-item>

          <q-item
            to="/qna"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              qna
            </q-item-section>
          </q-item>

          <q-item
            to="/notice"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              notice
            </q-item-section>
          </q-item>

          <q-item
            to="/test"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              test
            </q-item-section>
          </q-item>

          <q-item
            to="/jobInterviewCalendar"
            exact
            clickable
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              jobInterviewCalendar
            </q-item-section>
          </q-item>



        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 192px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
<!--            <img src="../statics/mypic.jpg">-->
          </q-avatar>
          <div class="text-weight-bold">Brian Kim</div>
          <div>@brian</div>
        </div>
      </q-img>
    </q-drawer>
    <!--  drawer end -->

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>

</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import {date} from 'quasar';
import Header from 'pages/Header.vue'

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    Header
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed:{
    todayDate(){
      let timeStamp = Date.now();
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY');
    }
  },
  methods:{
    goToLogin(){
      this.$router.push(`/login`);
    },
    goToSignUp(){

    },

    goToSupport(){

    },
    goToLogOut(){ // /logdut호출 안 하고, 그냥 저장된 토큰만 삭제하기로 함. 새션방식이였으면, 그 호출 필요했을 것.
      localStorage.removeItem('Authorization');
      console.log(' removeItem gn>>>', localStorage.getItem('Authorization'));
      this.$store.state.loginUserInfo = null;
      localStorage.removeItem('loginLecturerInfo');
    },
  }
}


const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

</script>
<style lang="css">
.header-image {
  height: 100%; z-index: -1; opacity: 0.7;
}
</style>
