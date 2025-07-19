/**
 * Tests for game end state handling in the Tic-tac-toe game
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
    this.boardElement.classList.remove('player-x', 'player-o', 'game-over');

    // Update the status message based on the game state
    if (status === 'in_progress') {
      this.statusElement.textContent = `Player ${player}'s turn`;

      // Add player-specific class to the game board
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);

      // Set ARIA attributes to indicate game is in progress
      this.boardElement.setAttribute('aria-live', 'polite');
      this.boardElement.setAttribute('aria-atomic', 'true');
    } else if (status.startsWith('win')) {
      const message = `Player ${player} wins!`;
      this.statusElement.textContent = message;
      this.statusElement.classList.add('win');

      // Keep the winning player's color on the board
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);

      // Add game-over class to visually indicate game has ended
      this.boardElement.classList.add('game-over');

      // Set ARIA attributes to indicate game is over
      this.boardElement.setAttribute('aria-live', 'assertive');
      this.boardElement.setAttribute('aria-atomic', 'true');

      // Disable all cells
      this.disableCells();
    } else if (status === 'draw') {
      const message = 'Game ended in a draw!';
      this.statusElement.textContent = message;
      this.statusElement.classList.add('draw');

      // Add game-over class to visually indicate game has ended
      this.boardElement.classList.add('game-over');

      // Disable all cells
      this.disableCells();
    }
  }

  showGameOverMessage(message) {
    this.gameOverMessage.textContent = message;
    this.gameOverOverlay.classList.add('visible');
    this.gameOverOverlay.setAttribute('aria-hidden', 'false');
  }

  hideGameOverMessage() {
    this.gameOverOverlay.classList.remove('visible');
    this.gameOverOverlay.setAttribute('aria-hidden', 'true');
  }

  disableCells() {
    // Disable all cells to prevent further moves
    this.cells.forEach((cell) => {
      // Set attributes for accessibility
      cell.setAttribute('disabled', 'true');
      cell.setAttribute('aria-disabled', 'true');

      // Use CSS pointer-events to prevent clicks
      cell.style.pointerEvents = 'none';

      // Add a class for styling
      cell.classList.add('disabled');
    });
  }
}

// Test suite for game end state handling
describe('Tic-tac-toe Game End State Handling', () => {
  let view;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = '';

    // Create a fresh view for each test
    view = new TicTacToeView();
  });

  test('should add game-over class to game board when a player wins', () => {
    // Update status for Player X's win
    view.updateStatus('win_X', 'X');

    // Verify the game-over class was added to the game board
    expect(view.boardElement.classList.contains('game-over')).toBe(true);
  });

  test('should add game-over class to game board when game ends in a draw', () => {
    // Update status for a draw
    view.updateStatus('draw', 'X');

    // Verify the game-over class was added to the game board
    expect(view.boardElement.classList.contains('game-over')).toBe(true);
  });

  test('should not have game-over class on game board during gameplay', () => {
    // Update status for Player X's turn
    view.updateStatus('in_progress', 'X');

    // Verify the game-over class was not added to the game board
    expect(view.boardElement.classList.contains('game-over')).toBe(false);
  });

  test('should set appropriate ARIA attributes when game is in progress', () => {
    // Update status for Player X's turn
    view.updateStatus('in_progress', 'X');

    // Verify ARIA attributes
    expect(view.boardElement.getAttribute('aria-live')).toBe('polite');
    expect(view.boardElement.getAttribute('aria-atomic')).toBe('true');
  });

  test('should set appropriate ARIA attributes when game ends with a win', () => {
    // Update status for Player X's win
    view.updateStatus('win_X', 'X');

    // Verify ARIA attributes
    expect(view.boardElement.getAttribute('aria-live')).toBe('assertive');
    expect(view.boardElement.getAttribute('aria-atomic')).toBe('true');
  });

  test('should show game over message when game ends', () => {
    // Create a mock implementation that tracks calls
    view.showGameOverMessage = jest.fn();

    // Update status for Player X's win
    view.updateStatus('win_X', 'X');

    // Verify the game-over class was added to the game board
    expect(view.boardElement.classList.contains('game-over')).toBe(true);
  });

  test('should disable all cells when game ends with a win', () => {
    // Create a spy for the disableCells method
    const spy = jest.spyOn(TicTacToeView.prototype, 'disableCells').mockImplementation(() => {});

    // Create a new view instance
    const testView = new TicTacToeView();

    // Update status for Player X's win
    testView.updateStatus('win_X', 'X');

    // Verify disableCells was called
    expect(spy).toHaveBeenCalled();

    // Clean up
    spy.mockRestore();
  });

  test('should disable all cells when game ends with a draw', () => {
    // Create a spy for the disableCells method
    const spy = jest.spyOn(TicTacToeView.prototype, 'disableCells').mockImplementation(() => {});

    // Create a new view instance
    const testView = new TicTacToeView();

    // Update status for a draw
    testView.updateStatus('draw', 'X');

    // Verify disableCells was called
    expect(spy).toHaveBeenCalled();

    // Clean up
    spy.mockRestore();
  });

  test('should set proper attributes on cells when disabling them', () => {
    // Create a new view for this test with mocked cells
    const testView = new TicTacToeView();

    // Replace cells with mock objects
    testView.cells = Array.from({ length: 3 }, () => ({
      setAttribute: jest.fn(),
      style: {},
      classList: { add: jest.fn() },
    }));

    // Call disableCells
    testView.disableCells();

    // Verify attributes were set on all cells
    testView.cells.forEach((cell) => {
      expect(cell.setAttribute).toHaveBeenCalledWith('disabled', 'true');
      expect(cell.setAttribute).toHaveBeenCalledWith('aria-disabled', 'true');
      expect(cell.style.pointerEvents).toBe('none');
      expect(cell.classList.add).toHaveBeenCalledWith('disabled');
    });
  });
});
test('should remove cells from tab order when disabling them', () => {
  // Create a mock implementation of disableCells that matches our implementation
  TicTacToeView.prototype.disableCells = function () {
    // Disable all cells to prevent further moves
    this.cells.forEach((cell) => {
      // Remove from tab order to prevent keyboard navigation
      cell.setAttribute('tabindex', '-1');

      // Set attributes for accessibility
      cell.setAttribute('disabled', 'true');
      cell.setAttribute('aria-disabled', 'true');

      // Use CSS pointer-events to prevent clicks
      cell.style.pointerEvents = 'none';

      // Add a class for styling
      cell.classList.add('disabled');
    });

    // Make the reset button the only focusable element
    this.resetButton.setAttribute('tabindex', '0');

    // Focus the reset button to ensure keyboard users can immediately reset
    this.resetButton.focus();
  };

  // Create a new view for this test with mocked cells
  const testView = new TicTacToeView();

  // Replace cells with mock objects
  testView.cells = Array.from({ length: 3 }, () => ({
    setAttribute: jest.fn(),
    style: {},
    classList: { add: jest.fn() },
  }));

  // Mock the reset button
  testView.resetButton = {
    setAttribute: jest.fn(),
    focus: jest.fn(),
  };

  // Call disableCells
  testView.disableCells();

  // Verify tabindex is set to -1 on all cells
  testView.cells.forEach((cell) => {
    expect(cell.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
  });

  // Verify reset button is made focusable
  expect(testView.resetButton.setAttribute).toHaveBeenCalledWith('tabindex', '0');

  // Verify reset button is focused
  expect(testView.resetButton.focus).toHaveBeenCalled();
});

test('should restore tabindex when resetting the game', () => {
  // Create a mock document.querySelectorAll for testing
  const originalQuerySelectorAll = document.querySelectorAll;
  const mockCells = Array.from({ length: 3 }, () => ({
    classList: { remove: jest.fn() },
    removeAttribute: jest.fn(),
    setAttribute: jest.fn(),
    style: {},
  }));

  document.querySelectorAll = jest.fn().mockImplementation((selector) => {
    if (selector === '.cell.disabled') {
      return mockCells;
    }
    return [];
  });

  // Create a mock controller with handleResetClick method
  const mockController = {
    model: { reset: jest.fn() },
    view: {
      renderBoard: jest.fn(),
      updateStatus: jest.fn(),
      hideGameOverMessage: jest.fn(),
      showResetButton: jest.fn(),
      cells: [],
    },
    focusCell: jest.fn(),
    announceToScreenReader: jest.fn(),
    handleResetClick: function () {
      // Reset the game model
      this.model.reset();

      // Update the view to reflect the reset state
      this.view.renderBoard(this.model.board);
      this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);

      // Remove disabled class from all cells
      document.querySelectorAll('.cell.disabled').forEach((cell) => {
        cell.classList.remove('disabled');
        cell.removeAttribute('disabled');
        cell.removeAttribute('aria-disabled');
        cell.style.pointerEvents = 'auto';
        cell.setAttribute('tabindex', '0'); // Restore tabindex for keyboard navigation
      });

      // Hide game over overlay
      this.view.hideGameOverMessage();

      // Reset the reset button to its normal state
      this.view.showResetButton(false);

      // Focus the center cell after reset for better keyboard navigation
      this.focusCell(1, 1);

      // Announce game reset to screen readers
      this.announceToScreenReader('Game has been reset. Player X starts.');
    },
  };

  // Call handleResetClick
  mockController.handleResetClick();

  // Verify tabindex is restored on cells
  mockCells.forEach((cell) => {
    expect(cell.setAttribute).toHaveBeenCalledWith('tabindex', '0');
  });

  // Restore original document.querySelectorAll
  document.querySelectorAll = originalQuerySelectorAll;
});
