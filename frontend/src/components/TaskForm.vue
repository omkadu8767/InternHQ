<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Create New Task</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="title"
            label="Title"
            :rules="[v => !!v || 'Title is required']"
            required
          />
          <v-textarea
            v-model="description"
            label="Description"
            :rules="[v => !!v || 'Description is required']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="loading" @click="createTask" :disabled="!valid">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: ['value'],
  data() {
    return {
      dialog: this.value,
      title: '',
      description: '',
      loading: false,
      valid: false,
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit('input', val);
      if (!val) this.$emit('cancel');
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
          'http://localhost:5000/api/tasks',
          { title: this.title, description: this.description },
          { headers: { 'auth-token': localStorage.getItem('auth-token') } }
        );
        this.$emit('created');
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