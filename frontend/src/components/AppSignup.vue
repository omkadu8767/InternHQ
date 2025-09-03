<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="name" label="Name" required />
      <v-text-field v-model="email" label="Email" required />
      <v-text-field v-model="password" label="Password" type="password" required />
      <v-btn :loading="loading" type="submit">SignUp</v-btn>
    </v-form>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  data() { return { name:'',email: '', password: '', loading: false }; },
  methods: {
    async login() {
      this.loading = true;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/createuser', { name:this.name,email: this.email, password: this.password });
        localStorage.setItem('auth-token', res.data.authToken);
        localStorage.setItem('isAdmin', res.data.isAdmin); // for role-based views
        this.$toast.success('SignUp successful!');
        this.$router.push(res.data.isAdmin ? '/admin' : '/intern');

      } catch (err) {
        // show error
      }
      this.loading = false;
    }
  }
}
</script>
