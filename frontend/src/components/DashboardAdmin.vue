<template>
  <v-container>
    <Loader :loading="loading" />

    <v-btn color="primary" class="mb-4" @click="showTaskForm = true">
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
        <v-card class="mb-4">
          <v-card-title>
            {{ task.title }}
          </v-card-title>
          <v-card-text>
            <div><strong>Description:</strong> {{ task.description }}</div>
            <div>
              <strong>Created:</strong> {{ new Date(task.createdAt).toLocaleString() }}
            </div>
            <div><strong>Assignments:</strong></div>
            <v-divider class="my-2"></v-divider>
            <div v-if="task.assignments && task.assignments.length">
              <v-card
                v-for="assign in task.assignments"
                :key="assign._id"
                class="mb-2 pa-2"
                outlined
              >
                <div>
                  <strong>Intern:</strong>
                  {{ assign.intern ? assign.intern.name : "Unassigned" }}
                  <span v-if="assign.intern">({{ assign.intern.email }})</span>
                </div>
                <div>
                  <strong>Status:</strong>
                  <v-chip :color="statusColor(assign.status)" small>
                    {{ assign.status }}
                  </v-chip>
                </div>
                <div v-if="assign.submissionLink">
                  <strong>Submission:</strong>
                  <a :href="assign.submissionLink" target="_blank">{{
                    assign.submissionLink
                  }}</a>
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
import TaskForm from "./TaskForm.vue";
import TaskEvaluate from "./TaskEvaluate.vue";

export default {
  components: { Loader, TaskForm, TaskEvaluate },
  data() {
    return {
      loading: true,
      tasks: [],
      showTaskForm: false,
    };
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
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
  },
};
</script>
