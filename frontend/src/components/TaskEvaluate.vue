<template>
  <v-form @submit.prevent="submitEvaluation">
    <v-text-field
      v-model="feedback"
      label="Feedback"
      required
      dense
    />
    <v-rating
      v-model="stars"
      length="5"
      color="amber"
      background-color="grey"
      dense
    />
    <v-btn :loading="loading" color="primary" type="submit" small>
      Submit Feedback
    </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  props: ['assignment'],
  data() {
    return {
      feedback: '',
      stars: 3,
      loading: false,
    };
  },
  methods: {
    async submitEvaluation() {
      this.loading = true;
      try {
        await axios.put(
          `http://localhost:5000/api/tasks/evaluate/${this.assignment._id}`,
          { feedback: this.feedback, stars: this.stars },
          { headers: { 'auth-token': localStorage.getItem('auth-token') } }
        );
        this.$emit('evaluated');
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  },
};
</script>