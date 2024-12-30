<template>
  <q-page padding>
    <q-card class="q-pa-md q-mx-auto" style="max-width: 600px">
      <q-card-section>
        <div class="text-h5 text-center">Join Student Form</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="submitForm" @reset="resetForm" class="q-gutter-md">
          <!-- User ID -->
          <q-input
            filled
            label="User ID"
            v-model="student.user_id"
            :rules="[val => !!val || 'User ID is required']"
            clearable
          />

          <!-- Mugshot -->
          <q-uploader
            filled
            label="Mugshot (Upload)"
            :url="uploadMugshotUrl"
            @uploaded="handleMugshotUpload"
          />

          <!-- Name -->
          <q-input
            filled
            label="Name"
            v-model="student.name"
            :rules="[val => !!val || 'Name is required']"
            clearable
          />

          <!-- Password -->
          <q-input
            filled
            label="Password"
            v-model="student.password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            clearable
          />

          <!-- Email -->
          <q-input
            filled
            label="Email"
            v-model="student.email"
            type="email"
            :rules="[val => !!val || 'Valid email is required']"
            clearable
          />

          <!-- Phone Number -->
          <q-input
            filled
            label="Phone Number"
            v-model="student.phone_number"
            mask="####-####-####"
            :rules="[val => !!val || 'Phone number is required']"
            clearable
          />

          <!-- Skype ID -->
          <q-input
            filled
            label="Skype ID"
            v-model="student.skype_id"
            clearable
          />

          <!-- Kakao ID -->
          <q-input
            filled
            label="Kakao ID"
            v-model="student.kakao_id"
            clearable
          />

          <div class="row justify-center q-mt-lg">
            <q-btn label="Submit" color="primary" type="submit" />
            <q-btn label="Reset" color="negative" flat type="reset" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 학생 정보
      student: {
        member_id: 0,
        user_id: '',
        mugshot: '',
        name: '',
        password: '',
        email: '',
        phone_number: '',
        skype_id: '',
        //kakao_id: '',
      },
      uploadMugshotUrl: '/api/upload/mugshot', // 예시 업로드 URL
    };
  },
  methods: {
    // 폼 제출 핸들러
    submitForm() {
      console.log('Submitting student data:', this.student);
      axios.post('http://localhost:8080/joinStudent', this.student)
        .then(({data})=>{
          console.log('joinStudent >>>', data);
        })
    },
    // 폼 리셋 핸들러
    resetForm() {
      this.student = {
        user_id: '',
        mugshot: '',
        name: '',
        password: '',
        email: '',
        phone_number: '',
        skype_id: '',
        kakao_id: '',
      };
    },
    // 머그샷 업로드 핸들러
    handleMugshotUpload(file) {
      this.student.mugshot = file.path; // 업로드된 파일 경로 설정
      console.log('Mugshot uploaded:', this.student.mugshot);
    },
  },
};
</script>

<style scoped>
/* 추가적인 스타일링 */
</style>
