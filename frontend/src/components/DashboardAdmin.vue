<template>
  <v-container>
    <!-- Loader for initial load only -->
    <Loader v-if="loading && tasks.length === 0" :loading="loading" />
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
            >mdi-account-cog</v-icon
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
            Admin Portal
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
              Task Management
            </v-chip>
          </div>
          <!-- Small loader at the bottom during polling -->
          <v-progress-linear
            v-if="loading && tasks.length > 0"
            indeterminate
            color="black"
            height="10"
            style="
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 0 0 16px 16px;
            "
          />
        </v-card>
      </v-col>
    </v-row>
    <v-btn color="accent" class="mb-4" dark elevation="6" @click="showTaskForm = true">
      Create New Task
    </v-btn>

    <TaskForm
      v-model="showTaskForm"
      @created="refreshTasks"
      @cancel="showTaskForm = false"
    />

    <div v-if="tasks.length === 0 && !loading">
      <v-alert type="info" outlined>No tasks created yet.</v-alert>
    </div>

    <v-row>
      <v-col cols="12" md="6" v-for="task in tasks" :key="task._id">
        <v-card
          class="mb-4 elevation-12 rounded-xl"
          :style="{
            borderLeft: '6px solid #00B8D4',
            background: 'linear-gradient(135deg, #232526 0%, #3F51B5 100%)',
            color: '#fff',
            boxShadow: '0 4px 24px 0 rgba(63,81,181,0.15)',
          }"
        >
          <v-card-title
            class="headline font-weight-bold d-flex align-center"
            style="letter-spacing: 1px"
          >
            <v-icon color="accent" left>mdi-clipboard-text</v-icon>
            <span style="flex: 1">{{ task.title }}</span>
            <v-btn
              icon
              color="error"
              @click="deleteTask(task._id)"
              style="margin-left: 8px"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="mb-2"><strong>Description:</strong> {{ task.description }}</div>
            <div class="mb-2">
              <v-icon color="info" small>mdi-calendar</v-icon>
              <strong>Created:</strong> {{ new Date(task.createdAt).toLocaleString() }}
            </div>
            <div class="mb-1"><strong>Assignments:</strong></div>
            <v-divider class="my-2"></v-divider>
            <div v-if="task.assignments && task.assignments.length">
              <v-card
                v-for="assign in task.assignments"
                :key="assign._id"
                class="mb-2 pa-2 elevation-2 rounded-lg"
                :style="{
                  background: '#232526',
                  borderLeft: '4px solid #3F51B5',
                  color: '#fff',
                }"
                outlined
              >
                <div>
                  <v-icon color="primary" small left>mdi-account</v-icon>
                  <strong>Intern:</strong>
                  {{ assign.intern ? assign.intern.name : "Unassigned" }}
                  <span v-if="assign.intern">({{ assign.intern.email }})</span>
                </div>
                <div>
                  <strong>Status:</strong>
                  <v-chip :color="statusColor(assign.status)" small dark>
                    {{ assign.status }}
                  </v-chip>
                </div>
                <div v-if="assign.submissionLink">
                  <strong>Submission:</strong>
                  <a
                    :href="assign.submissionLink"
                    target="_blank"
                    style="color: #00b8d4"
                    >{{ assign.submissionLink }}</a
                  >
                </div>
                <div v-if="assign.feedback">
                  <strong>Feedback:</strong> {{ assign.feedback }}
                </div>
                <div v-if="assign.stars">
                  <strong>Stars:</strong>
                  <v-rating :value="assign.stars" color="amber" dense readonly />
                </div>
                <div v-if="assign.status === 'submitted'">
                  <TaskEvaluate :assignment="assign" @evaluated="refreshTasks" />
                </div>
              </v-card>
            </div>
            <div v-else>
              <em>No assignments yet.</em>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Loader from "../components/AppLoader.vue";
import TaskEvaluate from "./TaskEvaluate.vue";
import TaskForm from "./TaskForm.vue";

export default {
  components: { Loader, TaskForm, TaskEvaluate },
  data() {
    return {
      loading: true,
      tasks: [],
      showTaskForm: false,
      pollIntervalId: null,
    };
  },
  methods: {
    async fetchTasks() {
      // Only show loader if no tasks yet (initial load)
      if (this.tasks.length === 0) this.loading = true;
      else this.loading = false;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/admin", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.tasks = res.data.tasks || [];
      } catch (error) {
        console.error(error);
      }
      // Always briefly show polling loader
      this.loading = false;
    },
    async deleteTask(taskId) {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        this.tasks = this.tasks.filter((t) => t._id !== taskId);
        this.$toast && this.$toast.success
          ? this.$toast.success("Task deleted!")
          : alert("Task deleted!");
      } catch (err) {
        this.$toast && this.$toast.error
          ? this.$toast.error("Failed to delete task.")
          : alert("Failed to delete task.");
        console.error("Delete error:", err.response ? err.response.data : err);
      }
    },
    refreshTasks() {
      this.fetchTasks();
      this.showTaskForm = false;
    },
    statusColor(status) {
      if (status === "pending") return "grey";
      if (status === "submitted") return "blue";
      if (status === "evaluated") return "green";
      return "grey";
    },
  },
  mounted() {
    this.fetchTasks();
    // Start polling every 5 seconds
    this.pollIntervalId = setInterval(() => {
      this.fetchTasks();
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
