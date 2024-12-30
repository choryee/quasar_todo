<template>
  <div>
    <div class="lecturer-list">
      <q-card
        v-for="lecturer in paginatedLecturers"
        :key="lecturer.id"
        class="q-pa-sm lecturer-card">
        <q-card-section>
          <q-avatar size="100px" class="q-mb-sm">
            <img :src="lecturer.mugshot || 'https://via.placeholder.com/100'" alt="Lecturer Mugshot">
          </q-avatar>
          <div class="text-h6 q-mt-sm custom-background">
            {{ lecturer.name }}
          </div>
          <div class="text-subtitle2 custom-background">
            education: {{ lecturer.education }}
          </div>
          <div class="text-subtitle2 custom-background">
            region: {{ lecturer.region }}
          </div>
          <q-btn label="Details" color="primary" @click="showDetails(lecturer)" class="q-mt-md" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Pagination -->
    <q-pagination
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      class="q-mt-md"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      lecturers: [], // 전체 강사 리스트
      currentPage: 1, // 현재 페이지
      itemsPerPage: 12, // 한 페이지당 표시할 카드 개수
    };
  },
  computed: {
    // 총 페이지 수
    totalPages() {
      return Math.ceil(this.lecturers.length / this.itemsPerPage);
    },
    // 현재 페이지에 표시할 강사 목록
    paginatedLecturers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.lecturers.slice(startIndex, endIndex);
    },
  },
  methods: {
    // 강사 상세 정보 보기
    showDetails(lecturer) {
      this.$q.dialog({
        title: lecturer.name,
        message: `
          Education: ${lecturer.education} <br />
          Region: ${lecturer.region} <br />
          Career: ${lecturer.career_description || 'No data available'}
        `,
        html: true,
      });
    },
  },
  created() {
    // 샘플 데이터
    this.lecturers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Lecturer ${i + 1}`,
      education: `Education ${i + 1}`,
      region: `Region ${i + 1}`,
      mugshot: null, // Replace with actual image URL if available
      career_description: `Career Description for Lecturer ${i + 1}`,
    }));
  },
};
</script>
<style scoped>
.lecturer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.lecturer-card {
  background-color: #fef6e4; /* 옅은 주황색 */
  border: 1px solid #fdd8a5; /* 주황 테두리 */
}

.custom-background {
  background-color: #FFE6CC; /* 옅은 주황색 */
  padding: 8px;
  border-radius: 4px;
}

.q-pagination {
  display: flex;
  justify-content: center;
}
</style>
