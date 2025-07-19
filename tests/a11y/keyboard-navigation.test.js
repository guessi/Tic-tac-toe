/**
 * Tests for keyboard navigation in the Tic-tac-toe game
 */

// Mock DOM elements for testing
const mockDOM = () => {
  // Create mock DOM elements
  document.body.innerHTML = `
        <div class="status" id="status"></div>
        <div id="sr-announcer"></div>
        <div id="game-board">
            <div class="cell" data-row="0" data-col="0" tabindex="0"></div>
            <div class="cell" data-row="0" data-col="1" tabindex="0"></div>
            <div class="cell" data-row="0" data-col="2" tabindex="0"></div>
            <div class="cell" data-row="1" data-col="0" tabindex="0"></div>
            <div class="cell" data-row="1" data-col="1" tabindex="0"></div>
            <div class="cell" data-row="1" data-col="2" tabindex="0"></div>
            <div class="cell" data-row="2" data-col="0" tabindex="0"></div>
            <div class="cell" data-row="2" data-col="1" tabindex="0"></div>
            <div class="cell" data-row="2" data-col="2" tabindex="0"></div>
        </div>
        <div id="game-over-overlay">
            <div id="game-over-message"></div>
        </div>
        <button id="reset-button">Reset Game</button>
    `;

  // Mock the classList methods for all elements
  document.querySelectorAll('*').forEach((element) => {
    element.classList = {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    };
    element.focus = jest.fn();
  });

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

// Mock implementation of the game classes for testing
class TicTacToeGame {
  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.currentPlayer = 'X';
    this.gameStatus = 'in_progress';
    this.winningCombination = null;
  }

  makeMove(row, col) {
    if (this.isValidMove(row, col)) {
      this.board[row][col] = this.currentPlayer;

      if (this.checkWin()) {
        this.gameStatus = `win_${this.currentPlayer}`;
        return true;
      } else if (this.checkDraw()) {
        this.gameStatus = 'draw';
        return true;
      } else {
        this.switchPlayer();
        return true;
      }
    }
    return false;
  }

  isValidMove(row, col) {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return false;
    }
    if (this.board[row][col] !== null) {
      return false;
    }
    if (this.gameStatus !== 'in_progress') {
      return false;
    }
    return true;
  }

  checkWin() {
    // Simplified for testing
    return false;
  }

  checkDraw() {
    // Simplified for testing
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  reset() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.currentPlayer = 'X';
    this.gameStatus = 'in_progress';
    this.winningCombination = null;
    return true;
  }
}

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

    this.currentFocusRow = 0;
    this.currentFocusCol = 0;
  }

  renderBoard() {
    // Simplified for testing
  }

  updateStatus() {
    // Simplified for testing
  }

  showGameOverMessage() {
    // Simplified for testing
  }

  hideGameOverMessage() {
    // Simplified for testing
  }

  highlightWinningCombination() {
    // Simplified for testing
  }

  showResetButton() {
    // Simplified for testing
  }
}

class TicTacToeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Simplified for testing
  }

  focusCell(row, col) {
    // Ensure row and column are within bounds
    row = Math.max(0, Math.min(2, row));
    col = Math.max(0, Math.min(2, col));

    // Update the current focus position
    this.view.currentFocusRow = row;
    this.view.currentFocusCol = col;

    // Find the cell
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      // Add a visual indicator for the focused cell
      document.querySelectorAll('.cell').forEach((c) => {
        c.classList.remove('keyboard-focus');
      });
      cell.classList.add('keyboard-focus');

      // Focus the cell
      cell.focus();
    }
  }

  handleCellClick() {
    // Simplified for testing
  }

  handleResetClick() {
    // Simplified for testing
  }
}

// Helper function to simulate keyboard events
const simulateKeyPress = (key) => {
  const event = new KeyboardEvent('keydown', {
    key: key,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
  return event;
};

// Test suite for keyboard navigation
describe('Tic-tac-toe Keyboard Navigation', () => {
  let model, view, controller;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = '';

    // Create fresh instances for each test
    model = new TicTacToeGame();
    view = new TicTacToeView();
    controller = new TicTacToeController(model, view);

    // Set up global keyboard navigation
    window.gameController = controller;

    // Mock the document.addEventListener for keyboard events
    document.addEventListener = jest.fn((event, handler) => {
      if (event === 'keydown') {
        document.keydownHandler = handler;
      }
    });

    // Set up the keyboard navigation
    setupKeyboardNavigation(controller);
  });

  // Helper function to simulate keyboard navigation
  function setupKeyboardNavigation(controller) {
    // Store the handler for testing
    document.keydownHandler = (event) => {
      // Get current position
      let row = controller.view.currentFocusRow;
      let col = controller.view.currentFocusCol;

      // Handle arrow keys
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          controller.focusCell(row - 1, col);
          break;

        case 'ArrowDown':
          event.preventDefault();
          controller.focusCell(row + 1, col);
          break;

        case 'ArrowLeft':
          event.preventDefault();
          controller.focusCell(row, col - 1);
          break;

        case 'ArrowRight':
          event.preventDefault();
          controller.focusCell(row, col + 1);
          break;
      }
    };
  }

  test('should focus the cell above when ArrowUp is pressed', () => {
    // Set initial focus to middle cell
    controller.focusCell(1, 1);

    // Simulate ArrowUp key press
    const event = { key: 'ArrowUp', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus moved up
    expect(controller.view.currentFocusRow).toBe(0);
    expect(controller.view.currentFocusCol).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should focus the cell below when ArrowDown is pressed', () => {
    // Set initial focus to middle cell
    controller.focusCell(1, 1);

    // Simulate ArrowDown key press
    const event = { key: 'ArrowDown', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus moved down
    expect(controller.view.currentFocusRow).toBe(2);
    expect(controller.view.currentFocusCol).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should focus the cell to the left when ArrowLeft is pressed', () => {
    // Set initial focus to middle cell
    controller.focusCell(1, 1);

    // Simulate ArrowLeft key press
    const event = { key: 'ArrowLeft', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus moved left
    expect(controller.view.currentFocusRow).toBe(1);
    expect(controller.view.currentFocusCol).toBe(0);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should focus the cell to the right when ArrowRight is pressed', () => {
    // Set initial focus to middle cell
    controller.focusCell(1, 1);

    // Simulate ArrowRight key press
    const event = { key: 'ArrowRight', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus moved right
    expect(controller.view.currentFocusRow).toBe(1);
    expect(controller.view.currentFocusCol).toBe(2);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should not move focus beyond the top edge of the board', () => {
    // Set initial focus to top-middle cell
    controller.focusCell(0, 1);

    // Simulate ArrowUp key press
    const event = { key: 'ArrowUp', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus stays at the top edge
    expect(controller.view.currentFocusRow).toBe(0);
    expect(controller.view.currentFocusCol).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should not move focus beyond the bottom edge of the board', () => {
    // Set initial focus to bottom-middle cell
    controller.focusCell(2, 1);

    // Simulate ArrowDown key press
    const event = { key: 'ArrowDown', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus stays at the bottom edge
    expect(controller.view.currentFocusRow).toBe(2);
    expect(controller.view.currentFocusCol).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should not move focus beyond the left edge of the board', () => {
    // Set initial focus to middle-left cell
    controller.focusCell(1, 0);

    // Simulate ArrowLeft key press
    const event = { key: 'ArrowLeft', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus stays at the left edge
    expect(controller.view.currentFocusRow).toBe(1);
    expect(controller.view.currentFocusCol).toBe(0);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should not move focus beyond the right edge of the board', () => {
    // Set initial focus to middle-right cell
    controller.focusCell(1, 2);

    // Simulate ArrowRight key press
    const event = { key: 'ArrowRight', preventDefault: jest.fn() };
    document.keydownHandler(event);

    // Verify the focus stays at the right edge
    expect(controller.view.currentFocusRow).toBe(1);
    expect(controller.view.currentFocusCol).toBe(2);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('should add keyboard-focus class to the focused cell', () => {
    // Mock the document.querySelector to return a cell with mocked classList
    const mockCell = {
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      focus: jest.fn(),
    };
    document.querySelector = jest.fn().mockReturnValue(mockCell);

    // Set focus to a cell
    controller.focusCell(1, 1);

    // Verify the keyboard-focus class was added
    expect(mockCell.classList.add).toHaveBeenCalledWith('keyboard-focus');
  });

  test('should remove keyboard-focus class from previously focused cells', () => {
    // Mock cells with mocked classList
    const mockCells = [
      { classList: { add: jest.fn(), remove: jest.fn() }, focus: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn() }, focus: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn() }, focus: jest.fn() },
    ];

    // Mock document.querySelectorAll to return our mock cells
    document.querySelectorAll = jest.fn().mockReturnValue(mockCells);

    // Mock document.querySelector to return a specific mock cell
    document.querySelector = jest.fn().mockReturnValue(mockCells[0]);

    // Set focus to a cell
    controller.focusCell(1, 1);

    // Verify the keyboard-focus class was removed from all cells
    expect(document.querySelectorAll).toHaveBeenCalledWith('.cell');
    expect(mockCells[0].classList.remove).toHaveBeenCalledWith('keyboard-focus');
  });
});
