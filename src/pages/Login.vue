<template>
  <q-page class="flex flex-center">
    <q-card class="login-card" flat bordered>
      <!-- Card Header -->
      <q-card-section>
        <div class="text-h6 text-center">로그인</div>
      </q-card-section>

      <!-- 입력 필드 -->
      <q-card-section>
        <q-form @submit="onLogin">
          <!-- 아이디 입력 -->
          <q-input
            v-model="form.username"
            label="아이디"
            outlined
            dense
            clearable
            required
          />
          <q-space />

          <!-- 비밀번호 입력 -->
          <q-input
            v-model="form.password"
            label="비밀번호"
            type="password"
            outlined
            dense
            clearable
            required
          />

          <q-space />
          <br/>
          <!-- 로그인 버튼 -->
          <q-btn
            type="submit"
            label="로그인"
            color="primary"
            unelevated
            class="full-width q-mb-sm"
          />
        </q-form>
      </q-card-section>


      <!-- 카카오 로그인 버튼 -->
      <q-card-section class="text-center">
        <q-btn
          label="카카오 로그인"
          color="yellow-8"
          unelevated
          class="full-width"
          @click="onKakaoLogin"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-chat" size="sm" />
          </template>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async onLogin() {
      const param = {name: this.form.username, password: this.form.password}
      try {
        const response = await this.$store.dispatch('loginMember', param);
        console.log('response login.vue>>>', response );
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            message: "로그인 성공!",
          });
          if(response.data.lecturer_id !== null){
            const lecturer_id = response.data.lecturer_id;
            await this.$store.dispatch("fetchLecturerInfo", lecturer_id); // 데이터를 미리 로드
            this.$router.push('/lecturerMain');
          }else if(response.data.member_id !== null){

            this.$router.push('/StudentMainCalendar');
          }else if(response.data.admin_id !== null){
            this.$router.push('/admin');
          }
        }
      }catch (err){
        console.error('Login failed >>>', err);
        const error = err.response.data.errorMessage;
        if (error === 'InvalidUserId') {
          this.$q.dialog({
            title: "로그인 실패",
            message: "존재하지 않는 아이디입니다.",
          });
        } else if (error === 'InvalidPassword') {
          this.$q.dialog({
            title: "로그인 실패",
            message: "비밀번호가 틀렸습니다.",
          });
        } else {
          this.$q.dialog({
            title: "로그인 실패",
            message: "로그인에 실패했습니다. 다시 시도해주세요.",
          });
        }
      }

      if (!this.form.username || !this.form.password) {
        this.$q.notify({
          type: "negative",
          message: "아이디와 비밀번호를 입력하세요.",
        });
        return;
      }
    },

    onKakaoLogin() {
      // 카카오 로그인 로직
      console.log("Kakao login clicked");
      this.$q.notify({
        type: "info",
        message: "카카오 로그인을 진행합니다.",
      });
    },
  },
};
</script>

<style lang="css">
.login-card {
  width: 300px;
  max-width: 90%;
}
.full-width {
  width: 100%;
}
</style>
