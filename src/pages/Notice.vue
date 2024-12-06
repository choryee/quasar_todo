<template>
  <q-page padding class="custom-page">
    <div class="q-mb-md">
      <div class="text-h5 text-center">Notice</div>
    </div>

    <!-- 공지사항 리스트 -->
    <q-list bordered>
      <q-item v-for="(notice, index) in paginatedNotices" :key="notice.id" clickable @click="toggleDetails(index)">
        <q-item-section>
          <!-- 공지사항 제목과 내용 -->
          <div>
            <span class="text-weight-bold">Notice {{ index + 1 }}:</span>  <!-- 넘버링을 숫자만 표시 -->
            <div class="q-mt-sm">
              <div class="text-h6">{{ notice.title }}</div>
              <!-- 클릭 시 상세 내용 보이기 -->
              <div v-if="notice.showDetails">{{ notice.content }}</div>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 페이징 -->
    <q-pagination
      v-model="currentPage"
      :max="maxPage"
      class="q-mt-lg text-center"
      color="primary"
    />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      notices: [
        { id: 1, title: "공지사항 1", content: "첫 번째 공지사항 내용입니다.", showDetails: false },
        { id: 2, title: "공지사항 2", content: "두 번째 공지사항 내용입니다.", showDetails: false },
        { id: 3, title: "공지사항 3", content: "세 번째 공지사항 내용입니다.", showDetails: false },
        { id: 4, title: "공지사항 4", content: "네 번째 공지사항 내용입니다.", showDetails: false },
        { id: 5, title: "공지사항 5", content: "다섯 번째 공지사항 내용입니다.", showDetails: false },
        { id: 6, title: "공지사항 6", content: "여섯 번째 공지사항 내용입니다.", showDetails: false },
        { id: 7, title: "공지사항 7", content: "일곱 번째 공지사항 내용입니다.", showDetails: false },
        { id: 8, title: "공지사항 8", content: "여덟 번째 공지사항 내용입니다.", showDetails: false },
        { id: 9, title: "공지사항 9", content: "아홉 번째 공지사항 내용입니다.", showDetails: false },
        { id: 10, title: "공지사항 10", content: "열 번째 공지사항 내용입니다.", showDetails: false },
      ],
      currentPage: 1,  // 현재 페이지
      rowsPerPage: 2,  // 한 페이지에 보여줄 공지사항 수
    };
  },
  computed: {
    maxPage() {
      return Math.ceil(this.notices.length / this.rowsPerPage);  // 전체 공지사항을 페이지별로 분할
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.notices.slice(start, end);  // 현재 페이지에 맞는 공지사항 반환
    },
  },
  methods: {
    toggleDetails(index) {
      // 해당 공지사항의 showDetails 값을 토글하여 상세 내용을 표시/숨김
      this.notices[index].showDetails = !this.notices[index].showDetails;
    },
  },
};
</script>

<style scoped>
.q-list {
  max-width: 800px;
  margin: 0 auto;
}
.custom-page {
  min-height: 400px !important; /* 400px로 조정 */
}
</style>
