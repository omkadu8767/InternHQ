<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="submissionLink"
      label="GitHub Link"
      :disabled="loading"
      required
    />
    <v-btn
      :loading="loading"
      type="submit"
      color="primary"
      small
    >
      Submit
    </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios'

export default {
  props: ['assignment'],
  data() {
    return {
      submissionLink: '',
      loading: false
    }
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        await axios.put(`http://localhost:5000/api/tasks/submit/${this.assignment.task._id}`, {
          submissionLink: this.submissionLink
        }, {
          headers: { 'auth-token': localStorage.getItem('auth-token') }
        })
        this.$emit('submitted')
      } catch (error) {
        console.log(error);
        
      }
      this.loading = false
    }
  }
}
</script>
