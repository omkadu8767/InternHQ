<template>
  <v-container>
    <!-- Loader for initial load only -->
    <Loader v-if="loading && allAssignments.length === 0" :loading="loading" />
    <!-- Small loader at the top during polling -->
    <v-progress-linear
      v-if="loading && allAssignments.length > 0"
      indeterminate
      color="primary"
      height="4"
      class="mb-2"
    />

    <v-row align="center" class="mb-4">
      <v-col cols="12">
        <v-card
          color="primary"
          dark
          class="pa-4 d-flex align-center elevation-10 flex-wrap rounded-lg"
          style="border-radius: 16px; position: relative"
        >
          <v-icon
            :large="$vuetify.breakpoint.mdAndUp"
            :small="!$vuetify.breakpoint.mdAndUp"
            left
            color="accent"
            >mdi-account-circle</v-icon
          >
          <span
            :style="{
              fontSize: $vuetify.breakpoint.mdAndUp ? '2rem' : '1.2rem',
              fontWeight: 600,
              letterSpacing: '1px',
              wordBreak: 'break-word',
              flex: '1 1 auto',
              minWidth: 0,
            }"
          >
            Intern Portal
          </span>
          <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
          <div
            :style="{
              width: $vuetify.breakpoint.mdAndUp ? 'auto' : '100%',
              marginTop: $vuetify.breakpoint.mdAndUp ? '0' : '8px',
              display: 'flex',
              justifyContent: $vuetify.breakpoint.mdAndUp ? 'flex-end' : 'center',
            }"
          >
            <v-chip color="accent" class="font-weight-bold" outlined dark>
              My Assignments
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!loading && allAssignments.length === 0" type="info" outlined>
      No tasks assigned yet.
    </v-alert>

    <div v-if="assignedAssignments.length">
      <v-subheader>Tasks to Submit</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in assignedAssignments"
          :key="assignment._id"
        >
          <v-card
            class="mb-4 elevation-12 rounded-xl"
            :style="{
              borderLeft: '6px solid #00B8D4',
              background: 'linear-gradient(135deg, #232526 0%, #3F51B5 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(63,81,181,0.15)',
            }"
          >
            <v-card-title class="headline font-weight-bold" style="letter-spacing: 1px">
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

    <div v-if="submittedAssignments.length">
      <v-subheader>Submitted Tasks</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in submittedAssignments"
          :key="assignment._id"
        >
          <v-card
            class="mb-4 elevation-12 rounded-xl"
            :style="{
              borderLeft: '6px solid #00B8D4',
              background: 'linear-gradient(135deg, #232526 0%, #3F51B5 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(63,81,181,0.15)',
            }"
          >
            <v-card-title class="headline font-weight-bold" style="letter-spacing: 1px">
              <v-icon color="accent" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>
              <div>
                <strong>Status:</strong>
                <v-chip color="blue" dark>Submitted</v-chip>
              </div>
              <div>
                <strong>Submission Link:</strong>
                <a
                  :href="assignment.submissionLink"
                  target="_blank"
                  style="color: #00b8d4"
                  >{{ assignment.submissionLink }}</a
                >
              </div>
              <em>Waiting for evaluation from Admin...</em>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="evaluatedAssignments.length">
      <v-subheader>Evaluated Tasks</v-subheader>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="assignment in evaluatedAssignments"
          :key="assignment._id"
        >
          <v-card
            class="mb-4 elevation-12 rounded-xl"
            :style="{
              borderLeft: '6px solid #00B8D4',
              background: 'linear-gradient(135deg, #232526 0%, #3F51B5 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(63,81,181,0.15)',
            }"
          >
            <v-card-title class="headline font-weight-bold" style="letter-spacing: 1px">
              <v-icon color="accent" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>
              <div>
                <strong>Status:</strong>
                <v-chip color="green" dark>Evaluated</v-chip>
              </div>
              <div>
                <strong>Submission Link:</strong>
                <a
                  :href="assignment.submissionLink"
                  target="_blank"
                  style="color: #00b8d4"
                  >{{ assignment.submissionLink }}</a
                >
              </div>
              <div><strong>Feedback:</strong> {{ assignment.feedback }}</div>
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
