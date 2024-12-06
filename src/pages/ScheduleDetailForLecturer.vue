<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">

      <q-input outlined v-model="localEventData.member_id" label="Student Name" readonly/>
      <q-input outlined v-model="localEventData.title" label="Class Title" />
      <div class="q-gutter-sm q-card">
        <div class="q-mb-sm">
          <label>Participation Record</label>
        </div>
        <q-checkbox
          v-model="computedAttend"
          label="attend"
          color="cyan"
        />
        <q-checkbox
          v-model="computedAbsent"
          label="absent"
          color="red"
        />
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

      <q-input
        v-model="localEventData.lecturer_evaluation"
        filled
        type="textarea"
      />

      <q-input
        v-model="localEventData.comments"
        filled
        type="textarea"
      />

      <!-- 오디오 파일 업로드 필드 -->
      <!-- 오디오 파일만 허용 -->
      <!-- 한 번에 한 파일만 업로드 -->
      <!-- 파일이 추가되었을 때 호출되는 메소드 -->
      <q-file
        v-model="localEventData.audioFile"
        filled
        label="Upload Audio File(Click here)"
        :accept="'audio/*'"
        :max-files="1"
        @added="uploadAudioFile"
      />

      <!-- 오디오 플레이어로 업로드된 파일 재생 -->
      <div v-if="localEventData.audioFile">
        <audio :src="localEventData.audioFileUrl" controls></audio>
      </div>

      schedule_id :{{localEventData.schedule_id}}
    <button @click="saveChanges">save changes</button>
    </div>

  </div>

</template>
<script>
import { QInput, QSlider } from 'quasar';
import axios from "axios";
export default {
  components:{QInput, QSlider},
  name:'ScheduleDetailForLecturer',
  props: {
    eventData: {
      type: Object,
      default: () => ({}) // 기본값을 빈 객체로 설정
    },
  },
  data(){
    return {
      //expansionLabel:'even detail!',
      localEventData: {
        ...this.eventData,
      audioFile: null,   // 업로드된 오디오 파일
      audioFileUrl: '',
      audioPlayUrl:''
      }  // 오디오 파일 URL

    }
  },
  methods:{
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
          this.$emit('update-event', this.localEventData); // 업데이트 후 데이터 emit
        });
    }
  },
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
  },
  computed: {
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
    }
  },
};
</script>
<style scoped>
.q-card {
  border: 1px solid #ccc; /* 슬라이더와 라벨을 감싸는 border */
  border-radius: 8px; /* 테두리의 둥근 모서리 */
}
</style>
