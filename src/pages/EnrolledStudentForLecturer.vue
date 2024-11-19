<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">

      <q-input outlined v-model="localEventData.studentName" label="Student Name" readonly/>
      <q-input outlined v-model="localEventData.classTitle" label="Class Title" />
      <q-input outlined v-model="localEventData.description" label="Description" />
      <q-input outlined v-model="localEventData.start" label="Start Date" />
      <q-slider
        v-model="localEventData.pronunciationRating"
        marker-labels
        :min="0"
        :max="10"
      />
      <q-input
        v-model="localEventData.comment"
        filled
        type="textarea"
      />
    <button @click="saveChanges">save changes</button>
    </div>

  </div>

</template>
<script>
import { QInput, QSlider } from 'quasar';
export default {
  components:{QInput, QSlider},
  name:'EnrolledStudentForLecturer',
  props: {
    eventData: {
      type: Object,
      default: () => ({}) // 기본값을 빈 객체로 설정
    },
  },
  data(){
    return {
      //expansionLabel:'even detail!',
      localEventData: {...this.eventData}
    }
  },
  methods:{
    saveChanges(){
      this.$emit('update-event', this.localEventData)
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
  }
};
</script>
