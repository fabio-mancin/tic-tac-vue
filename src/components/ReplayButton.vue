<template>
  <button> Play Again!</button>
</template>

<script>
  export default {
    name: 'ReplayButton'
  }

</script>

<style scoped>
  button {
    display: inline-block;
    padding: 0.3em 1.2em;
    margin: 0 0.3em 0.3em 0;
    border-radius: 2em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: #FFFFFF;
    background-color: #eb8f44;
    text-align: center;
    transition: all 0.2s;
  }

  button:hover {
    background-color: #4095c6;
  }

  @media all and (max-width:30em) {
    button {
      display: block;
      margin: 0.2em auto;
    }
  }

</style>
