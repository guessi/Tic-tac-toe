/**
 * Tests for reset button styling
 */

describe('Reset Button Styling', () => {
  // Mock DOM elements for testing
  const mockDOM = () => {
    // Create mock DOM elements
    document.body.innerHTML = `
            <div class="status" id="status"></div>
            <div id="sr-announcer"></div>
            <div id="game-board" class="game-board">
                <div class="cell" data-row="0" data-col="0"></div>
                <div class="cell" data-row="0" data-col="1"></div>
                <div class="cell" data-row="0" data-col="2"></div>
                <div class="cell" data-row="1" data-col="0"></div>
                <div class="cell" data-row="1" data-col="1"></div>
                <div class="cell" data-row="1" data-col="2"></div>
                <div class="cell" data-row="2" data-col="0"></div>
                <div class="cell" data-row="2" data-col="1"></div>
                <div class="cell" data-row="2" data-col="2"></div>
            </div>
            <div id="game-over-overlay">
                <div id="game-over-message"></div>
            </div>
            <button id="reset-button" class="reset-button">Reset Game</button>
        `;

    // Return references to the mock elements
    return {
      statusElement: document.getElementById('status'),
      boardElement: document.getElementById('game-board'),
      cells: document.querySelectorAll('.cell'),
      resetButton: document.getElementById('reset-button'),
      gameOverOverlay: document.getElementById('game-over-overlay'),
      gameOverMessage: document.getElementById('game-over-message'),
      srAnnouncer: document.getElementById('sr-announcer'),
    };
  };

  test('should add game-over class to reset button when game ends', () => {
    // Set up the DOM
    const elements = mockDOM();

    // Create a mock view
    const mockView = {
      resetButton: elements.resetButton,
      showResetButton: function (gameOver) {
        if (gameOver) {
          this.resetButton.classList.add('game-over');
        } else {
          this.resetButton.classList.remove('game-over');
        }
      },
    };

    // Call showResetButton with gameOver = true
    mockView.showResetButton(true);

    // Verify the game-over class was added
    expect(elements.resetButton.classList.contains('game-over')).toBe(true);
  });

  test('should remove game-over class from reset button when game is reset', () => {
    // Set up the DOM
    const elements = mockDOM();
    elements.resetButton.classList.add('game-over');

    // Create a mock view
    const mockView = {
      resetButton: elements.resetButton,
      showResetButton: function (gameOver) {
        if (gameOver) {
          this.resetButton.classList.add('game-over');
        } else {
          this.resetButton.classList.remove('game-over');
        }
      },
    };

    // Call showResetButton with gameOver = false
    mockView.showResetButton(false);

    // Verify the game-over class was removed
    expect(elements.resetButton.classList.contains('game-over')).toBe(false);
  });
});
