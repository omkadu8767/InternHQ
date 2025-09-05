<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Internify</v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn v-if="isAuthenticated && !isAdmin" to="/intern">Home</v-btn>
      <v-btn v-if="isAuthenticated && isAdmin" to="/admin">Home</v-btn>
      <v-btn v-if="isAuthenticated && !isAdmin" to="/profile">Profile</v-btn>
      <v-btn v-if="isAuthenticated && isAdmin" to="/admin-list">List</v-btn>
      <v-btn v-if="!isAuthenticated" to="/login" color="accent" dark>Login</v-btn>
      <v-btn v-if="!isAuthenticated" to="/signup" color="accent" dark>Signup</v-btn>
      <v-btn v-if="isAuthenticated" @click="logout" color="accent" dark>Logout</v-btn>
    </template>
    <template v-else>
      <v-menu offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="isAuthenticated && !isAdmin" @click="navigateTo('/intern')">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuthenticated && !isAdmin" @click="navigateTo('/profile')">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuthenticated && isAdmin" @click="navigateTo('/admin')">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAuthenticated && isAdmin"
            @click="navigateTo('/admin-list')"
          >
            <v-list-item-title>List</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isAuthenticated" @click="navigateTo('/login')">
            <v-list-item-title>
              <span style="color: #ff4081; font-weight: 600">Login</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isAuthenticated" @click="navigateTo('/signup')">
            <v-list-item-title>
              <span style="color: #ff4081; font-weight: 600">Signup</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuthenticated" @click="logout">
            <v-list-item-title>
              <span style="color: #ff4081; font-weight: 600">Logout</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
<script>
export default {
  data() {
    return {
      isAuthenticated: !!localStorage.getItem("auth-token"),
    };
  },
  computed: {
    isAdmin() {
      return localStorage.getItem("isAdmin") === "true";
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("isAdmin");
      this.isAuthenticated = false;
      this.$toast.success("Logout successful!");
      this.$router.push("/login");
    },
    syncAuth() {
      this.isAuthenticated = !!localStorage.getItem("auth-token");
    },
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
  },
  created() {
    // Listen for storage events (e.g., login in another tab)
    window.addEventListener("storage", this.syncAuth);
  },
  destroyed() {
    //logout button freeze problem solved
    window.removeEventListener("storage", this.syncAuth);
  },
  watch: {
    // Update isAuthenticated when route changes. when login,make logout visible and vice-versa (login/signup)
    $route() {
      this.isAuthenticated = !!localStorage.getItem("auth-token");
    },
  },
};
</script>
