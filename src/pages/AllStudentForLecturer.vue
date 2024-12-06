<template>
  <div className="q-pa-md">
    <q-table
      style="height: 300px"
      flat
      bordered
      title="All my students"
      :data="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  props:{
    lessons: {
      type: Array,
      required: true
    }
  },
  data() {
    // Data and variables

    return { // name,label,field순으로
      columns: [
        { name: 'member_id', label: 'Member ID', field: 'member_id', sortable: true },
        { name: 'subject_name', label: 'Subject Name', field: 'subject_name', sortable: true },
        { name: 'lesson_method', label: 'Lesson Method', field: 'lesson_method', sortable: true },
        { name: 'lesson_period', label: 'Lesson Period', field: 'lesson_period', sortable: true },
        { name: 'lesson_frequency', label: 'Lesson Frequency', field: 'lesson_frequency', sortable: true },
        { name: 'lesson_duration', label: 'Lesson Duration', field: 'lesson_duration', sortable: true },
        { name: 'lesson_days', label: 'Lesson Days', field: 'lesson_days' },
        { name: 'start_date', label: 'Start Date', field: 'start_date', sortable: true },
        { name: 'start_time', label: 'Start Time', field: 'start_time', sortable: true },
        { name: 'skype_id', label: 'Skype ID', field: 'skype_id' }
      ],
      rows: [],
      pagination: {
        rowsPerPage: 0
      }
    };
  },
  // watch
  watch: {
    lessons: {
      immediate: true,
      handler(newLessons) {
        // this.rows = newLessons.map(item => ({
        //   member_id: item.member_id,
        //   subject_name: item.subject_name,
        //   lesson_method: item.lesson_method,
        //   lesson_period: item.lesson_period,
        //   lesson_frequency: item.lesson_frequency,
        //   lesson_duration: item.lesson_duration,
        //   lesson_days: item.lesson_days,
        //   start_date: item.start_date,
        //   start_time: item.start_time,
        //   skype_id: item.skype_id
        // }));

      }
    }
  },
  mounted() {
    this.getInfoByLecturerId();
  },
  methods:{
    getInfoByLecturerId(){
      const lecturer_id = 36; // TODO
      axios.get('http://localhost:8080/getInfoByLecturerId', {
        params :{
          lecturer_id : lecturer_id
        }
      })
        .then(({data})=>{
          console.log('getInfoByLecturerId >>>', data);
            this.rows = data;
        })

    }
  }
};
</script>

<style scoped>
.q-pa-md {
  padding: 1px;
}
.q-table {
  border-spacing: 0 !important; /* 테이블 간격을 없앱니다 */
}
</style>
