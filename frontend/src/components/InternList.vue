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
          <v-card-title>
            <v-icon left color="accent">mdi-account</v-icon>
            {{ intern.name }} <span class="grey--text ml-2">({{ intern.email }})</span>
          </v-card-title>
          <v-card-text>
            <div>
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
  },
  mounted() {
    this.fetchInterns();
  },
};
</script>
