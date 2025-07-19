/**
 * Integration tests for the Tic-tac-toe game
 *
 * These tests verify the interaction between the game model, view, and controller
 * by simulating complete game flows.
 */

// Mock DOM elements for testing
const mockDOM = () => {
  // Create mock DOM elements
  document.body.innerHTML = `
        <div class="status" id="status"></div>
        <div id="sr-announcer"></div>
        <div id="game-board">
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

  // Mock the classList methods for all elements
  document.querySelectorAll('*').forEach((element) => {
    element.classList = {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    };
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
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        this.board[row][0] !== null &&
        this.board[row][0] === this.board[row][1] &&
        this.board[row][1] === this.board[row][2]
      ) {
        this.winningCombination = [
          [row, 0],
          [row, 1],
          [row, 2],
        ];
        return true;
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] !== null &&
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col]
      ) {
        this.winningCombination = [
          [0, col],
          [1, col],
          [2, col],
        ];
        return true;
      }
    }

    // Check diagonals
    if (
      this.board[0][0] !== null &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      this.winningCombination = [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
      return true;
    }

    if (
      this.board[0][2] !== null &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      this.winningCombination = [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
      return true;
    }

    return false;
  }

  checkDraw() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === null) {
          return false;
        }
      }
    }
    return true;
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

  renderBoard(board) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        if (cell) {
          // Clear existing classes
          cell.classList.remove('x', 'o');

          // Update cell content and classes
          if (board[row][col] === 'X') {
            cell.classList.add('x');
            cell.textContent = 'X';
          } else if (board[row][col] === 'O') {
            cell.classList.add('o');
            cell.textContent = 'O';
          } else {
            cell.textContent = '';
          }
        }
      }
    }
  }

  updateStatus(status, player) {
    this.statusElement.classList.remove('win', 'draw');

    if (status === 'in_progress') {
      this.statusElement.textContent = `Player ${player}'s turn`;
      this.hideGameOverMessage();
    } else if (status.startsWith('win')) {
      const message = `Player ${player} wins!`;
      this.statusElement.textContent = message;
      this.statusElement.classList.add('win');
      this.showGameOverMessage(message);
    } else if (status === 'draw') {
      const message = 'Game ended in a draw!';
      this.statusElement.textContent = message;
      this.statusElement.classList.add('draw');
      this.showGameOverMessage(message);
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

  highlightWinningCombination(combination) {
    const highlightedCells = document.querySelectorAll('.cell.highlight');
    if (highlightedCells) {
      highlightedCells.forEach((cell) => {
        if (cell) {
          cell.classList.remove('highlight');
          cell.removeAttribute('aria-selected');
        }
      });
    }

    if (combination && combination.length) {
      combination.forEach(([row, col]) => {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
          cell.classList.add('highlight');
          cell.setAttribute('aria-selected', 'true');
        }
      });
    }
  }

  showResetButton(gameOver = false) {
    if (gameOver) {
      this.resetButton.classList.add('game-over');
    } else {
      this.resetButton.classList.remove('game-over');
    }
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
    // Mock event listeners for testing
    this.view.cells.forEach((cell) => {
      cell.addEventListener = jest.fn((event, callback) => {
        cell.clickHandler = callback;
      });
    });

    this.view.resetButton.addEventListener = jest.fn((event, callback) => {
      this.view.resetButton.clickHandler = callback;
    });

    // Initial render
    this.view.renderBoard(this.model.board);
    this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);
  }

  handleCellClick(row, col) {
    if (this.model.gameStatus !== 'in_progress') {
      return;
    }

    if (this.model.board[row][col] !== null) {
      return;
    }

    if (this.model.makeMove(row, col)) {
      this.view.renderBoard(this.model.board);

      if (this.model.gameStatus !== 'in_progress') {
        this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);

        if (this.model.winningCombination) {
          this.view.highlightWinningCombination(this.model.winningCombination);
        }

        this.view.showResetButton(true);
      } else {
        this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);
      }
    }
  }

  handleResetClick() {
    this.model.reset();
    this.view.renderBoard(this.model.board);
    this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);
    this.view.highlightWinningCombination(null);
    this.view.hideGameOverMessage();
    this.view.showResetButton(false);
  }

  focusCell(row, col) {
    row = Math.max(0, Math.min(2, row));
    col = Math.max(0, Math.min(2, col));

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.focus();
      this.view.currentFocusRow = row;
      this.view.currentFocusCol = col;
    }
  }
}

// Helper function to simulate a game
const simulateGame = (controller, moves) => {
  for (const [row, col] of moves) {
    controller.handleCellClick(row, col);
  }
};

// Test suite for integration tests
describe('Tic-tac-toe Game Integration', () => {
  let model, view, controller;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = '';

    // Create fresh instances for each test
    model = new TicTacToeGame();
    view = new TicTacToeView();
    controller = new TicTacToeController(model, view);

    // Spy on view methods to verify they're called
    jest.spyOn(view, 'renderBoard');
    jest.spyOn(view, 'updateStatus');
    jest.spyOn(view, 'highlightWinningCombination');
    jest.spyOn(view, 'showGameOverMessage');
    jest.spyOn(view, 'hideGameOverMessage');
    jest.spyOn(view, 'showResetButton');
  });

  // Test game flow from start to win
  describe('Game Flow - Win Scenario', () => {
    test('should correctly handle a game flow resulting in X winning', () => {
      // Simulate a game where X wins with diagonal
      // X | O | X
      // O | X | O
      // - | - | X
      const moves = [
        [0, 0], // X plays top-left
        [0, 1], // O plays top-middle
        [1, 1], // X plays center
        [1, 0], // O plays middle-left
        [2, 2], // X plays bottom-right (winning move - diagonal win)
      ];

      // Execute the moves
      simulateGame(controller, moves);

      // Verify the final state
      expect(model.gameStatus).toBe('win_X');
      expect(model.winningCombination).toEqual([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalledTimes(moves.length);
      expect(view.updateStatus).toHaveBeenCalledWith('win_X', 'X');
      expect(view.highlightWinningCombination).toHaveBeenCalledWith(model.winningCombination);
      expect(view.showGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(true);
    });

    test('should correctly handle a game flow resulting in O winning', () => {
      // Simulate a game where O wins
      // X | X | O
      // X | O | -
      // O | - | -
      const moves = [
        [0, 0], // X plays top-left
        [0, 2], // O plays top-right
        [1, 0], // X plays middle-left
        [1, 1], // O plays center
        [0, 1], // X plays top-middle
        [2, 0], // O plays bottom-left (winning move)
      ];

      // Execute the moves
      simulateGame(controller, moves);

      // Verify the final state
      expect(model.gameStatus).toBe('win_O');
      expect(model.winningCombination).toEqual([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalledTimes(moves.length);
      expect(view.updateStatus).toHaveBeenCalledWith('win_O', 'O');
      expect(view.highlightWinningCombination).toHaveBeenCalledWith(model.winningCombination);
      expect(view.showGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(true);
    });

    test('should prevent further moves after a win', () => {
      // Simulate a game where X wins
      const moves = [
        [0, 0], // X plays top-left
        [1, 0], // O plays middle-left
        [0, 1], // X plays top-middle
        [1, 1], // O plays center
        [0, 2], // X plays top-right (winning move)
      ];

      // Execute the moves
      simulateGame(controller, moves);

      // Verify win state
      expect(model.gameStatus).toBe('win_X');

      // Try to make another move
      controller.handleCellClick(2, 2);

      // Verify the board hasn't changed
      expect(model.board[2][2]).toBeNull();

      // Verify view wasn't updated again
      expect(view.renderBoard).toHaveBeenCalledTimes(moves.length);
    });
  });

  // Test game flow from start to draw
  describe('Game Flow - Draw Scenario', () => {
    test('should correctly handle a game flow resulting in a draw', () => {
      // Create a board state that will result in a draw
      model.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', null],
      ];
      model.currentPlayer = 'X';

      // Update the view to match the current state
      controller.view.renderBoard(model.board);

      // Make the final move that causes a draw
      controller.handleCellClick(2, 2);

      // Verify the final state
      expect(model.gameStatus).toBe('draw');
      expect(model.winningCombination).toBeNull();

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalled();
      expect(view.updateStatus).toHaveBeenCalledWith('draw', 'X');
      expect(view.showGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(true);
    });

    test('should prevent further moves after a draw', () => {
      // First fill the board to create a draw
      model.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
      ];
      model.gameStatus = 'draw';

      // Update the view
      controller.view.renderBoard(model.board);
      controller.view.updateStatus(model.gameStatus, model.currentPlayer);

      // Reset the spy counts
      view.renderBoard.mockClear();

      // Try to make another move (should be ignored)
      controller.handleCellClick(1, 1);

      // Verify the board hasn't changed
      expect(model.board[1][1]).toBe('O');

      // Verify view wasn't updated
      expect(view.renderBoard).not.toHaveBeenCalled();
    });
  });

  // Test reset functionality
  describe('Reset Functionality', () => {
    test('should reset the game state when reset button is clicked', () => {
      // First play some moves
      const moves = [
        [0, 0], // X plays top-left
        [0, 1], // O plays top-middle
        [0, 2], // X plays top-right
        [1, 0], // O plays middle-left
        [1, 1], // X plays center
      ];

      // Execute the moves
      simulateGame(controller, moves);

      // Reset the game
      controller.handleResetClick();

      // Verify the model was reset
      expect(model.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      expect(model.currentPlayer).toBe('X');
      expect(model.gameStatus).toBe('in_progress');
      expect(model.winningCombination).toBeNull();

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalledWith(model.board);
      expect(view.updateStatus).toHaveBeenCalledWith('in_progress', 'X');
      expect(view.hideGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(false);
    });

    test('should reset the game state after a win', () => {
      // Simulate a game where X wins
      const moves = [
        [0, 0], // X plays top-left
        [1, 0], // O plays middle-left
        [0, 1], // X plays top-middle
        [1, 1], // O plays center
        [0, 2], // X plays top-right (winning move)
      ];

      // Execute the moves
      simulateGame(controller, moves);

      // Verify win state
      expect(model.gameStatus).toBe('win_X');

      // Reset the game
      controller.handleResetClick();

      // Verify the model was reset
      expect(model.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      expect(model.currentPlayer).toBe('X');
      expect(model.gameStatus).toBe('in_progress');
      expect(model.winningCombination).toBeNull();

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalledWith(model.board);
      expect(view.updateStatus).toHaveBeenCalledWith('in_progress', 'X');
      expect(view.hideGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(false);

      // Verify we can make moves again
      controller.handleCellClick(1, 1);
      expect(model.board[1][1]).toBe('X');
    });

    test('should reset the game state after a draw', () => {
      // Set up a draw state
      model.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
      ];
      model.gameStatus = 'draw';

      // Update the view
      controller.view.renderBoard(model.board);
      controller.view.updateStatus(model.gameStatus, model.currentPlayer);

      // Reset the game
      controller.handleResetClick();

      // Verify the model was reset
      expect(model.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      expect(model.currentPlayer).toBe('X');
      expect(model.gameStatus).toBe('in_progress');

      // Verify view updates
      expect(view.renderBoard).toHaveBeenCalledWith(model.board);
      expect(view.updateStatus).toHaveBeenCalledWith('in_progress', 'X');
      expect(view.hideGameOverMessage).toHaveBeenCalled();
      expect(view.showResetButton).toHaveBeenCalledWith(false);

      // Verify we can make moves again
      controller.handleCellClick(1, 1);
      expect(model.board[1][1]).toBe('X');
    });
  });
});
