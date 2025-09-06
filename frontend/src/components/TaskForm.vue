<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card color="white" class="rounded-xl elevation-4">
      <!-- Header -->
      <v-card-title class="d-flex align-center">
        <v-icon left color="primary">mdi-clipboard-plus</v-icon>
        <span
          class="font-weight-bold"
          style="font-size: 1.3rem; letter-spacing: 0.5px; color: #1e88e5"
        >
          Create New Task
        </span>
      </v-card-title>
      <v-divider class="mx-4 mb-2" color="primary"></v-divider>

      <!-- Form -->
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="title"
            label="Task Title"
            outlined
            rounded
            dense
            color="primary"
            :rules="[(v) => !!v || 'Title is required']"
            required
          />
          <v-textarea
            v-model="description"
            label="Task Description"
            outlined
            rounded
            rows="3"
            auto-grow
            color="primary"
            :rules="[(v) => !!v || 'Description is required']"
            required
          />
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="px-4 pb-4">
        <v-btn text color="grey" @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :loading="loading"
          @click="createTask"
          :disabled="!valid"
          rounded
          elevation="1"
        >
          <v-icon left>mdi-check-circle</v-icon>
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: ["value"],
  data() {
    return {
      dialog: this.value,
      title: "",
      description: "",
      loading: false,
      valid: false,
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("input", val);
      if (!val) this.$emit("cancel");
    },
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    async createTask() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        await axios.post(
          "http://localhost:5000/api/tasks",
          { title: this.title, description: this.description },
          { headers: { "auth-token": localStorage.getItem("auth-token") } }
        );
        this.$emit("created");
        this.$toast.success("Task Created Successfully");
        this.dialog = false;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  },
};
</script>
