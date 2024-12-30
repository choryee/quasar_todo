<template>
  <div class="payment-page">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">결제하기</div>
        <div class="q-mt-md originalPrice text-muted" v-if="formData.lesson_discount_rate !== 0">
          금액: <b>{{formatNumber(formData.lesson_amount)  }}원</b>
        </div>
        <div class="q-mt-md" v-if="formData.lesson_discount_rate !== 0">
          할인 금액: <b>{{`${formatNumber( formData.lesson_amount - formData.lesson_amount_discount)}원(${formData.lesson_discount_rate}%)`}}</b>
        </div>
        <div class="q-mt-md" v-if="formData.lesson_discount_rate !== 0">
          결제 금액: <b>{{formatNumber( formData.lesson_amount_discount) }}원</b>
        </div>
        <div v-else>
          결제 금액: <b>{{formatNumber( formData.lesson_amount) }}원</b>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="결제하기" @click="requestPayment" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import NumberFormat from "src/services/NumberFourDigitFormat";
export default {
  props: {
    formData: {
      type: Object,
    }
  },
  data() {
    return {
      paymentAmount: 120, // 결제 금액 (예: 50,000원)
      userInfo: {
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1234-5678",
      },
    };
  },
  mounted() {
    if (!window.jQuery) {
      const script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.6.4.min.js';
      script.onload = this.loadIamport;
      document.head.appendChild(script);
    } else {
      this.loadIamport();
    }
  },
  methods: {
    formatNumber(val) {
      return NumberFormat.getNumberFourDigitFormatted(val);
    },
    loadIamport() {
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';
      script.onload = () => {
        console.log('Iamport script loaded');
      };
      document.head.appendChild(script);
    },

    requestPayment() {
      const IMP = window.IMP; // PortOne(아임포트) 객체 초기화
      console.log('IMP>>>', IMP);
      IMP.init("imp23576402"); // PortOne에서 발급받은 가맹점 고유코드 입력

      const paymentData = {
        pg: "kakaopay", // 결제 서비스 제공자 (PG사)
        pay_method: "card", // 결제 수단 (카드 결제)
        merchant_uid: `order_${new Date().getTime()}`, // 주문 번호 (고유해야 함)
        name: "테스트 결제", // 상품명
        amount: this.formData.pay_amount, // 결제 금액
        buyer_name: this.userInfo.name, // 구매자 이름
        buyer_email: this.userInfo.email, // 구매자 이메일
        buyer_tel: this.userInfo.phone, // 구매자 전화번호
      };

      // 결제 요청
      IMP.request_pay(paymentData, (rsp) => {
        if (rsp.success) {
          // 결제 성공 시 처리
          console.log("결제 성공:", rsp);
          // 추가 로직 (예: 서버로 결제 정보 전송)


        } else {
          // 결제 실패 시 처리
          console.error("결제 실패 >> ", rsp);

        }
      });

    },
  },
}

</script>

<style scoped>
.payment-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.originalPrice {
  text-decoration: line-through;
}
</style>
