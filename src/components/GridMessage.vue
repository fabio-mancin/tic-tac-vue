<template>
  <div> <span> {{ message }} Currently playing: {{ currentSign }} </span> </div>
</template>

<script>
  export default {
    name: 'GridMessage',
    props: ['message', 'currentSign']
  }

</script>

<style scoped>
    span {
        font-weight: bold;
    }
</style>
