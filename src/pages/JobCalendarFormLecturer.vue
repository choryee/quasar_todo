<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <span>
        <q-input outlined v-model="localEventData.start_time" label="interview time" />
        <q-input outlined v-model="localEventData.lecturer_user_id" label="lecturer user id" />
        <q-input outlined v-model="localEventData.lecturer_name" label="lecturer user name" />
      </span>

<!--      job_interview_id: {{localEventData.job_interview_id}}-->
<!--      storedInfo : {{storedInfo}}-->
    <button @click="saveInterviewTime">set interview time with administrator</button>
    <button @click="cancelInterviewTime">cancel interview time</button>
    </div>

  </div>

</template>
<script>
import { QInput, QSlider } from 'quasar';
import axios from "axios";
export default {
  components:{QInput, QSlider},
  props: {
    eventData: {
      type: Object,
      default: () => ({}) // 기본값을 빈 객체로 설정
    },
  },
  data(){
    return {
      localEventData: {...this.eventData },  //
      storedInfo: this.$store.state.lecturerInfo
    }
  },

  methods:{
    saveInterviewTime(){
      this.$emit('save-event', this.localEventData);
    },

    cancelInterviewTime(){
      this.$emit('cancel-event', this.localEventData);
    },
  },
  watch: {
    //eventData 변경 시 localEventData 동기화
    // 부모에서 eventData가 변경되면 자식의 localEventData도 업데이트되어야 합니다. 이를 위해 watch 속성을 사용하면 좋습니다.
    eventData: {
      handler(newValue) {
        this.localEventData = { ...newValue };

        if (newValue && (newValue.isCanceled || newValue.isSaved)) {
          this.localEventData.start_time = '';
          this.localEventData.lecturer_name = '';
          this.localEventData.lecturer_user_id = '';
        }
      },
      immediate: true, // 컴포넌트가 마운트될 때 초기 동기화
      deep: true, // 객체 내부까지 감지
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
