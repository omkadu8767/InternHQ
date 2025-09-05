<template>
  <v-container>
    <v-card class="pa-4 mx-auto" max-width="400" elevation="10">
      <v-form @submit.prevent="login">
        <v-text-field v-model="email" label="Email" required color="accent" dark />
        <v-text-field v-model="password" label="Password" type="password" required color="accent" dark />
        <v-btn :loading="loading" type="submit" color="accent" dark block>Login</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  data() { return { email: '', password: '', loading: false }; },
  methods: {
    async login() {
      this.loading = true;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email: this.email, password: this.password });
        localStorage.setItem('auth-token', res.data.authToken);
        localStorage.setItem('isAdmin', res.data.isAdmin); // for role-based views
        this.$router.push(res.data.isAdmin ? '/admin' : '/intern');
         this.$toast.success('Login successful!');
      } catch (err) {
        // show error
      }
      this.loading = false;
    }
  }
}
</script>
