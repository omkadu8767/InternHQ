<template>
  <v-list two-line>
    <v-subheader>Tasks</v-subheader>
    <v-list-item v-for="task in tasks" :key="task._id">
      <v-list-item-content>
        <v-list-item-title>{{ task.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-chip>{{ task.assignments ? task.assignments.length : 0 }} assigned</v-chip>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: ['tasks'],
};
</script>