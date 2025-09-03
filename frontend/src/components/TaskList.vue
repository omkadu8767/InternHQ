<template>
  <v-list two-line>
    <v-subheader>Assigned Tasks</v-subheader>
    <v-list-item
      v-for="assignment in assignments"
      :key="assignment._id"
    >
      <v-list-item-content>
        <v-list-item-title>{{ assignment.task.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ assignment.task.description }}<br>
          <strong>Status:</strong>
          <v-chip :color="statusColor(assignment.status)" small>
            {{ assignment.status }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <a v-if="assignment.submissionLink" :href="assignment.submissionLink" target="_blank">
          <v-icon>mdi-link</v-icon>
        </a>
      </v-list-item-action>
    </v-list-item>
    <v-divider />
  </v-list>
</template>

<script>
export default {
  props: ['assignments'],
  methods: {
    statusColor(status) {
      if (status === 'pending') return 'grey'
      if (status === 'submitted') return 'blue'
      if (status === 'evaluated') return 'green'
      return 'grey'
    }
  }
}
</script>
