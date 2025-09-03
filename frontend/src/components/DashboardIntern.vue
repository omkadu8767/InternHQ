<template>
  <v-container>
    <Loader :loading="loading" />

    <v-alert v-if="!loading && allAssignments.length === 0" type="info" outlined>
      No tasks assigned yet.
    </v-alert>

    <div v-if="assignedAssignments.length">
      <v-subheader>Tasks to Submit</v-subheader>
      <v-row>
        <v-col cols="12" md="6" v-for="assignment in assignedAssignments" :key="assignment._id">
          <v-card class="mb-2">
            <v-card-title>{{ assignment.task.title }}</v-card-title>
            <v-card-text>
              <div><strong>Description:</strong> {{ assignment.task.description }}</div>
              <TaskSubmit :assignment="assignment" @submitted="refreshAssignments" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="submittedAssignments.length">
      <v-subheader>Submitted Tasks</v-subheader>
      <v-row>
        <v-col cols="12" md="6" v-for="assignment in submittedAssignments" :key="assignment._id">
          <v-card class="mb-2">
            <v-card-title>{{ assignment.task.title }}</v-card-title>
            <v-card-text>
              <div><strong>Description:</strong> {{ assignment.task.description }}</div>
              <div><strong>Status:</strong>
                <v-chip color="blue">Submitted</v-chip>
              </div>
              <div><strong>Submission Link:</strong>
                <a :href="assignment.submissionLink" target="_blank">{{ assignment.submissionLink }}</a>
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
        <v-col cols="12" md="6" v-for="assignment in evaluatedAssignments" :key="assignment._id">
          <v-card class="mb-2">
            <v-card-title>{{ assignment.task.title }}</v-card-title>
            <v-card-text>
              <div><strong>Description:</strong> {{ assignment.task.description }}</div>
              <div><strong>Status:</strong>
                <v-chip color="green">Evaluated</v-chip>
              </div>
              <div><strong>Submission Link:</strong>
                <a :href="assignment.submissionLink" target="_blank">{{ assignment.submissionLink }}</a>
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
import axios from 'axios'
import Loader from '../components/AppLoader.vue'
import TaskSubmit from './TaskSubmit.vue'

export default {
  components: { Loader, TaskSubmit },
  data() {
    return {
      allAssignments: [],
      loading: true
    }
  },
  computed: {
    assignedAssignments() {
      return this.allAssignments.filter(a => a.status === 'pending')
    },
    submittedAssignments() {
      return this.allAssignments.filter(a => a.status === 'submitted')
    },
    evaluatedAssignments() {
      return this.allAssignments.filter(a => a.status === 'evaluated')
    }
  },
  methods: {
    async fetchAssignments() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:5000/api/tasks/assigned', {
          headers: { 'auth-token': localStorage.getItem('auth-token') }
        })
        this.allAssignments = res.data.assignments.map(assign => ({
          ...assign,
          task: assign.task // already populated
        }))
      } catch (error) {
          console.log(error);
      }
      this.loading = false
    },
    refreshAssignments() {
      this.fetchAssignments()
    }
  },
  mounted() {
    this.fetchAssignments()
  }
}
</script>
