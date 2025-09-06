<template>
  <v-form @submit.prevent="submitEvaluation">
    <v-text-field v-model="feedback" label="Feedback" required dense color="primary" />
    <v-rating
      v-model="stars"
      length="5"
      color="amber"
      background-color="grey lighten-2"
      dense
    />
    <v-btn :loading="loading" color="primary" type="submit" small>
      Submit Feedback
    </v-btn>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  props: ["assignment"],
  data() {
    return {
      feedback: "",
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
          { headers: { "auth-token": localStorage.getItem("auth-token") } }
        );
        this.$emit("evaluated");
        this.$toast.success("Task Evaluated Successfully");
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  },
};
</script>
