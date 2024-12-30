<template>
  <div v-if="eventData !== null" class="q-pa-md">
    <div class="row q-gutter-md">

      <!-- 첫 번째 카드 -->
      <div class="col-6">
        <q-card>
          <div class="q-gutter-sm q-card">
            <div class="q-mb-sm">
              <label>Postpone this class by lecturer({{lecturerName}})</label>
            </div>
            <q-checkbox v-model="computedDelay"  @input="onDelayChange" label="delay" color="cyan" />
            <q-checkbox v-model="computedGoOn" label="No, go on this class" color="red" />
          </div>
        </q-card>
      </div>
      <!-- 첫 번째 카드 end -->

      <!-- 두 번째 카드 -->
      <div class="col-6" v-if="showSecondCard">
        <q-card>
          <div class="q-gutter-sm q-card">
            <div v-if="localEventData.lecturer_cancel_status === '' ||
                 localEventData.lecturer_cancel_status === null"
                 class="q-mb-sm">
              <label>Request to cancel this class to Administrator.</label><br/>
              <label>This request DOES NOT complete the cancellation.</label>
              <q-btn color="secondary"  @click="applyRequestCancel">Request to Admin</q-btn>
            </div>

            <div v-if="localEventData.lecturer_cancel_status === 'permitted'" class="q-mb-sm">
              <template v-if="localEventData.lecturer_sub_name === null">
                <label>Cancel this class</label>
                <q-btn
                  v-if="! showCancelInputs && showApplyButton"
                  color="secondary"
                  style="margin-left: 20px;"
                  @click="applyCancelClass"
                >
                  Apply
                </q-btn>
              </template>
              <template v-else>
                <label>Already assigned to the replacement.</label>
              </template>
            </div>

            <!-- 조건부로 Request할때, q-input을 표시 -->
            <div v-if="showRequestCancelInputs">
              <q-input
                outlined
                v-model="cancelReason"
                label="Cancel Reason"
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="subLecturerName"
                label="Sub Lecturer Name"
                class="q-mb-md"
              />
              <q-btn color="primary" @click="submitCancelRequest">Submit</q-btn>
              <q-btn color="accent" @click="submitCancelRequestCancel" style="margin-left: 3px;">Cancel</q-btn>
            </div>

        <!-- 조건부로, 실제 cancel q-input을 표시 -->
            <div v-if="showCancelInputs" class="q-pa-md">
              <div class="row items-center q-gutter-md">
                <label class="text-h6">Select sub lecturer agreeing with you to replace.</label>
                <q-separator inset />
              </div>

              <div class="row q-gutter-md">
                <!-- Sub Lecturer Details -->
                <div class="col-6">
                  <div class="text-subtitle1">
                    <strong>User ID:</strong> {{ subLecturerNameArray.user_id }}
                  </div>
                  <div class="text-subtitle1">
                    <strong>Name:</strong> {{ subLecturerNameArray.name }}
                  </div>
                </div>

                <!-- Select Box -->
                <div class="col-6">
                  <q-select
                    outlined
                    v-model="subLecturerNameArray"
                    label="Select Sub Lecturer"
                    :options="subLecturerOptions"
                    option-label="name"
                    option-value="lecturer_id"
                    class="q-mb-md"
                  />
                </div>
              </div>

              <div class="row justify-end q-gutter-sm">
                <!-- Buttons -->
                <q-btn color="primary" @click="submitCancel" label="Submit" />
                <q-btn color="negative" @click="submitCancelCancel" label="Cancel" />
              </div>
            </div>

            <!-- 구분선 추가 -->
            <q-separator inset />

            <div>
              <div class="q-mb-sm">
                <label>Request cancel status</label>
              </div>
              <div >
                <q-checkbox
                  v-model="computedStatusPermitted"
                  label="permitted to apply"
                  color="cyan"
                  disable
                />
                <q-checkbox
                  v-model="computedStatusPending"
                  label="pending"
                  color="red"
                  disable
                />
              </div>
            </div>

          </div>
        </q-card>
      </div>
      <!-- 두 번째 카드 end -->



      <!-- 세 번째 카드 -->
      <div v-if="showThirdCard" class="col-6">
        <q-card>
          <div class="q-gutter-sm q-card">
            <div class="q-mb-sm">
              <label>Class Hour Info</label>
            </div>
<!--            <q-input outlined v-model="localEventData.start_date" label="Class Date" readonly/>-->
           Class Date : {{localEventData.start_date}}, Class Time : {{localEventData.start_time}}
          </div>
          <div class="q-gutter-sm q-card">
            <q-input outlined v-model="localEventData.name" label="Student Name" readonly />
          </div>
          <div class="q-gutter-sm q-card">
            <q-input outlined v-model="localEventData.subject_name" label="Class Title" readonly/>
          </div>

          <div class="q-gutter-sm q-card">
            <div class="q-mb-sm">
              <label>Participation Record</label>
            </div>
            <q-checkbox v-model="computedAttend" label="attend" color="cyan" />
            <q-checkbox v-model="computedAbsent" label="absent" color="red" />
          </div>
          <div class="q-card q-pa-md">
            <div class="q-mb-sm">
              <label for="pronunciation-slider">Pronunciation</label>
            </div>
            <q-slider
              id="pronunciation-slider"
              v-model="localEventData.pronunciation"
              :min="0"
              :max="10"
              marker-labels
            />
          </div>
          <div class="q-card q-pa-md">
            <div class="q-mb-sm">
              <label for="pronunciation-slider">Grammar</label>
            </div>
            <q-slider
              id="pronunciation-slider"
              v-model="localEventData.grammar"
              :min="0"
              :max="10"
              marker-labels
            />
          </div>
          <div class="q-card q-pa-md">
            <div class="q-mb-sm">
              <label for="pronunciation-slider">Expression</label>
            </div>
            <q-slider
              id="pronunciation-slider"
              v-model="localEventData.expression"
              :min="0"
              :max="10"
              marker-labels
            />
          </div>
          <q-input v-model="localEventData.lecturer_evaluation" filled type="textarea" />
          <q-input v-model="localEventData.comments" filled type="textarea" />
          <q-file
            v-model="localEventData.audioFile"
            filled
            label="Upload Audio File(Click here)"
            :accept="'audio/*'"
            :max-files="1"
            @added="uploadAudioFile"
          />
          <div v-if="localEventData.audioFile">
            <audio :src="localEventData.audioFileUrl" controls></audio>
          </div>
          schedule_id: {{ localEventData.schedule_id }}
          <q-btn @click="saveChanges" color="primary">save changes</q-btn>
        </q-card>
      </div>
      <!-- Confirmation Dialog -->
      <q-dialog v-model="dialogVisible">
        <q-card>
          <q-card-section>
            Are you sure you want to cancel this class?. This request should be permitted by
            the administratio first.
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Cancel" @click="" />
            <q-btn flat label="Confirm" @click="" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>

<script>
import { QInput, QSlider } from 'quasar';
import axios from "axios";
export default {
  components:{QInput, QSlider},
  name:'LecturerScheduleDetail',
  props: {
    eventData: {
      type: Object,
      default: () => ({}) // 기본값을 빈 객체로 설정
    },
  },
  data(){
    return {
      dialogVisible:false,
      showRequestCancelInputs:false,
      showCancelInputs:false,
      showApplyButton:true,
      showSecondCard:true,
      showThirdCard:true,
      cancelReason:'',
      lecturerName: this.getLecturerName() ? this.getLecturerName() : 'me',
      subLecturerName:'',
      subLecturerNameArray:'',
      subLecturerOptions: [],
      localEventData: {
          ...this.eventData,
        audioFile: null,   // 업로드된 오디오 파일 자체
        audioFileUrl: '',
        audioPlayUrl:''
      }  // 오디오 파일 URL

    }
  },

  async created() {
    try {
      await this.$store.dispatch('getAllLecturers');
      const response = this.$store.state.getAllLecturers;
      console.log('created() getAllLecturers >>>', response);
      const currentUserName = this.getLecturerName();
      this.subLecturerOptions = response.map(item=>({
        lecturer_id : item.lecturer_id,
        name : item.name,
        user_id: item.user_id
      })).filter(lecturer=> lecturer.name !== currentUserName)

    }catch (err){

    }
  },
  mounted() {

  },

  methods:{
    // permitted일때, Apply버튼누름. 시작 -->
    applyCancelClass(){
     this.showCancelInputs = true;
    },

    getLecturerName(){
      this.lecturerName =
        JSON.parse(localStorage.getItem('loginLecturerInfo')).name;
      return this.lecturerName;
    },

    async submitCancel(){
      // 강사가 취소/대체시
      const selectedData ={
        schedule_id : this.localEventData.schedule_id,
        lecturer_sub_lecturer_id : this.subLecturerNameArray.lecturer_id,
        lecturer_sub_user_id : this.subLecturerNameArray.user_id ,
        lecturer_sub_name : this.subLecturerNameArray.name,
        lecturer_cancel_yn : 'Y'
      }
      // const sendData = JSON.stringify(this.selected[0]);
      return await axios.post('http://localhost:8080/submitCancelClass', selectedData)
        .then(({data})=>{
          if(data === 1){
            alert('cancel success.')
            this.$emit('update-event', this.localEventData); // 업데이트 후, 데이터 emit
            this.showCancelInputs = false;
            this.showApplyButton = false;
          }
          // return data;
        })
    },

    submitCancelCancel(){
      this.subLecturerNameArray='';
      this.showCancelInputs = false;
    },
    //  permitted일때 끝-->

    applyRequestCancel(){ // Apply버튼 누를 시, input창만 열기.
      if(this.eventData){
        this.checkBeforeStartTime(2)
          .then((data)=>{
            console.log('checkBeforeStartTime >>>', data);
            if(data === 'NotBefore2StartTime'){
              alert('2시간 전 변경 불가..');
              this.showRequestCancelInputs = false;
              return;
            }else if(data === 'Before2StartTime'){
              alert('변경 가능.')

              this.showRequestCancelInputs = true;
            }else {
              alert('select your class by clicking students name22')
            }

          })
      }else{
        alert('select your class by clicking students name11')
      }

    },

    async submitCancelRequest(){
      const selectedData ={
        schedule_id : this.localEventData.schedule_id,
        lecturer_cancel_reason : this.cancelReason,
        // 여기서 입력이름컬럼과 나중에 q-select으로 강사 고를때, 그 이름컬럼 2개가 있음.
        lecturer_sub_name_requested : this.subLecturerName,
        lecturer_cancel_status : 'pending'
      }
      // const sendData = JSON.stringify(this.selected[0]);
      return await axios.post('http://localhost:8080/submitCancelClassRequest', selectedData)
        .then(({data})=>{
          if(data === 1){
            // TODO  카톡으로 관리자에게 강사 변경 알림 보내기
            alert('cancel request success. wait from Admin.')
            this.localEventData.lecturer_cancel_status = 'pending';
            this.cancelReason = '';
            this.subLecturerName = '';
            this.showRequestCancelInputs = false;
          }
          // return data;
        })
    },

    submitCancelRequestCancel(){
      this.cancelReason = '';
      this.subLecturerName = '';
      this.showRequestCancelInputs = false;
    },

    uploadAudioFile(file, instructor_id) {
      console.log('file >>>', file);
      console.log('audioFile >>>', this.localEventData.audioFile);

      // FormData 객체는 multipart/form-data 형식으로 데이터를 전송하는 데 사용됩니다.
      const formData = new FormData();
      formData.append('file', this.localEventData.audioFile);
      formData.append('instructor_id', 333);

      return axios.post('http://localhost:8080/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(response => {
          this.localEventData.audioFileUrl = response.data.fileUrl; // 서버에서 반환된 오디오 파일 URL
          console.log('audio/upload response >>>', response.data.fileUrl);
        })
        .catch(error => {
          console.error('오디오 파일 업로드 실패:', error);
        });
    },

    playAudioFile() {
      // 파일이 추가되면 URL을 생성하여 재생할 수 있도록 설정
      const audioUrl = URL.createObjectURL(this.localEventData.audioFile);
      // http://localhost:8083/48d624e3-7050-46ae-af1a-c986b9f4a030 <--**UUID**(Universally Unique Identifier)입니다.
      this.localEventData.audioPlayUrl = audioUrl;

    },

    saveChanges() {
      this.uploadAudioFile(this.localEventData.audioFile)
        .then(() => {
          this.playAudioFile(); // 업로드가 완료된 후에 실행
          this.$emit('update-event', this.localEventData); // 업데이트 후, 데이터 emit
        });
    },

    async checkBeforeStartTime(checkHour){
      const selectedData ={
        ...this.localEventData,
        amountHour : checkHour
      }
      // const sendData = JSON.stringify(this.selected[0]);
      return await axios.post('http://localhost:8080/checkBeforeStartTime', selectedData)
        .then((res)=>{
          console.log('res >>>', res);
          return res.data;
        })
    },

    async updateLecturerCancelStatus(){
      const selectedData ={
        ...this.localEventData,
        amountHour : checkHour
      }
      // const sendData = JSON.stringify(this.selected[0]);
      return await axios.post('http://localhost:8080/updateLecturerCancelStatus', selectedData)
        .then(({data})=>{
          return data;
        })
    },

    // Postpone this class by lecturer. 두개의 checkbox.
    onDelayChange(isChecked) {
      if (isChecked) {
        this.$q.dialog({
          title: 'NOTICE',
          message: 'Do you want to postpone this class?',
          cancel: true,
          persistent: true})
          .onOk(()=>{
            axios.post('http://localhost:8080/postponeLesson', {
              // 강사가 수강 연기(학생대신등 사유로)
              schedule_id: this.localEventData.schedule_id,
              member_id: this.localEventData.member_id,
              enroll_id: this.localEventData.enroll_id,
              lecturer_id: this.localEventData.lecturer_id,
              subject_name: this.localEventData.subject_name,
              lesson_fee: this.localEventData.lesson_fee,
              lesson_end_time: this.localEventData.lesson_end_time,
              class_delay_lecturer_yn: 'Y',
              // 아래, 상위 강사 캘린더에서 넘겨줌. 아래는, 대체수업을 다시 수업연기시, 새로운 행에 그냥 표시위해.
              lecturer_sub_name : this.localEventData.lecturer_sub_name,
              lecturer_sub_lecturer_id  : this.localEventData.lecturer_sub_lecturer_id ,
              lecturer_sub_user_id : this.localEventData.lecturer_sub_user_id,
              lecturer_cancel_reason : this.localEventData.lecturer_cancel_reason,
              lecturer_cancel_yn : this.localEventData.lecturer_cancel_yn
            })
              .then(() => {
                  this.$q.dialog({
                    title: 'Confirm',
                    message: 'Postponing this class is completed.',
                    cancel: true,
                    persistent: true
                  }).onOk(() => {
                    this.showSecondCard = false;
                    this.showThirdCard = false;
                })

              })
              .catch(err => {
                console.log('Error >>>', err);
              }); //axios
          })
          .onCancel(()=>{
            console.log('Cancelled!........');
            if (this.localEventData) {
              this.$set(this.localEventData, 'class_delay_lecturer_yn', 'N'); // Vue의 $set 사용
            }
          })
      }
    },
  },// method
  watch: {
    // eventData가 변경될 때마다 expansionLabel을 갱신
    // eventData: {
    //   handler(newData) {
    //     if (newData && newData.studentName) {
    //       this.expansionLabel = `${newData.studentName}'s details. `; // studentName이 있으면 라벨을 갱신
    //     }
    //   },
    //   immediate: true // 컴포넌트가 처음 마운트될 때에도 라벨을 갱신하도록 설정
    // }

    //eventData 변경 시 localEventData 동기화
    // 부모에서 eventData가 변경되면 자식의 localEventData도 업데이트되어야 합니다. 이를 위해 watch 속성을 사용하면 좋습니다.
    eventData: {
      handler(newValue) {
        this.localEventData = { ...newValue };
      },
      immediate: true, // 컴포넌트가 마운트될 때 초기 동기화
      deep: true, // 객체 내부까지 감지
    },

  },// watch:

  computed: {
    // `attend`와 `absent` 값을 계산하여 v-model에 사용
    computedDelay: {
      get() {
        return this.localEventData.class_delay_lecturer_yn === 'Y';
      },
      set(value) {
        this.localEventData.class_delay_lecturer_yn = value ? 'Y' : 'N';
      }
    },

    computedGoOn: {
      get() {
        return this.localEventData.class_delay_lecturer_yn === 'N';
      },
      set(value) {
        this.localEventData.class_delay_lecturer_yn = value ? 'N' : 'Y';
      }
    },

    // `attend`와 `absent` 값을 계산하여 v-model에 사용
    computedAttend: {
      get() {
        return this.localEventData.attend_yn === 'Y';
      },
      set(value) {
        this.localEventData.attend_yn = value ? 'Y' : 'N';
      }
    },

    computedAbsent: {
      get() {
        return this.localEventData.attend_yn === 'N';
      },
      set(value) {
        this.localEventData.attend_yn = value ? 'N' : 'Y';
      }
    },

    computedStatusPermitted: {
      get() {
        return this.localEventData.lecturer_cancel_status === 'permitted';
      },
      set(value) {
        this.localEventData.lecturer_cancel_status = value ? 'Y' : 'N';
      }
    },

    computedStatusPending: {
      get() {
        return this.localEventData.lecturer_cancel_status === 'pending';
      },
      set(value) {
        this.localEventData.lecturer_cancel_status = value ? 'N' : 'Y';
      }
    },

  },
};
</script>
<style scoped>
.q-card {
  border: 1px solid #ccc; /* 슬라이더와 라벨을 감싸는 border */
  border-radius: 8px; /* 테두리의 둥근 모서리 */
}
</style>
