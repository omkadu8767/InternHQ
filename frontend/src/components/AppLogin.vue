<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6 elevation-4 rounded-xl" color="white">
          <div class="text-center mb-4">
            <v-icon size="48" color="primary">mdi-lock</v-icon>
            <h2 class="mt-2 font-weight-bold" style="color: #1e88e5">Welcome Back</h2>
            <p class="grey--text">Login to your account</p>
          </div>

          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              outlined
              rounded
              dense
              color="primary"
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
              outlined
              rounded
              dense
              color="primary"
            />
            <v-btn
              :loading="loading"
              type="submit"
              color="primary"
              block
              large
              rounded
              class="mt-4"
            >
              <v-icon left>mdi-login</v-icon>
              Login
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
    return { email: "", password: "", loading: false };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("auth-token", res.data.authToken);
        localStorage.setItem("isAdmin", res.data.isAdmin);
        this.$router.push(res.data.isAdmin ? "/admin" : "/intern");
        this.$toast.success("Login successful!");
      } catch (err) {
        // show error
      }
      this.loading = false;
    },
  },
};
</script>
