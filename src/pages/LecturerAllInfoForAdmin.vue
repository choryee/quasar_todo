<template>
  <div>

      <q-table
        :data="rows"
        :columns="columns"
        row-key="lecturer_id"
        title="Lecturers Information"
        flat
        bordered
        class="q-mb-md"
      >
      </q-table>

  </div>
</template>

<script>
import NumberFourDigitFormat from "src/services/NumberFourDigitFormat";

export default {
  name: "LecturerInfoForAdmin",
  data() {
    return {
      rows:[],
      columns: [
        { name: "lecturer_id", required: true, label: "ID", align: "left", field: "lecturer_id", sortable: true },
        { name: "name", required: true, label: "Name", align: "left", field: "name", sortable: true },
        { name: "age", label: "Age", align: "left", field: "age", sortable: true },
        { name: "gender", label: "Gender", align: "left", field: "gender", sortable: true },
        { name: "email", label: "Email", align: "left", field: "email", sortable: true },
        { name: "rate_level", label: "rate_level", align: "left", field: "rate_level", sortable: false },
        { name: "lesson_schedule_count", label: "이달 총수업수", align: "center", field: "lesson_schedule_count", sortable: false },
        { name: "total_lesson_duration", label: "이달 총시간(분)", align: "center", field: "total_lesson_duration", sortable: false },
        { name: "actions", label: "이달 지급액", align: "center", field: "actions", sortable: false },
        { name: "region", label: "Region", align: "left", field: "region", sortable: true },
        { name: "country", label: "Country", align: "left", field: "country", sortable: true },
        { name: "teachable_subjects", label: "Subjects", align: "left", field: "teachable_subjects", sortable: false },
      ]
    };
  },

   async created() {
    try {
      await this.$store.dispatch('getAllLecturers');
      this.rows = this.$store.state.getAllLecturers;
      await this.$store.dispatch('fetchFeeInfo');

      this.calculateLecturerFee();
    }catch (err){

    }
  },

  methods: {
    calculateLecturerFee(){
      const fees = this.$store.state.lecturerFeeInfo;
      const basicFee = fees.find(fee=> fee.rate_level === 'basic' ).lecturer_rate;
      const midFee = fees.find(fee=> fee.rate_level === 'mid').lecturer_rate;

      this.rows = this.rows.map(lecturer=>{
        let feeRate = basicFee;
        if(lecturer.rate_level === 'mid'){
          feeRate = midFee;
        }
        const payment =
        NumberFourDigitFormat.getNumberFourDigitFormatted(feeRate  * lecturer.total_lesson_duration);
        return {
          ...lecturer,
          actions:payment
        }
      })
    }
  },

};
</script>

<style scoped>
.q-table {
  margin-top: 20px;
}
.q-btn {
  margin: 5px;
}
</style>
