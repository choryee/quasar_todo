<template>
  <q-page padding>
    <div class="q-mb-md">
      <div class="text-h5 text-center">Join this great journey!! </div>
    </div>
    <div>
      <q-card>
        <q-card-section>
          <div class="q-pa-md">
            <q-input
              v-model="formData.lecturer_user_id"
              label="Id"
              required
            />
            <q-input
              v-model="formData.password"
              label="password"
              required
            />
            <q-input
              v-model="formData.name"
              label="Lecturer Name"
              required
            />
            <!-- accept="image/*" 모든 이미지 파일을 허용하는 의미입니다 -->
            <!--              @added="uploadImageFile" 이거 때문에 2번 저장됨.-->
            <q-file
              v-model="formData.mugshot"
              label="Lecturer Mugshot"
              filled
              accept="image/*"
              :max-files="1"
            />
            <q-input
              v-model="formData.email"
              label="Email"
              type="email"
              required
            />
            <q-input
              v-model="formData.phone_number"
              label="Phone Number"
              type="tel"
            />
            <q-input
              v-model="formData.age"
              label="Age"
              type="number"
            />
            <q-select
              v-model="formData.gender"
              label="Gender"
              :options="genderOptions"
            />

            <q-input
              v-model="formData.skype_id"
              label="Skype ID"
            />
            <q-input
              v-model="formData.kakao_id"
              label="KakaoTalk ID"
            />

            <q-input
              v-model="formData.region"
              label="Region"
            />
            <q-input
              v-model="formData.country"
              label="Country"
            />
            <q-input
              v-model="formData.address"
              label="Address"
              type="textarea"
            />

            <q-input
              v-model="formData.teachable_subjects"
              label="Teachable Subjects"
              type="textarea"
            />
            <q-input
              v-model="formData.teachable_times"
              label="Teachable Times"
              type="textarea"
            />
            <q-select
              v-model="formData.teachable_days"
              label="Teachable Days"
              :options="dayOptions"
              multiple
              emit-value
            />
            <q-input
              v-model="formData.bank_name"
              label="Bank Name"
            />
            <q-input
              v-model="formData.account_number"
              label="Bank Account Number"
            />
            <!-- New Bank Name Select -->
            <q-select
              v-model="formData.level_test_yn"
              label="Level Test Available"
              :options="levelTestOptions"
              emit-value
            />
            <q-input
              v-model="formData.education"
              label="Highest Education"
            />
            <q-input
              v-model="formData.career_description"
              label="Career Description"
              type="textarea"
            />
<!--            <q-select-->
<!--              v-model="formData.status"-->
<!--              label="Status"-->
<!--              :options="statusOptions"-->
<!--            />-->


            <q-file
              v-model="formData.attachment"
              label="Attachment"
              filled
              accept=".pdf, .doc, .docx"
            />
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn label="Sign Up" color="primary"  @click="signUp" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        lecturer_user_id:'',
        password:'',
        name: '',
        email: '',
        age: null,
        gender: 'M',
        phone_number: '',
        skype_id: '',
        kakao_id: '',
        education: '',
        region: '',
        country: '',
        address: '',
        career_description: '',
        teachable_subjects: '',
        teachable_times: '',
        teachable_days: '',
        account_number: '',
        bank_name: '', // New field for bank name
        level_test_yn: 'N',
        mugshot: null, // 업로드된 이미지 파일
        mugshotUrl:'',
        attachment_path: null // Changed to match column name
      },
      isSubmitting: false,
      genderOptions: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ],
      dayOptions: [
        { label: 'Monday', value: 'Mon' },
        { label: 'Tuesday', value: 'Tue' },
        { label: 'Wednesday', value: 'Wed' },
        { label: 'Thursday', value: 'Thu' },
        { label: 'Friday', value: 'Fri' },
        { label: 'Saturday', value: 'Sat' },
        { label: 'Sunday', value: 'Sun' }
      ],
      levelTestOptions: [
        { label: 'Available', value: 'Y' },
        { label: 'Not Available', value: 'N' }
      ],
      statusOptions: [
        { label: 'Teaching', value: '수업' },
        { label: 'Waiting', value: '대기' },
        { label: 'Suspended', value: '휴강' },
        { label: 'Other', value: '기타' }
      ],

    };
  },
  methods: {
      // uploadImageFile()함수로, mugshotUrl먼저 받고, 그후 .then()에서 db에 회원가입하기.
    signUp() {
      if (this.isSubmitting) return; // 중복 호출 방지
      this.isSubmitting = true;

      const formDataWithoutMugshot = { ...this.formData };
      delete formDataWithoutMugshot.mugshot;

      this.uploadImageFile()
        .then(() => {
          // mugshotUrl이 설정된 후 요청 전송
          formDataWithoutMugshot.mugshotUrl = this.formData.mugshotUrl;

          axios.post('http://localhost:8080/lecturer/joinLecturer', formDataWithoutMugshot)
            .then(({ data }) => {
              console.log('lecturer/joinLecturer response >>>', data);
              this.isSubmitting = false;
            })
            .catch(err => {
              console.log('Error during lecturer registration >>>', err);
              this.isSubmitting = false;
            });

        }) //this.uploadImageFile()
    }, // signUp

    uploadImageFile() {
      const formData = new FormData();
      formData.append('file', this.formData.mugshot);
      formData.append('email', this.formData.email);

      return axios.post('http://localhost:8080/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(({ data }) => {
          console.log('Image upload response >>>', data.fileUrl);
          this.formData.mugshotUrl = data.fileUrl;
        })
        .catch(err => {
          console.error('Image file upload failed:', err);
          throw err; // 에러를 상위에서 처리
        });
    }
  }//method
};
</script>

<style scoped>
.q-page {
  max-width: 800px;
  margin: 0 auto;
}

.q-card {
  max-width: 600px;
  margin: 0 auto;
}

.q-select,
.q-input {
  margin-bottom: 10px;
}

.q-file {
  margin-bottom: 20px;
}
</style>
