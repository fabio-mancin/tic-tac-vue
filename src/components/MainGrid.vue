<template>
  <div>
    <toggle-button v-on:change="onChangeEventHandler"
      :labels="toggleLabels"
      :width="100" :height="30"
      :value="activateAI" />

    <replay-button v-if="gameOver" v-on:click.native="newGame"></replay-button>

    <grid-message v-bind:message="message" v-bind:currentSign="currentSign" />

    <div class="grid" :style="{'width': `${gridSize}px`, 'height': `${gridSize}px`}">

      <grid-box v-for="gridBox in gridBoxes"
        :key="gridBox.id"
        v-bind:sign="gridBox.sign"
        v-bind:currentSign="currentSign"
        v-on:update-sign="updateSign"
        :style="{'pointer-events': `${clickable}`}"/>

    </div>
  </div>
</template>

<script>
  import GridBox from './GridBox.vue'
  import GridMessage from './GridMessage.vue'
  import ReplayButton from './ReplayButton.vue'
  import { ToggleButton } from 'vue-js-toggle-button'
  import { helpers } from '@/helpers.js'

  export default {
    name: 'MainGrid',
    data: () => {
      return {
        gridSize: 300,
        activateAI: true,
        gameOver: false,
        clickable: 'auto',
        toggleLabels: { checked: 'AI On', unchecked: 'AI Off' },
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
        ]
      }
    },
    // apparently CSS absolutely hates aspect ratios, forcing people to hack stuff with paddings or use experimental rules
    // so I got annoyed and forced square responsivity on component creation
    created: function () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      this.gridSize = windowWidth >= windowHeight ? windowHeight * 0.70 : windowWidth * 0.70
    },

    methods: {
      // when a game gets restarted all tiles get reset and the grid is made clickable again
      newGame: function () {
        this.currentSign = 'X'
        this.gridBoxes.forEach(e => {
          e.sign = ''
        })
        this.gameOver = false
        this.clickable = 'auto'
      },

      isGameOver: function () {
        // checking the board for victory or draw conditions
        const isWonOrDraw = helpers.checkVictory(this.gridBoxes)

        // checking if the game is over and updating the message accordingly
        if (isWonOrDraw.isWon) {
          this.message = `${this.currentSign} won. Click the button above to start another match.`
          this.gameOver = true
          // not letting the user click on a tile if the game is over
          this.clickable = 'none'
        } else if (isWonOrDraw.isDraw) {
          this.message = 'It\'s a draw. Click the button above to start another match.'
          this.gameOver = true
          this.clickable = 'none'
        }
      },

      // component sends a signal when it gets clicked and this function executes
      updateSign: function (targetNode) {
        // updating data for the GridBox that emitted the signal
        this.gridBoxes[targetNode].sign = this.currentSign
        this.message = ''

        // checking if the player won with his move
        this.isGameOver()

        // if he didn't and the game is in single player mode, the AI will play its turn
        this.changeSign()
        if (this.activateAI && !this.gameOver) {
          this.aiTurn()
        }
      },

      // activating the AI and resetting the grid
      onChangeEventHandler: function () {
        this.activateAI = !this.activateAI
        this.newGame()
      },

      // extremely basic AI
      aiTurn: function () {
        const currentSign = this.currentSign
        const gridBoxes = this.gridBoxes
        const aiTurnResult = helpers.playAiTurn(this.currentSign, this.gridBoxes)

        if (aiTurnResult.canWin) {
            aiTurnResult.parsedLine.forEach(p => { if (gridBoxes[p].sign === '') gridBoxes[p].sign = currentSign })
            this.message = `${this.currentSign} won. Click the button above to start another match.`
            this.gameOver = true
            this.clickable = 'none'
          }
        if (aiTurnResult.preventedLose) {
            aiTurnResult.parsedLine.forEach(p => { if (gridBoxes[p].sign === '') gridBoxes[p].sign = currentSign })
            this.changeSign()
        }

        // if the AI can't win and the player won't win in this turn, it will just choose a random empty tile
        if (!aiTurnResult.canWin && !aiTurnResult.preventedLose) {
          const emptyTiles = gridBoxes.filter(e => e.sign === '').map(e => e.id)
          const randomEmptyTileId = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
          gridBoxes[randomEmptyTileId].sign = currentSign
          this.changeSign()
        }
      },

      changeSign: function () {
        this.currentSign = this.currentSign === 'X' ? 'O' : 'X'
      }
    },
    components: {
      GridBox,
      GridMessage,
      ToggleButton,
      ReplayButton
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
