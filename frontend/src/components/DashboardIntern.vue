<template>
  <v-container fluid>
    <!-- Loader for initial load only -->
    <Loader v-if="loading && allAssignments.length === 0" :loading="loading" />

    <!-- Small loader at the top during polling -->
    <v-progress-linear
      v-if="loading && allAssignments.length > 0"
      indeterminate
      color="primary"
      height="4"
      class="mb-2 rounded-pill"
    />

    <!-- Header Card -->
    <v-row align="center" class="mb-6">
      <v-col cols="12">
        <v-card
          color="primary"
          dark
          class="pa-4 d-flex align-center flex-wrap rounded-xl elevation-12"
        >
          <v-icon
            :large="$vuetify.breakpoint.mdAndUp"
            :small="!$vuetify.breakpoint.mdAndUp"
            left
            color="accent"
          >
            mdi-account-circle
          </v-icon>

          <span
            class="font-weight-bold white--text"
            :class="{
              'text-h5': !$vuetify.breakpoint.mdAndUp,
              'text-h4': $vuetify.breakpoint.mdAndUp,
            }"
          >
            Intern Portal
          </span>

          <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>

          <div class="d-flex justify-end">
            <v-chip color="accent" outlined class="font-weight-bold">
              My Assignments
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-alert v-if="!loading && allAssignments.length === 0" type="info" outlined>
      No tasks assigned yet.
    </v-alert>

    <!-- Assigned Tasks -->
    <div v-if="assignedAssignments.length">
      <v-subheader class="font-weight-bold">Tasks to Submit</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in assignedAssignments"
          :key="assignment._id"
        >
          <v-card class="mb-4 rounded-xl elevation-12" color="indigo darken-2" dark>
            <v-card-title class="headline font-weight-bold">
              <v-icon color="accent" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>
              <TaskSubmit :assignment="assignment" @submitted="refreshAssignments" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Submitted Tasks -->
    <div v-if="submittedAssignments.length">
      <v-subheader class="font-weight-bold">Submitted Tasks</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in submittedAssignments"
          :key="assignment._id"
        >
          <v-card class="mb-4 rounded-xl elevation-12" color="indigo darken-3" dark>
            <v-card-title class="headline font-weight-bold">
              <v-icon color="accent" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>
              <div class="mb-2">
                <strong>Status:</strong>
                <v-chip color="blue" small dark>Submitted</v-chip>
              </div>
              <div class="mb-2">
                <strong>Submission Link:</strong>
                <a :href="assignment.submissionLink" target="_blank" class="accent--text">
                  {{ assignment.submissionLink }}
                </a>
              </div>
              <em>Waiting for evaluation from Admin...</em>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Evaluated Tasks -->
    <div v-if="evaluatedAssignments.length">
      <v-subheader class="font-weight-bold">Evaluated Tasks</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in evaluatedAssignments"
          :key="assignment._id"
        >
          <v-card class="mb-4 rounded-xl elevation-12" color="primary" dark>
            <v-card-title class="headline font-weight-bold white--text">
              <v-icon color="accent" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text class="white--text">
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>
              <div class="mb-2">
                <strong>Status:</strong>
                <v-chip color="green" small dark>Evaluated</v-chip>
              </div>
              <div class="mb-2">
                <strong>Submission Link:</strong>
                <a
                  :href="assignment.submissionLink"
                  target="_blank"
                  class="accent--text white--text"
                >
                  {{ assignment.submissionLink }}
                </a>
              </div>
              <div class="mb-2"><strong>Feedback:</strong> {{ assignment.feedback }}</div>
              <div>
                <strong>Stars:</strong>
                <v-rating :value="assignment.stars" color="amber" dense readonly />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import Loader from "../components/AppLoader.vue";
import TaskSubmit from "./TaskSubmit.vue";

export default {
  components: { Loader, TaskSubmit },
  data() {
    return {
      allAssignments: [],
      loading: true,
      pollIntervalId: null,
    };
  },
  computed: {
    assignedAssignments() {
      return this.allAssignments.filter((a) => a.status === "pending" && a.task != null);
    },
    submittedAssignments() {
      return this.allAssignments.filter(
        (a) => a.status === "submitted" && a.task != null
      );
    },
    evaluatedAssignments() {
      return this.allAssignments.filter(
        (a) => a.status === "evaluated" && a.task != null
      );
    },
  },
  methods: {
    async fetchAssignments() {
      // Only show loader if no assignments yet (initial load)
      if (this.allAssignments.length === 0) this.loading = true;
      else this.loading = false;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/assigned", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.allAssignments = res.data.assignments || [];
      } catch (error) {
        console.error(error);
      }
      // Always briefly show polling loader
      this.loading = false;
    },
    refreshAssignments() {
      this.fetchAssignments();
    },
  },
  mounted() {
    this.fetchAssignments();
    // Start polling every 5 seconds
    this.pollIntervalId = setInterval(() => {
      this.fetchAssignments();
    }, 5000);
  },
  beforeDestroy() {
    // Clean up polling interval
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  },
};
</script>
