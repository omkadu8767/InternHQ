<template>
  <v-container>
    <v-row align="center" class="mb-6">
      <v-col cols="12">
        <v-card color="white" class="pa-4 d-flex align-center elevation-2 rounded-xl">
          <v-icon large left color="primary">mdi-trophy</v-icon>
          <span
            style="
              font-size: 1.8rem;
              font-weight: 700;
              letter-spacing: 0.5px;
              color: #1e88e5;
            "
          >
            Leaderboard
          </span>
          <v-spacer></v-spacer>
          <v-chip color="primary" class="font-weight-bold" outlined
            >Top Performers</v-chip
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="elevation-1 rounded-xl" color="white">
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Rank</th>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Avg. Stars</th>
                <th class="text-left">Tasks Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in leaderboard" :key="entry._id">
                <td>
                  <v-chip
                    :color="
                      idx === 0
                        ? 'amber'
                        : idx === 1
                        ? 'grey lighten-1'
                        : idx === 2
                        ? 'brown lighten-1'
                        : 'primary'
                    "
                    class="font-weight-bold"
                    small
                  >
                    {{ idx + 1 }}
                  </v-chip>
                </td>
                <td>
                  <span style="font-weight: 600; color: #1976d2">
                    {{ entry.intern ? entry.intern.name : "Unknown" }}
                  </span>
                </td>
                <td>
                  <span class="grey--text">{{
                    entry.intern ? entry.intern.email : "-"
                  }}</span>
                </td>
                <td>
                  <v-rating
                    :value="entry.avgStars"
                    color="amber"
                    dense
                    readonly
                    size="18"
                  />
                  <span class="ml-1 grey--text text--darken-1">
                    ({{ entry.avgStars.toFixed(2) }})
                  </span>
                </td>
                <td>
                  <v-chip color="primary" outlined small>
                    {{ entry.tasksCompleted }}
                  </v-chip>
                </td>
              </tr>
              <tr v-if="leaderboard.length === 0">
                <td colspan="5" class="text-center grey--text">
                  No leaderboard data yet.
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ApiService from "@/services/api";
import axios from "axios";
export default {
  data() {
    return {
      leaderboard: [],
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const res = await axios.get(ApiService.getApiUrl("/tasks/leaderboard"));
        this.leaderboard = res.data.leaderboard || [];
      } catch (err) {
        this.leaderboard = [];
      }
    },
  },
  mounted() {
    this.fetchLeaderboard();
  },
};
</script>
