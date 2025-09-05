<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col cols="12">
        <v-card
          color="primary"
          dark
          class="pa-4 d-flex align-center elevation-10 rounded-lg"
          style="border-radius: 16px"
        >
          <v-icon large left color="accent">mdi-account-group</v-icon>
          <span style="font-size: 2rem; font-weight: 600; letter-spacing: 1px">
            Interns Overview
          </span>
          <v-spacer></v-spacer>
          <v-chip color="accent" class="font-weight-bold" outlined dark>
            Task Summary
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" v-for="intern in interns" :key="intern._id">
        <v-card class="mb-4 elevation-8 rounded-lg" color="secondary" dark>
          <v-card-title class="d-flex align-center" style="padding-bottom: 0">
            <v-icon left color="accent">mdi-account</v-icon>
            <span style="font-weight: 600; font-size: 1.1rem">{{ intern.name }}</span>
            <span class="grey--text ml-2" style="font-size: 0.95rem"
              >({{ intern.email }})</span
            >
            <v-spacer></v-spacer>
            <v-btn
              icon
              color="error"
              @click="deleteIntern(intern._id)"
              style="margin-left: 8px"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="padding-top: 8px; padding-bottom: 12px">
            <v-chip color="grey" class="ma-1" small dark>
              Pending: {{ intern.counts.pending }}
            </v-chip>
            <v-chip color="accent" class="ma-1" small dark>
              Submitted: {{ intern.counts.submitted }}
            </v-chip>
            <v-chip color="success" class="ma-1" small dark>
              Evaluated: {{ intern.counts.evaluated }}
            </v-chip>
            <v-chip color="primary" class="ma-1" small dark>
              Total: {{ intern.counts.total }}
            </v-chip>
            <v-divider class="my-3"></v-divider>
            <div v-if="intern.starCount">
              <span style="font-weight: 600">Performance:</span>
              <v-rating :value="intern.avgStars" color="amber" dense readonly />
              <span class="grey--text ml-2">
                ({{ intern.avgStars.toFixed(2) }} / 5 from {{ intern.starCount }} tasks)
              </span>
            </div>
            <div v-else>
              <span class="grey--text">No tasks evaluated yet.</span>
            </div>
          </v-card-text>
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
      interns: [],
      loading: true,
      performance: { avgStars: null, count: 0 },
    };
  },
  methods: {
    async fetchInterns() {
      this.loading = true;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/admin/interns", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        // Each intern should have: { _id, name, email, counts: { pending, submitted, evaluated, total } }
        this.interns = res.data.interns || [];
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async fetchPerformance() {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/admin/interns", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.performance = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async deleteIntern(internId) {
      if (!confirm("Are you sure you want to delete this intern?")) return;
      try {
        await axios.delete(`http://localhost:5000/api/auth/admin/interns/${internId}`, {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.interns = this.interns.filter((i) => i._id !== internId);
        this.$toast.success("Intern deleted!");
      } catch (err) {
        this.$toast.error("Failed to delete intern.");
        console.error("Delete error:", err.response ? err.response.data : err);
      }
    },
  },
  mounted() {
    this.fetchInterns();
    this.fetchPerformance();
  },
};
</script>
