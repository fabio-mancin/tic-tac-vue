<template>
  <div class="home">
    <MainGrid />
  </div>
</template>

<script>
  // @ is an alias to /src
  import MainGrid from '@/components/MainGrid.vue'

  export default {
    name: 'Home',
    components: {
      MainGrid
    }
  }

</script>

<style>
  .home {
    width: 100%;
    height: 97vh;
  }
</style>
