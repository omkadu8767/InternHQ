<template>
  <v-app-bar app>
    <v-toolbar-title>Intern Portal</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="isAuthenticated" to="/">Home</v-btn>
    <v-btn v-if="isAuthenticated" to="/intern">Tasks</v-btn>
    <v-btn v-if="!isAuthenticated" to="/login">Login</v-btn>
    <v-btn v-if="!isAuthenticated" to="/signup">Signup</v-btn>
    <v-btn v-if="isAuthenticated" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>
<script>
export default {
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('auth-token')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('isAdmin');
      this.isAuthenticated = false;
      this.$toast.success('Logout successful!');
      this.$router.push('/login');

    },
    syncAuth() {
      this.isAuthenticated = !!localStorage.getItem('auth-token');
    }
  },
  created() {
    // Listen for storage events (e.g., login in another tab)
    window.addEventListener('storage', this.syncAuth);
  },
  destroyed() { //logout button freeze problem solved
    window.removeEventListener('storage', this.syncAuth);
  },
  watch: {
    // Update isAuthenticated when route changes. when login,make logout visible and vice-versa (login/signup)
    '$route'() {
      this.isAuthenticated = !!localStorage.getItem('auth-token');
    }
  }
}
</script>