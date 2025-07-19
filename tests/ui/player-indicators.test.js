/**
 * Tests for player-specific visual indicators in the Tic-tac-toe game
 */

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
        <button id="reset-button">Reset Game</button>
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

// Mock implementation of the TicTacToeView class for testing
class TicTacToeView {
  constructor() {
    const elements = mockDOM();
    this.boardElement = elements.boardElement;
    this.statusElement = elements.statusElement;
    this.resetButton = elements.resetButton;
    this.cells = elements.cells;
    this.gameOverOverlay = elements.gameOverOverlay;
    this.gameOverMessage = elements.gameOverMessage;
    this.srAnnouncer = elements.srAnnouncer;
  }

  updateStatus(status, player) {
    // Remove any existing status classes
    this.statusElement.classList.remove('win', 'draw');

    // Remove player-specific classes from the game board
    this.boardElement.classList.remove('player-x', 'player-o');

    // Update the status message based on the game state
    if (status === 'in_progress') {
      this.statusElement.textContent = `Player ${player}'s turn`;

      // Add player-specific class to the game board
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);
    } else if (status.startsWith('win')) {
      const message = `Player ${player} wins!`;
      this.statusElement.textContent = message;
      this.statusElement.classList.add('win');

      // Keep the winning player's color on the board
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);
    } else if (status === 'draw') {
      const message = 'Game ended in a draw!';
      this.statusElement.textContent = message;
      this.statusElement.classList.add('draw');

      // Remove player-specific classes for draw
      this.boardElement.classList.remove('player-x', 'player-o');
    }
  }
}

// Test suite for player-specific visual indicators
describe('Tic-tac-toe Player Visual Indicators', () => {
  let view;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = '';

    // Create a fresh view for each test
    view = new TicTacToeView();
  });

  test("should add player-x class to game board when it is Player X's turn", () => {
    // Update status for Player X's turn
    view.updateStatus('in_progress', 'X');

    // Verify the player-x class was added to the game board
    expect(view.boardElement.classList.contains('player-x')).toBe(true);
    expect(view.boardElement.classList.contains('player-o')).toBe(false);
  });

  test("should add player-o class to game board when it is Player O's turn", () => {
    // Update status for Player O's turn
    view.updateStatus('in_progress', 'O');

    // Verify the player-o class was added to the game board
    expect(view.boardElement.classList.contains('player-o')).toBe(true);
    expect(view.boardElement.classList.contains('player-x')).toBe(false);
  });

  test('should keep player-x class on game board when Player X wins', () => {
    // Update status for Player X's win
    view.updateStatus('win_X', 'X');

    // Verify the player-x class was kept on the game board
    expect(view.boardElement.classList.contains('player-x')).toBe(true);
    expect(view.boardElement.classList.contains('player-o')).toBe(false);
  });

  test('should keep player-o class on game board when Player O wins', () => {
    // Update status for Player O's win
    view.updateStatus('win_O', 'O');

    // Verify the player-o class was kept on the game board
    expect(view.boardElement.classList.contains('player-o')).toBe(true);
    expect(view.boardElement.classList.contains('player-x')).toBe(false);
  });

  test('should remove player-specific classes from game board when game ends in a draw', () => {
    // First set a player class
    view.boardElement.classList.add('player-x');

    // Update status for a draw
    view.updateStatus('draw', 'X');

    // Verify player-specific classes were removed from the game board
    expect(view.boardElement.classList.contains('player-x')).toBe(false);
    expect(view.boardElement.classList.contains('player-o')).toBe(false);
  });
});
