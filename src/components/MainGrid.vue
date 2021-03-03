<template>
  <div>
    <toggle-button @change="onChangeEventHandler" :labels="toggleLabels" :width="100" :height="30"
      :value="activateAI" />
    <Message v-bind:message="message" v-bind:currentSign="currentSign" />
    <div class="grid" :style="{'width': `${gridSize}px`, 'height': `${gridSize}px`}">
      <GridBox v-for="gridBox in gridBoxes" :key="gridBox.id" v-bind:sign="gridBox.sign"
        v-bind:currentSign="currentSign" v-on:update-sign="updateSign" />
    </div>
  </div>
</template>

<script>
  import GridBox from './GridBox.vue'
  import Message from './Message.vue'
  import { ToggleButton } from 'vue-js-toggle-button'

  export default {
    name: 'MainGrid',
    data: () => {
      return {
        gridSize: 300,
        activateAI: true,
        toggleLabels: {
          checked: 'AI On',
          unchecked: 'AI Off'
        },
        message: 'Start playing by clicking on a tile.',
        currentSign: 'X',
        gridBoxes: [
          { id: 0, sign: '' },
          { id: 1, sign: '' },
          { id: 2, sign: '' },
          { id: 3, sign: '' },
          { id: 4, sign: '' },
          { id: 5, sign: '' },
          { id: 6, sign: '' },
          { id: 7, sign: '' },
          { id: 8, sign: '' }
        ],
        winConditions: [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ]
      }
    },
    // apparently CSS absolutely hates squares, so I got annoyed and forced square responsivity on component creation
    created: function () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      this.gridSize = windowWidth >= windowHeight ? windowHeight * 0.70 : windowWidth * 0.70
    },

    methods: {
      // when a game ends all tiles get reset
      resetGrid: function () {
        this.gridBoxes.forEach(e => {
          e.sign = ''
        })
      },

      // component sends a signal when it gets clicked and this function executes
      updateSign: function (targetNode) {
        // updating data for the GridBox that emitted the signal
        this.gridBoxes[targetNode].sign = this.currentSign
        this.message = ''
        const winConditions = this.winConditions
        // quick and ugly win or draw check
        const isWon = winConditions.map(e => e.map(e => this.gridBoxes[e].sign)).filter(e => e.every(e => e === this
          .gridBoxes[targetNode].sign)).length > 0
        const isDraw = !isWon && this.gridBoxes.every(e => e.sign !== '')
        // checking if the game is over and updating the message accordingly
        if (isWon) {
          this.message = `${this.currentSign} won. Click on a tile to start another match.`
          this.resetGrid()
        } else if (isDraw) {
          this.message = 'It\'s a draw. Click on a tile to start another match.'
          this.resetGrid()
        }
        this.changeSign()
        if (this.activateAI) {
          this.aiTurn()
        }
      },

      // activating the AI and resetting the grid
      onChangeEventHandler: function () {
        this.activateAI = !this.activateAI
        this.resetGrid()
      },

      // extremely basic AI
      aiTurn: function () {
        const currentSign = this.currentSign
        const winConditions = this.winConditions
        const gridBoxes = this.gridBoxes

        // if the AI can win in its current turn, it will
        // hack-ish way to break out of the method, but I don't like classic for loops
        winConditions.every(e => {
          const currentCheckedLine = [gridBoxes[e[0]].sign, gridBoxes[e[1]].sign, gridBoxes[e[2]].sign]
          const canWin = (currentCheckedLine.filter(x => x === currentSign).length === 2) && (currentCheckedLine.filter(x => x === '').length === 1)
          if (canWin) {
            e.forEach(p => { if (gridBoxes[p].sign === '') gridBoxes[p].sign = currentSign })
            this.message = `${this.currentSign} won. Click on a tile to start another match.`
            this.changeSign()
            this.resetGrid()
            return false
          }
          return true
        })

        // otherwise it will just choose a random empty tile
        const emptyTiles = gridBoxes.filter(e => e.sign === '').map(e => e.id)
        const randomEmptyTileId = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
        gridBoxes[randomEmptyTileId].sign = currentSign
        this.changeSign()
      },

      changeSign: function () {
        this.currentSign = this.currentSign === 'X' ? 'O' : 'X'
      }
    },
    components: {
      GridBox,
      Message,
      ToggleButton
    }
  }

</script>

<style scoped>
  .grid {
    max-height: 700px;
    max-width: 700px;
    margin: 0 auto;
    background-color: #34495e;
    color: #fff;
    border: 6px solid #2c3e50;
    border-radius: 10px;
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  }
</style>
