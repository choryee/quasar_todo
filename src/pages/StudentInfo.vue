<template>
  <div>
    <!-- 학생 정보 카드를 보여주는 영역 -->
    <q-card bordered>
      <q-card-section>
        <!-- mugshot -->
        <q-avatar v-if="rows && rows.length > 0" size="100px">
          <img :src="rows[0].mugshotUrl || 'https://via.placeholder.com/80'" alt="Instructor Mugshot" />
        </q-avatar>
        <span v-if="rows && rows.length > 0 && rows[0] && rows[0].name" style="font-size: x-large">
              {{ rows[0].name }}
        </span>
        <span v-else class="text-muted">Name not available</span>
        <div class="text-h5 text-left"> </div>

        <br/>
        <q-table
          v-if="rows && rows.length > 0"
          :data="rows"
          :columns="columns"
          row-key="name"
          flat
          bordered
          :hide-bottom="rows.length > 0"
        >
        </q-table>
        <!-- 데이터가 없을 때 표시할 내용 -->
        <div v-else>
          <p>No data available</p>  <!-- 데이터를 불러오지 못한 경우 -->
        </div>
        <br/>
        <q-btn label="개인정보수정" color="primary" @click="" />

      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props:{
    studentData:{
      type:Object,
      default: () => null, // null을 기본값으로 설정
    }
  },
  data() {
    return {
      filter:'',
      rows:[],
      columns: [
        { name: 'user_id', align: 'left', label: 'User ID', field: 'user_id', width: '10px' },
        { name: 'name', align: 'left', label: 'Name', field: 'name', width: '10px' },
        { name: 'password', align: 'left', label: 'Password', field: 'password', format: () => '••••••••', width: '10px'  },
        { name: 'email', align: 'left', label: 'Email', field: 'email',  },
        { name: 'phone_number', align: 'left', label: 'Phone Number', field: 'phone_number' },
        { name: 'skype_id', align: 'left', label: 'Skype ID', field: 'skype_id' },
        { name: 'kakao_id', align: 'left', label: 'Kakao ID', field: 'kakao_id' },
        { name: 'mugshotUrl', align: 'center', label: 'mugshotUrl', field: 'mugshotUrl' },
      ],
      pagination: { page: 1, rowsPerPage: 0, rowsNumber: 0 },  // 페이지네이션을 비활성

    }
  },
  watch: {
    studentData(newData) {
      // studentData가 바뀔 때마다 rows를 업데이트
      if (newData) {
        this.rows = [newData];
        //this.pagination.rowsNumber = 0;
        console.log('Updated studentData >>>', this.rows);
      }
    },
  },

  mounted() {
    // if (this.studentData) {
    //   this.rows = [this.studentData]; // studentData가 있을 때만 rows에 데이터 할당
    // }
    // console.log('this.rows >>>', this.rows); // rows 데이터 확인
    // console.log(' this.rows >>>',  this.rows); // null
  },
  methods:{
    fetchStudentByID(){
      // TODO aaa 수정.
      //this.$store.dispatch('fetchStudentByID', aaa)
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: 20px auto;
}

.student-mugshot {
  height: 150px;
  width: 150px;
  margin: 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.q-table th, .q-table td{
  padding: 0 0 0 0;
}

</style>
