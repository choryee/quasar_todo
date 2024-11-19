<!--<template>-->
<!--  <div>-->
<!--    <h5>{{ expansionLabel }}</h5>-->
<!--    <div style="border: 1px solid blue; background-color: #ffcc80;">-->
<!--      <q-card-->
<!--        icon="event"-->

<!--        expand-separator-->
<!--        :expanded="eventData !== null"-->
<!--      >-->
<!--        <div>-->
<!--          <p><strong>Title:</strong> {{ eventData.title }}</p>-->
<!--          <p><strong>Start:</strong> {{ eventData.start }}</p>-->
<!--          <p><strong>Student:</strong> {{ eventData.studentName}}</p>-->
<!--          <p><strong>Class:</strong> {{ eventData.classTitle}}</p>-->
<!--          <p><strong>Description:</strong> {{ eventData.description}}</p>-->
<!--        </div>-->
<!--      </q-card>-->

<!--    </div>-->


<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name:'EnrolledStudentForLecturer',-->
<!--  props: {-->
<!--    eventData: {-->
<!--      type: Object,-->
<!--      default: () => ({}) // 기본값을 빈 객체로 설정-->
<!--    },-->
<!--  },-->
<!--  data(){-->
<!--    return {-->
<!--      expansionLabel:'even detail!'-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    // eventData가 변경될 때마다 expansionLabel을 갱신-->
<!--    eventData: {-->
<!--      handler(newData) {-->
<!--        if (newData && newData.studentName) {-->
<!--          this.expansionLabel = `${newData.studentName}'s details. `; // studentName이 있으면 라벨을 갱신-->
<!--        }-->
<!--      },-->
<!--      immediate: true // 컴포넌트가 처음 마운트될 때에도 라벨을 갱신하도록 설정-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
