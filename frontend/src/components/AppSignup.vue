<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6 elevation-10 rounded-xl" color="surface">
          <div class="text-center mb-4">
            <v-icon size="48" color="accent">mdi-account-plus</v-icon>
            <h2 class="mt-2 font-weight-bold" style="color: var(--v-accent-base)">
              Create Account
            </h2>
            <p class="grey--text">Sign up to get started</p>
          </div>

          <v-form @submit.prevent="signup">
            <v-text-field
              v-model="name"
              label="Name"
              required
              outlined
              rounded
              dense
              color="accent"
            />
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              outlined
              rounded
              dense
              color="accent"
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
              outlined
              rounded
              dense
              color="accent"
            />
            <v-btn
              :loading="loading"
              type="submit"
              color="accent"
              block
              large
              rounded
              class="mt-4"
            >
              <v-icon left>mdi-account-check</v-icon>
              Sign Up
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return { name: "", email: "", password: "", loading: false };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const res = await axios.post("http://localhost:5000/api/auth/createuser", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("auth-token", res.data.authToken);
        localStorage.setItem("isAdmin", res.data.isAdmin); // for role-based views
        this.$toast.success("SignUp successful!");
        this.$router.push(res.data.isAdmin ? "/admin" : "/intern");
      } catch (err) {
        // show error
      }
      this.loading = false;
    },
  },
};
</script>
