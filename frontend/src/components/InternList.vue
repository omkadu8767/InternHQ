<template>
  <v-container>
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col cols="12">
        <v-card color="white" class="pa-4 d-flex align-center elevation-2 rounded-xl">
          <v-icon large left color="primary">mdi-account-group</v-icon>
          <span
            style="
              font-size: 1.8rem;
              font-weight: 700;
              letter-spacing: 0.5px;
              color: #1e88e5;
            "
          >
            Interns Overview
          </span>
          <v-spacer></v-spacer>
          <v-chip color="primary" class="font-weight-bold" outlined>
            Task Summary
          </v-chip>
        </v-card>
      </v-col>
    </v-row>

    <!-- Intern Cards -->
    <v-row>
      <v-col cols="12" md="6" v-for="intern in interns" :key="intern._id">
        <v-hover v-slot="{ hover }">
          <v-card
            class="mb-4 rounded-xl transition-ease-in-out"
            :elevation="hover ? 8 : 2"
            color="white"
            style="border: 2px solid #e3f2fd"
          >
            <v-card-title
              class="d-flex align-center"
              style="padding-bottom: 0; font-weight: 600"
            >
              <v-icon left color="primary">mdi-account</v-icon>
              <span style="font-size: 1.1rem">{{ intern.name }}</span>
              <span class="grey--text ml-2" style="font-size: 0.95rem">
                ({{ intern.email }})
              </span>
              <v-spacer></v-spacer>
              <v-btn icon color="error" @click="deleteIntern(intern._id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text style="padding-top: 8px; padding-bottom: 12px">
              <div class="d-flex flex-wrap">
                <v-chip color="grey lighten-1" outlined class="ma-1" small label>
                  Pending: {{ intern.counts.pending }}
                </v-chip>
                <v-chip color="primary" outlined class="ma-1" small label>
                  Submitted: {{ intern.counts.submitted }}
                </v-chip>
                <v-chip color="success" outlined class="ma-1" small label>
                  Evaluated: {{ intern.counts.evaluated }}
                </v-chip>
                <v-chip color="info" outlined class="ma-1" small label>
                  Total: {{ intern.counts.total }}
                </v-chip>
              </div>

              <v-divider class="my-3"></v-divider>

              <div v-if="intern.starCount">
                <span style="font-weight: 600">Performance:</span>
                <v-rating
                  :value="intern.avgStars"
                  color="amber"
                  dense
                  readonly
                  size="20"
                />
                <span class="grey--text ml-2">
                  ({{ intern.avgStars.toFixed(2) }} / 5 from {{ intern.starCount }} tasks)
                </span>
              </div>
              <div v-else>
                <span class="grey--text">No tasks evaluated yet.</span>
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import ApiService from "@/services/api";
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
        const res = await axios.get(ApiService.getApiUrl("/tasks/admin/interns"), {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.interns = res.data.interns || [];
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async fetchPerformance() {
      try {
        const res = await axios.get(ApiService.getApiUrl("/tasks/admin/interns"), {
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
        await axios.delete(`${ApiService.getApiUrl("/auth/admin/interns")}/${internId}`, {
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
