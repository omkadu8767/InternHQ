<template>
  <v-container>
    <!-- Loader -->
    <Loader v-if="loading && tasks.length === 0" :loading="loading" />

    <!-- Header Card -->
    <v-row align="center" class="mb-4">
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
            mdi-account-cog
          </v-icon>

          <span
            class="font-weight-bold"
            :style="{
              fontSize: $vuetify.breakpoint.mdAndUp ? '1.8rem' : '1.2rem',
              letterSpacing: '0.5px',
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
            <v-chip color="primary" class="font-weight-bold" outlined>
              Task Management
            </v-chip>
          </div>

          <!-- Slim Loader -->
          <v-progress-linear
            v-if="loading && tasks.length > 0"
            indeterminate
            color="primary"
            height="3"
            style="position: absolute; left: 0; right: 0; bottom: 0"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Task Button -->
    <v-btn
      color="primary"
      class="mb-4"
      elevation="2"
      rounded
      @click="showTaskForm = true"
    >
      <v-icon left>mdi-plus</v-icon>
      Create New Task
    </v-btn>

    <!-- Task Form -->
    <TaskForm
      v-model="showTaskForm"
      @created="refreshTasks"
      @cancel="showTaskForm = false"
    />

    <!-- Empty State -->
    <div v-if="tasks.length === 0 && !loading">
      <v-alert type="info" outlined>No tasks created yet.</v-alert>
    </div>

    <!-- Analytics & Insights -->
    <v-row class="mb-6" v-if="tasks.length > 0">
      <v-col cols="12" md="4">
        <v-card class="pa-4 rounded-xl elevation-2">
          <div class="font-weight-bold mb-2" style="color: #1e88e5">
            Task Completion Rate
          </div>
          <LineChart
            v-if="completionChartData.labels && completionChartData.labels.length"
            :data="completionChartData"
            :options="chartOptions"
            :height="180"
          />
          <div v-else class="text-center grey--text">No data available</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 rounded-xl elevation-2">
          <div class="font-weight-bold mb-2" style="color: #1e88e5">
            Average Scores per Intern
          </div>
          <BarChart
            v-if="scoreChartData.labels && scoreChartData.labels.length"
            :data="scoreChartData"
            :options="chartOptions"
            :height="180"
          />
          <div v-else class="text-center grey--text">No data available</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 rounded-xl elevation-2">
          <div class="font-weight-bold mb-2" style="color: #1e88e5">
            Most Active Interns
          </div>
          <PieChart
            v-if="activeChartData.labels && activeChartData.labels.length"
            :data="activeChartData"
            :options="chartOptions"
            :height="180"
          />
          <div v-else class="text-center grey--text">No data available</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Task List -->
    <v-row>
      <v-col cols="12" md="6" v-for="task in tasks" :key="task._id">
        <v-card
          class="mb-4 rounded-xl elevation-2"
          :style="{
            background: '#f5f5f5',
            color: '#1E1E1E',
            borderLeft: '6px solid #1E88E5',
          }"
        >
          <!-- Task Header -->
          <v-card-title class="headline font-weight-bold d-flex align-center">
            <v-icon color="primary" left>mdi-clipboard-text</v-icon>
            <span class="flex-grow-1">{{ task.title }}</span>
            <v-btn icon color="error" @click="deleteTask(task._id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Task Body -->
          <v-card-text>
            <div class="mb-2"><strong>Description:</strong> {{ task.description }}</div>

            <!-- Add Admin Name -->
            <div class="mb-2">
              <v-icon color="success" small>mdi-account-tie</v-icon>
              <strong>Assigned by:</strong>
              {{ task.postedBy ? task.postedBy.name : "Unknown Admin" }}
              <span v-if="task.postedBy && task.postedBy.email"
                >({{ task.postedBy.email }})</span
              >
            </div>

            <div class="mb-2">
              <v-icon color="info" small>mdi-calendar</v-icon>
              <strong>Created:</strong> {{ new Date(task.createdAt).toLocaleString() }}
            </div>

            <!-- Assignments -->
            <div class="mb-1"><strong>Assignments:</strong></div>
            <v-divider class="my-2" color="grey lighten-2"></v-divider>

            <div v-if="task.assignments && task.assignments.length">
              <v-card
                v-for="assign in task.assignments"
                :key="assign._id"
                class="mb-2 pa-3 rounded-lg elevation-1"
                :style="{
                  background: '#ffffff',
                  borderLeft: '4px solid #90caf9',
                  color: '#333',
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
                  <v-chip :color="statusColor(assign.status)" small outlined>
                    {{ assign.status }}
                  </v-chip>
                  <v-chip v-if="assign.edited" color="orange" small outlined class="ml-2">
                    Edited
                  </v-chip>
                </div>
                <div v-if="assign.submissionLink">
                  <strong>Submission:</strong>
                  <a
                    :href="assign.submissionLink"
                    target="_blank"
                    class="text-decoration-none"
                    style="color: #1e88e5"
                  >
                    {{ assign.submissionLink }}
                  </a>
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
import BarChart from "./Charts/BarChart.vue";
import LineChart from "./Charts/LineChart.vue";
import PieChart from "./Charts/PieChart.vue";
import TaskEvaluate from "./TaskEvaluate.vue";
import TaskForm from "./TaskForm.vue";

export default {
  components: { Loader, TaskForm, TaskEvaluate, LineChart, BarChart, PieChart },
  data() {
    return {
      loading: true,
      tasks: [],
      showTaskForm: false,
      pollIntervalId: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
      completionChartData: { labels: [], datasets: [] },
      scoreChartData: { labels: [], datasets: [] },
      activeChartData: { labels: [], datasets: [] },
    };
  },
  methods: {
    async fetchTasks() {
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
      this.fetchAnalytics();
      this.showTaskForm = false;
    },
    statusColor(status) {
      if (status === "pending") return "grey lighten-1";
      if (status === "submitted") return "blue lighten-2";
      if (status === "evaluated") return "green lighten-1";
      return "grey lighten-1";
    },
    async fetchAnalytics() {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/admin/interns", {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        const interns = res.data.interns || [];

        if (interns.length === 0) {
          this.completionChartData = { labels: [], datasets: [] };
          this.scoreChartData = { labels: [], datasets: [] };
          this.activeChartData = { labels: [], datasets: [] };
          return;
        }

        // Task Completion Rate
        const completed = interns
          .map((i) => i.counts.evaluated)
          .reduce((a, b) => a + b, 0);
        const pending = interns.map((i) => i.counts.pending).reduce((a, b) => a + b, 0);
        const submitted = interns
          .map((i) => i.counts.submitted)
          .reduce((a, b) => a + b, 0);

        this.completionChartData = {
          labels: ["Completed", "Submitted", "Pending"],
          datasets: [
            {
              label: "Tasks",
              backgroundColor: ["#66bb6a", "#42a5f5", "#ffa726"],
              data: [completed, submitted, pending],
            },
          ],
        };

        // Average Scores per Intern (only those with scores)
        const internsWithScores = interns.filter((i) => i.avgStars && i.avgStars > 0);
        this.scoreChartData = {
          labels: internsWithScores.map((i) => i.name),
          datasets: [
            {
              label: "Avg Stars",
              backgroundColor: "#1e88e5",
              data: internsWithScores.map((i) => i.avgStars || 0),
            },
          ],
        };

        // Most Active Interns (by total tasks)
        const activeInterns = interns.filter((i) => i.counts.total > 0);
        this.activeChartData = {
          labels: activeInterns.map((i) => i.name),
          datasets: [
            {
              label: "Tasks",
              backgroundColor: activeInterns.map((_, index) => {
                const colors = ["#29b6f6", "#66bb6a", "#ffa726", "#ef5350", "#ab47bc"];
                return colors[index % colors.length];
              }),
              data: activeInterns.map((i) => i.counts.total),
            },
          ],
        };
      } catch (err) {
        console.error("Analytics fetch error:", err);
        this.completionChartData = { labels: [], datasets: [] };
        this.scoreChartData = { labels: [], datasets: [] };
        this.activeChartData = { labels: [], datasets: [] };
      }
    },
  },
  mounted() {
    this.fetchTasks();
    this.fetchAnalytics();
    this.pollIntervalId = setInterval(() => {
      this.fetchTasks();
      this.fetchAnalytics();
    }, 30000); //30000ms (30 seconds)
  },
  beforeDestroy() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  },
};
</script>
