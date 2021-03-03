<template>
  <div> <span> {{ message }} Currently playing: {{ currentSign }} </span> </div>
</template>

<script>
  export default {
    name: 'Message',
    props: ['message', 'currentSign']
  }

</script>

<style scoped>
    span {
        font-weight: bold;
    }
</style>
