<template>
  <v-app-bar app color="primary" elevate-on-scroll>
    <v-toolbar-title
      class="d-flex align-center"
      style="gap: 10px; cursor: pointer"
      @click="navigateTo('/')"
    >
      <img
        src="../assets/logo2.png"
        alt="InternHQ Logo"
        height="36"
        style="margin-right: 8px; vertical-align: middle"
      />
      <span
        style="font-size: 1.7rem; font-weight: 700; letter-spacing: 1px; color: white"
      >
        <span
          style="color: #00b8d4; font-weight: 900; font-size: 2rem; letter-spacing: 2px"
          >Intern</span
        ><span
          style="color: white; font-weight: 900; font-size: 2rem; letter-spacing: 2px"
          >HQ</span
        >
      </span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn
        v-if="isAuthenticated && !isAdmin"
        to="/intern"
        text
        class="mx-2"
        color="white"
        >Home</v-btn
      >
      <v-btn v-if="isAuthenticated && isAdmin" to="/admin" text class="mx-2" color="white"
        >Home</v-btn
      >
      <v-btn
        v-if="isAuthenticated && !isAdmin"
        to="/profile"
        text
        class="mx-2"
        color="white"
        >Profile</v-btn
      >
      <v-btn
        v-if="isAuthenticated && !isAdmin"
        to="/leaderboard"
        text
        class="mx-2"
        color="white"
        >Leaderboard</v-btn
      >
      <v-btn
        v-if="isAuthenticated && isAdmin"
        to="/admin-list"
        text
        class="mx-2"
        color="white"
        >List</v-btn
      >
      <v-btn
        v-if="!isAuthenticated"
        to="/login"
        outlined
        class="mx-2"
        color="white"
        style="border: 2px solid white; font-weight: 600"
        >Login</v-btn
      >
      <v-btn
        v-if="!isAuthenticated"
        to="/signup"
        outlined
        class="mx-2"
        color="white"
        style="border: 2px solid white; font-weight: 600"
        >Signup</v-btn
      >
      <v-btn
        v-if="isAuthenticated"
        @click="logout"
        outlined
        class="mx-2"
        color="white"
        style="border: 2px solid #ffcdd2; color: #ffcdd2; font-weight: 600"
        >Logout</v-btn
      >
    </template>
    <template v-else>
      <v-menu offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" color="white">
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
          <v-list-item
            v-if="isAuthenticated && !isAdmin"
            @click="navigateTo('/leaderboard')"
          >
            <v-list-item-title>Leaderboard</v-list-item-title>
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
              <span style="color: #1e88e5; font-weight: 600">Login</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isAuthenticated" @click="navigateTo('/signup')">
            <v-list-item-title>
              <span style="color: #1e88e5; font-weight: 600">Signup</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuthenticated" @click="logout">
            <v-list-item-title>
              <span style="color: #e53935; font-weight: 600; cursor: pointer"
                >Logout</span
              >
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
