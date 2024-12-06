<template>
  <div>
    <p>{{ message }}</p>
    <q-btn label="Update Message" @click="updateMessage" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['message']),
  },

  methods: {
    ...mapActions(['updateMessage']),

    updateMessage() {
      // Vuex actions 호출 -> (mutations를 겆쳐) --> state 변경함.
      this.$store.dispatch('updateMessage', 'New message this...');
    },

  }, // method
};
</script>
