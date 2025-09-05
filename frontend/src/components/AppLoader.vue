<template>
  <v-overlay :value="loading">
    <v-progress-circular indeterminate color="accent" size="64" />
  </v-overlay>
</template>
<script>
export default { props: ['loading'] }
</script>
