<template>

  <q-page padding>
    <div class="q-mb-md">
      <div class="text-h5 text-center">Update My Info</div>
    </div>

    <div>
      <q-card>
        <q-card-section>
          <!-- mugshot -->
          <q-avatar >
            <img :src="formData.mugshotUrl || 'https://via.placeholder.com/80'" alt="Instructor Mugshot" />
          </q-avatar>

          <!-- accept="image/*" 모든 이미지 파일을 허용하는 의미입니다 -->
          <!--              @added="uploadImageFile" 이거 때문에 2번 저장됨.-->
          <q-file
            v-model="formData.mugshot"
            label="Change Mugshot (click here)"
            filled
            accept="image/*"
            :max-files="1"
          />

          <div class="q-pa-md">
            <q-input
              v-model="formData.lecturer_user_id"
              label="Id (not changable)"
              required
              readonly
            />
            <q-input
              v-model="formData.password"
              label="password"
              required
            />
            <q-input
              v-model="formData.name"
              label="Lecturer Name (not changable)"
              required
              readonly
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
              label="Gender (not changable)"
              readonly
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
              v-model="formData.education"
              label="Highest Education"
            />
            <q-input
              v-model="formData.career_description"
              label="Career Description"
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
          <q-btn label="Update" color="primary" @click="showDialog = true" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Q-Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Update</div>
        </q-card-section>
        <q-card-section>
          <p>Are you want to update?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="showDialog = false" />
          <q-btn flat label="Confirm" color="primary" @click="confirmUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        lecturer_id:'',
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
      showDialog: false, // 다이얼로그 상태
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

  mounted() {
    this.getInfoLecturer(36);
  },
  methods: {
    confirmUpdate() {
      this.showDialog = false; // 다이얼로그 닫기
      // this.updateBtn().thne()사용하기 위해, updateBtn()함수 처음 정의된 곳에서 return에 promise형태로 함.241205
      this.updateBtn()
        .then(()=>{
          this.$router.push('/lecturerMain');
        })
    },

    getInfoLecturer(lecturer_id){
      // TODO 위 36 하드 코딩 바꾸어야.
      // const lecturer_id = 36; 이렇게 하면, 중복 변수 선언이라 에러남.

      // 아래 axios호출을 바로 밑처럼 store의 actions에서 처리하게 하는 게 좋다고 함.
      this.$store.dispatch("fetchLecturerInfo", lecturer_id)
        .then(()=>{
        this.formData = this.$store.state.lecturerInfo;
        })

      // axios.get('http://localhost:8080/lecturer/getLecturerInfo/'+ lecturer_id)
      //   .then(({data})=>{
      //     console.log('getLecturerInfo >>>', data);
      //     if (data) {
      //       this.formData = data;
      //     } else {
      //
      //     }
      //   })
    },

    updateBtn() {
      // uploadImageFile()함수로, mugshotUrl먼저 받고, 그후 .then()에서 db에 회원가입하기.

      const formDataWithoutMugshot = { ...this.formData };
      delete formDataWithoutMugshot.mugshot;

      if(this.formData.mugshot == null){ // update시 mugshot를 변경안해서, null인 경우.
        formDataWithoutMugshot.mugshotUrl = this.formData.mugshotUrl;

        // 아래 axios호출을 바로 밑처럼 store의 actions에서 처리하게 하는 게 좋다고 함.
        return this.$store.dispatch('updateLecturerInfo', formDataWithoutMugshot) // UPDATED: 반환 추가
          .then(() => {
            console.log("Lecturer info updated successfully.");
          })
          .catch(err => {
            console.error("Error updating lecturer info:", err);
            throw err; // 상위에서 처리
          });

        // axios.post('http://localhost:8080/lecturer/updateLecturer', formDataWithoutMugshot)
        //   .then(({ data }) => {
        //     console.log('lecturer/updateLecturer response >>>', data);
        //   })
        //   .catch(err => {
        //     console.log('Error during lecturer registration >>>', err);
        //   }); // updateLecturer
      }else {
        this.uploadImageFile()
          .then(() => {
            // mugshotUrl이 설정된 후 요청 전송
            formDataWithoutMugshot.mugshotUrl = this.formData.mugshotUrl;
            // 아래 axios호출을 바로 밑처럼 store의 actions에서 처리하게 하는 게 좋다고 함.
            return this.$store.dispatch('updateLecturerInfo', formDataWithoutMugshot) // UPDATED: 반환 추가
              .then(() => {
                console.log("Lecturer info updated successfully.");
              })
              .catch(err => {
                console.error("Error updating lecturer info:", err);
                throw err; // 상위에서 처리
              });

            // axios.post('http://localhost:8080/lecturer/updateLecturer', formDataWithoutMugshot)
            //   .then(({ data }) => {
            //     console.log('lecturer/updateLecturer response >>>', data);
            //   })
            //   .catch(err => {
            //     console.log('Error during lecturer registration >>>', err);
            //   }); // updateLecturer

          }) //this.uploadImageFile()
      }
    }, // updatetBtn()

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
