<template>
  <div>
    <Loader :loading="loading" />
    <TaskList />   <!-- List all tasks -->
    <TaskEvaluate /> <!-- For viewing and evaluating submissions -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false // or true, depending on your logic
    }
  }
}
</script>