<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="submissionLink"
      label="GitHub Link"
      :disabled="loading"
      required
      color="primary"
    />
    <v-btn :loading="loading" type="submit" color="primary" small> Submit </v-btn>
  </v-form>
</template>

<script>
import ApiService from "@/services/api";
import axios from "axios";

export default {
  props: ["assignment"],
  data() {
    return {
      submissionLink: "",
      loading: false,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        await axios.put(
          ApiService.getApiUrl(`/tasks/submit/${this.assignment.task._id}`),
          {
            submissionLink: this.submissionLink,
          },
          {
            headers: { "auth-token": localStorage.getItem("auth-token") },
          }
        );
        this.$emit("submitted");
        this.$toast.success("Task submitted Successfully");
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>
