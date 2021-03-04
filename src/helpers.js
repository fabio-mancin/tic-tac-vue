export const helpers = {
  winConditions: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],

  checkVictory: function (gridBoxes) {
    const isWon = this.winConditions.some(e => {
      return [gridBoxes[e[0]].sign, gridBoxes[e[1]].sign, gridBoxes[e[2]].sign].filter((x, i, a) => x === a[0] && x !== '').length === 3
    })
    const isDraw = !isWon && gridBoxes.every(e => e.sign !== '')
    return {
      isWon: isWon,
      isDraw: isDraw
    }
  },

  // AD (artificial dumbness, can't really call this intelligence) logic
  playAiTurn: function (currentSign, gridBoxes) {
    const otherSign = currentSign === 'X' ? 'O' : 'X'
    const turnResult = {
        canWin: false,
        preventedLose: false,
        parsedLine: []
    }
    // hack-ish way to break out of the method, but I really dislike how traditional for loops look
    // the AI doesn't plan ahead, it just makes decisions based on the current grid setup
    // if it can win, it will
    // otherwise it will try to prevent the user from winning
    this.winConditions.every(e => {
      const currentCheckedLine = [gridBoxes[e[0]].sign, gridBoxes[e[1]].sign, gridBoxes[e[2]].sign]
      const canWin = (currentCheckedLine.filter(x => x === currentSign).length === 2) && (currentCheckedLine.filter(x => x === '').length === 1)
      const preventLose = (currentCheckedLine.filter(x => x === otherSign).length === 2) && (currentCheckedLine.filter(x => x === '').length === 1)
      if (canWin) {
        turnResult.canWin = true
        turnResult.parsedLine = e
        return false
      }
      if (preventLose) {
        turnResult.preventedLose = true
        turnResult.parsedLine = e
        return false
      }
      return true
    })

    return turnResult
  }
}
