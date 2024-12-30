<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">할인 정보 입력</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="submitDiscount">
        <q-input v-model="discountForm.discount_name" label="할인이름" :rules="[val => !!val || '시작일을 선택하세요']" dense />
        <q-input v-model="discountForm.start_date" label="시작일" type="date" :rules="[val => !!val || '시작일을 선택하세요']" dense />
        <q-input v-model="discountForm.end_date" label="종료일" type="date" :rules="[val => !!val || '종료일을 선택하세요']" dense />
        <q-input v-model="discountForm.discount_value" label="할인율 (%)" type="number" :rules="[val => val >= 0 && val <= 100 || '할인율은 0% 이상 100% 이하로 입력하세요']" dense />

        <q-btn label="저장" color="primary" type="submit" class="full-width" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      discountForm: {
        discount_name:'',
        start_date: "",
        end_date: "",
        discount_value: 0,
      },
    };
  },
  methods: {
    async submitDiscount() {
      try {
        const response = await axios.post("http://localhost:8080/insertDiscount", {
          discount_name : this.discountForm.discount_name,
          start_date: this.discountForm.start_date,
          end_date: this.discountForm.end_date,
          discount_value: this.discountForm.discount_value,
        });
        console.log('response >>>', response);
        this.$emit("discountSaved", response.data); // 할인 저장 후 부모 컴포넌트에 알림
        this.$q.notify({
          color: "positive",
          message: "할인 정보가 성공적으로 저장되었습니다.",
        });
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: "할인 정보 저장에 실패했습니다.",
        });
        console.error("Error saving discount info:", error);
      }
    },
  },
};
</script>

<style scoped>
.q-form {
  max-width: 400px;
  margin: 0 auto;
}

.full-width {
  width: 100%;
}
</style>
