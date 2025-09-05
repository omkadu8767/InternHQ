<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
  <v-card class="pa-4 elevation-10 rounded-lg" color="secondary" dark>
          <v-row align="center">
            <v-col cols="4" class="text-center">
              <v-avatar size="80">
                <v-icon large color="accent">mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div style="font-size: 1.5rem; font-weight: 600">{{ user.name }}</div>
              <div class="grey--text">{{ user.email }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <div>
            <v-chip color="grey" class="ma-1" small dark>
              Pending: {{ taskCounts.pending }}
            </v-chip>
            <v-chip color="accent" class="ma-1" small dark>
              Submitted: {{ taskCounts.submitted }}
            </v-chip>
            <v-chip color="success" class="ma-1" small dark>
              Evaluated: {{ taskCounts.evaluated }}
            </v-chip>
            <v-chip color="primary" class="ma-1" small dark>
              Total: {{ taskCounts.total }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: { name: "", email: "" },
      taskCounts: { pending: 0, submitted: 0, evaluated: 0, total: 0 },
    };
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/getuser", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.user = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async fetchTaskCounts() {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/assigned", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        const assignments = res.data.assignments || [];
        const counts = {
          pending: 0,
          submitted: 0,
          evaluated: 0,
          total: assignments.length,
        };
        assignments.forEach((a) => {
          if (a.status === "pending") counts.pending++;
          else if (a.status === "submitted") counts.submitted++;
          else if (a.status === "evaluated") counts.evaluated++;
        });
        this.taskCounts = counts;
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchUser();
    this.fetchTaskCounts();
  },
};
</script>
