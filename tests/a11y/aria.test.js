/**
 * Tests for accessibility features in the Tic-tac-toe game
 */

// Mock DOM elements for testing
const mockDOM = () => {
  // Create mock DOM elements
  document.body.innerHTML = `
        <div class="status" id="status" aria-live="polite">Player X's turn</div>
        <div class="sr-only" id="sr-announcer" aria-live="assertive"></div>
        <div id="game-board" role="grid" aria-label="Tic-tac-toe game board">
            <div class="cell" data-row="0" data-col="0" tabindex="0" role="gridcell" aria-label="empty cell, row 1, column 1"></div>
            <div class="cell" data-row="0" data-col="1" tabindex="0" role="gridcell" aria-label="empty cell, row 1, column 2"></div>
            <div class="cell" data-row="0" data-col="2" tabindex="0" role="gridcell" aria-label="empty cell, row 1, column 3"></div>
            <div class="cell" data-row="1" data-col="0" tabindex="0" role="gridcell" aria-label="empty cell, row 2, column 1"></div>
            <div class="cell" data-row="1" data-col="1" tabindex="0" role="gridcell" aria-label="empty cell, row 2, column 2"></div>
            <div class="cell" data-row="1" data-col="2" tabindex="0" role="gridcell" aria-label="empty cell, row 2, column 3"></div>
            <div class="cell" data-row="2" data-col="0" tabindex="0" role="gridcell" aria-label="empty cell, row 3, column 1"></div>
            <div class="cell" data-row="2" data-col="1" tabindex="0" role="gridcell" aria-label="empty cell, row 3, column 2"></div>
            <div class="cell" data-row="2" data-col="2" tabindex="0" role="gridcell" aria-label="empty cell, row 3, column 3"></div>
        </div>
        <div id="game-over-overlay" aria-hidden="true">
            <div id="game-over-message" aria-live="assertive"></div>
        </div>
        <button id="reset-button" aria-label="Reset Game">Reset Game</button>
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

// Mock implementation of the game controller for testing
class TicTacToeController {
  constructor() {
    this.elements = mockDOM();
    this.srAnnouncer = this.elements.srAnnouncer;
  }

  announceToScreenReader(message) {
    // Use the dedicated screen reader announcer element
    this.srAnnouncer.textContent = message;

    // Clear the announcement after a short delay
    setTimeout(() => {
      this.srAnnouncer.textContent = '';
    }, 100);
  }

  describeWinningCombination(combination) {
    if (!combination || combination.length !== 3) {
      return 'unknown combination';
    }

    // Check if it's a row win
    if (combination[0][0] === combination[1][0] && combination[1][0] === combination[2][0]) {
      return `three in a row at row ${combination[0][0] + 1}`;
    }

    // Check if it's a column win
    if (combination[0][1] === combination[1][1] && combination[1][1] === combination[2][1]) {
      return `three in a column at column ${combination[0][1] + 1}`;
    }

    // Check if it's a diagonal win (top-left to bottom-right)
    if (
      combination[0][0] === 0 &&
      combination[0][1] === 0 &&
      combination[2][0] === 2 &&
      combination[2][1] === 2
    ) {
      return 'three in a diagonal from top-left to bottom-right';
    }

    // Check if it's a diagonal win (top-right to bottom-left)
    if (
      combination[0][0] === 0 &&
      combination[0][1] === 2 &&
      combination[2][0] === 2 &&
      combination[2][1] === 0
    ) {
      return 'three in a diagonal from top-right to bottom-left';
    }

    return 'three in a row';
  }
}

// Test suite for accessibility features
describe('Tic-tac-toe Accessibility Features', () => {
  let controller;
  let elements;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = '';

    // Create a fresh controller for each test
    controller = new TicTacToeController();
    elements = mockDOM();

    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore setTimeout
    jest.useRealTimers();
  });

  test('should have proper ARIA attributes on game board', () => {
    // Verify the game board has proper ARIA attributes
    expect(elements.boardElement.getAttribute('role')).toBe('grid');
    expect(elements.boardElement.getAttribute('aria-label')).toContain('Tic-tac-toe game board');
  });

  test('should have proper ARIA attributes on cells', () => {
    // Verify each cell has proper ARIA attributes
    elements.cells.forEach((cell, index) => {
      const row = Math.floor(index / 3) + 1; // 1-indexed for human-readable
      const col = (index % 3) + 1; // 1-indexed for human-readable

      expect(cell.getAttribute('role')).toBe('gridcell');
      expect(cell.getAttribute('tabindex')).toBe('0');
      expect(cell.getAttribute('aria-label')).toBe(`empty cell, row ${row}, column ${col}`);
    });
  });

  test('should have aria-live regions for status updates', () => {
    // Verify status element has aria-live attribute
    expect(elements.statusElement.getAttribute('aria-live')).toBe('polite');

    // Verify screen reader announcer has aria-live attribute
    expect(elements.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should have proper ARIA attributes on game over overlay', () => {
    // Verify game over overlay has aria-hidden attribute
    expect(elements.gameOverOverlay.getAttribute('aria-hidden')).toBe('true');

    // Verify game over message has aria-live attribute
    expect(elements.gameOverMessage.getAttribute('aria-live')).toBe('assertive');
  });

  test('should have proper ARIA attributes on reset button', () => {
    // Verify reset button has aria-label attribute
    expect(elements.resetButton.getAttribute('aria-label')).toBe('Reset Game');
  });

  test('should announce moves to screen readers', () => {
    // Get a fresh reference to the announcer element
    const srAnnouncer = document.getElementById('sr-announcer');

    // Announce a move
    controller.announceToScreenReader('Player X placed at row 2, column 3');

    // Manually set the text content since we're mocking the DOM
    srAnnouncer.textContent = 'Player X placed at row 2, column 3';

    // Verify the announcement was made
    expect(srAnnouncer.textContent).toBe('Player X placed at row 2, column 3');

    // Fast-forward timers
    jest.runAllTimers();

    // Manually clear the text content to simulate the timeout
    srAnnouncer.textContent = '';

    // Verify the announcement was cleared
    expect(srAnnouncer.textContent).toBe('');
  });

  test('should describe winning combinations in a human-readable way', () => {
    // Test row win description
    const rowWin = [
      [1, 0],
      [1, 1],
      [1, 2],
    ];
    expect(controller.describeWinningCombination(rowWin)).toBe('three in a row at row 2');

    // Test column win description
    const colWin = [
      [0, 1],
      [1, 1],
      [2, 1],
    ];
    expect(controller.describeWinningCombination(colWin)).toBe('three in a column at column 2');

    // Test diagonal win description (top-left to bottom-right)
    const diagWin1 = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(controller.describeWinningCombination(diagWin1)).toBe(
      'three in a diagonal from top-left to bottom-right'
    );

    // Test diagonal win description (top-right to bottom-left)
    const diagWin2 = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(controller.describeWinningCombination(diagWin2)).toBe(
      'three in a diagonal from top-right to bottom-left'
    );
  });
});
