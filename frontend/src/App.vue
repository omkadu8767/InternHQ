/* eslint-disable vue/multi-word-component-names */

<template>
  <v-app>
    <!-- Global Navigation Bar -->
    <Navbar />

    <!-- Loader Overlay (on route change or global loading) -->
    <Loader :loading="globalLoading" />

    <!-- Main Page Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Loader from "./components/AppLoader.vue";
import Navbar from "./components/AppNavbar.vue";

export default {
  components: {
    Navbar,
    Loader,
  },
  data() {
    return {
      globalLoading: false, //if route changes, loader appears
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.globalLoading = true;
      next();
    });
    this.$router.afterEach(() => {
      this.globalLoading = false;
    });
  },
};
</script>

<style>
/* Add any global styles here */
</style>
