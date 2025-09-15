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
          class="pa-4 d-flex align-center flex-wrap rounded-xl elevation-4"
          :style="{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
            color: '#1E88E5',
          }"
        >
          <v-icon
            :large="$vuetify.breakpoint.mdAndUp"
            :small="!$vuetify.breakpoint.mdAndUp"
            left
            color="primary"
          >
            mdi-account-circle
          </v-icon>

          <span
            class="font-weight-bold"
            :class="{
              'text-h5': !$vuetify.breakpoint.mdAndUp,
              'text-h4': $vuetify.breakpoint.mdAndUp,
            }"
            style="color: #1e88e5"
          >
            Intern Portal
          </span>

          <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>

          <div class="d-flex justify-end">
            <v-chip color="primary" outlined class="font-weight-bold">
              My Assignments
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Submission Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Submission</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitEdit">
            <v-text-field
              v-model="editSubmissionLink"
              label="GitHub Link"
              required
              color="primary"
            />
            <v-btn :loading="editLoading" type="submit" color="primary" small>
              Save Changes
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

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
          <v-card class="mb-4 rounded-xl elevation-2" color="#e3f2fd">
            <v-card-title class="headline font-weight-bold" style="color: #1e88e5">
              <v-icon color="primary" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>

              <!-- Add Admin Name -->
              <div class="mb-2">
                <v-icon color="success" small>mdi-account-tie</v-icon>
                <strong>Assigned by:</strong>
                {{
                  assignment.task.postedBy
                    ? assignment.task.postedBy.name
                    : "Unknown Admin"
                }}
                <span v-if="assignment.task.postedBy && assignment.task.postedBy.email">
                  ({{ assignment.task.postedBy.email }})
                </span>
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
          <v-card class="mb-4 rounded-xl elevation-2" color="#bbdefb">
            <v-card-title class="headline font-weight-bold" style="color: #1976d2">
              <v-icon color="primary" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>

              <!-- Add Admin Name -->
              <div class="mb-2">
                <v-icon color="success" small>mdi-account-tie</v-icon>
                <strong>Assigned by:</strong>
                {{
                  assignment.task.postedBy
                    ? assignment.task.postedBy.name
                    : "Unknown Admin"
                }}
                <span v-if="assignment.task.postedBy && assignment.task.postedBy.email">
                  ({{ assignment.task.postedBy.email }})
                </span>
              </div>

              <div class="mb-2">
                <strong>Status:</strong>
                <v-chip color="blue lighten-2" small>Submitted</v-chip>
                <v-chip
                  v-if="assignment.edited"
                  color="orange"
                  small
                  outlined
                  class="ml-2"
                  >Edited</v-chip
                >
              </div>
              <div class="mb-2">
                <strong>Submission Link:</strong>
                <a
                  :href="assignment.submissionLink"
                  target="_blank"
                  style="color: #1e88e5"
                >
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
          <v-card class="mb-4 rounded-xl elevation-2" color="#c8e6c9">
            <v-card-title class="headline font-weight-bold" style="color: #388e3c">
              <v-icon color="primary" left>mdi-clipboard-text</v-icon>
              {{ assignment.task.title }}
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Description:</strong> {{ assignment.task.description }}
              </div>

              <!-- Add Admin Name -->
              <div class="mb-2">
                <v-icon color="success" small>mdi-account-tie</v-icon>
                <strong>Assigned by:</strong>
                {{
                  assignment.task.postedBy
                    ? assignment.task.postedBy.name
                    : "Unknown Admin"
                }}
                <span v-if="assignment.task.postedBy && assignment.task.postedBy.email">
                  ({{ assignment.task.postedBy.email }})
                </span>
              </div>

              <div class="mb-2">
                <strong>Status:</strong>
                <v-chip color="green lighten-1" small>Evaluated</v-chip>
                <v-chip
                  v-if="assignment.edited"
                  color="orange"
                  small
                  outlined
                  class="ml-2"
                  >Edited</v-chip
                >
              </div>
              <div class="mb-2">
                <strong>Submission Link:</strong>
                <a
                  :href="assignment.submissionLink"
                  target="_blank"
                  style="color: #1e88e5"
                >
                  {{ assignment.submissionLink }}
                </a>
              </div>
              <div class="mb-2"><strong>Feedback:</strong> {{ assignment.feedback }}</div>
              <div>
                <strong>Stars:</strong>
                <v-rating :value="assignment.stars" color="amber" dense readonly />
              </div>
              <v-btn
                small
                color="primary"
                outlined
                class="mt-2"
                @click="openEditDialog(assignment)"
              >
                Edit Submission
              </v-btn>
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

import ApiService from "@/services/api";
export default {
  components: { Loader, TaskSubmit },
  data() {
    return {
      allAssignments: [],
      loading: true,
      pollIntervalId: null,
      editDialog: false,
      editAssignment: null,
      editSubmissionLink: "",
      editLoading: false,
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
      if (this.allAssignments.length === 0) this.loading = true;
      else this.loading = false;
      try {
        const res = await axios.get(ApiService.getApiUrl("/tasks/assigned"), {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.allAssignments = res.data.assignments || [];
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    refreshAssignments() {
      this.fetchAssignments();
    },
    openEditDialog(assignment) {
      this.editAssignment = assignment;
      this.editSubmissionLink = assignment.submissionLink;
      this.editDialog = true;
    },
    async submitEdit() {
      this.editLoading = true;
      try {
        await axios.put(
          `ApiService.getApiUrl("/tasks/submit/")${this.editAssignment.task._id}`,
          {
            submissionLink: this.editSubmissionLink,
            edited: true,
          },
          {
            headers: { "auth-token": localStorage.getItem("auth-token") },
          }
        );
        this.$toast.success("Submission updated!");
        this.editDialog = false;
        this.refreshAssignments();
      } catch (error) {
        this.$toast.error("Failed to update submission.");
      }
      this.editLoading = false;
    },
  },
  mounted() {
    this.fetchAssignments();
    this.pollIntervalId = setInterval(() => {
      this.fetchAssignments();
    }, 5000);
    // Tawk.to Chatbot integration (only for intern dashboard)
    if (!window.Tawk_API) {
      (function () {
        var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = "https://embed.tawk.to/68bd4b9567c586192c66a3d7/1j4hmugp8";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");
        s0.parentNode.insertBefore(s1, s0);
      })();
    }
  },
  beforeDestroy() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  },
};
</script>
