<template>
  <div class="box" v-on:click="updateSign"> {{ sign }} </div>
</template>

<script>
  export default {
    name: 'GridBox',
    props: ['sign', 'currentSign'],
    methods: {
      updateSign: function () {
        if (this.sign === '') this.$emit('update-sign', this.$vnode.key)
      }
    }
  }

</script>

<style scoped>
  .box {
    border: 6px solid #2c3e50;
    border-radius: 2px;
    font-family: Helvetica;
    font-weight: bold;
    font-size: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
