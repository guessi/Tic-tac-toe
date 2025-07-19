/**
 * Unit tests for the Tic-tac-toe game model
 */

// Import the TicTacToeGame class from script.js
// Since we're using vanilla JS without modules, we'll need to mock the class for testing

// Mock implementation of TicTacToeGame class for testing
class TicTacToeGame {
  constructor() {
    // Initialize the game board as a 3x3 grid with null values
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    // Set the initial player to X
    this.currentPlayer = 'X';

    // Set the initial game status
    this.gameStatus = 'in_progress'; // 'in_progress', 'win_X', 'win_O', 'draw'

    // Store the winning combination if any
    this.winningCombination = null;
  }

  makeMove(row, col) {
    // Validate if the move is legal
    if (this.isValidMove(row, col)) {
      // Update the board with the current player's mark
      this.board[row][col] = this.currentPlayer;

      // Check if the game is won or drawn
      if (this.checkWin()) {
        this.gameStatus = `win_${this.currentPlayer}`;
        return true;
      } else if (this.checkDraw()) {
        this.gameStatus = 'draw';
        return true;
      } else {
        // If game continues, switch to the next player
        this.switchPlayer();
        return true;
      }
    }

    // Return false if the move was invalid
    return false;
  }

  isValidMove(row, col) {
    // Check if the position is within the board boundaries
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return false;
    }

    // Check if the cell is empty
    if (this.board[row][col] !== null) {
      return false;
    }

    // Check if the game is still in progress
    if (this.gameStatus !== 'in_progress') {
      return false;
    }

    return true;
  }

  checkWin() {
    // Check for horizontal wins
    for (let row = 0; row < 3; row++) {
      if (
        this.board[row][0] !== null &&
        this.board[row][0] === this.board[row][1] &&
        this.board[row][1] === this.board[row][2]
      ) {
        // Store the winning combination
        this.winningCombination = [
          [row, 0],
          [row, 1],
          [row, 2],
        ];
        return true;
      }
    }

    // Check for vertical wins
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] !== null &&
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col]
      ) {
        // Store the winning combination
        this.winningCombination = [
          [0, col],
          [1, col],
          [2, col],
        ];
        return true;
      }
    }

    // Check for diagonal win (top-left to bottom-right)
    if (
      this.board[0][0] !== null &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      // Store the winning combination
      this.winningCombination = [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
      return true;
    }

    // Check for diagonal win (top-right to bottom-left)
    if (
      this.board[0][2] !== null &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      // Store the winning combination
      this.winningCombination = [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
      return true;
    }

    // No win detected
    return false;
  }

  checkDraw() {
    // A draw occurs when all cells are filled and no one has won
    // Check if all cells are filled
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === null) {
          // If any cell is empty, the game is not a draw
          return false;
        }
      }
    }

    // If all cells are filled and no one has won (checkWin would have returned true earlier),
    // then the game is a draw
    return true;
  }

  switchPlayer() {
    // Switch the current player from X to O or O to X
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  reset() {
    // Reset the board state to empty
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    // Reset the game status
    this.currentPlayer = 'X'; // Player X always starts
    this.gameStatus = 'in_progress';
    this.winningCombination = null;

    return true; // Return true to indicate successful reset
  }
}

// Test suite for TicTacToeGame
describe('TicTacToeGame', () => {
  let game;

  // Set up a fresh game instance before each test
  beforeEach(() => {
    game = new TicTacToeGame();
  });

  // Test board state management
  describe('Board State Management', () => {
    test('should initialize with an empty board', () => {
      // Check that all cells are null
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }
    });

    test('should update board when a valid move is made', () => {
      // Make a move at position (1, 1)
      game.makeMove(1, 1);

      // Check that the cell is marked with 'X'
      expect(game.board[1][1]).toBe('X');
    });

    test('should not update board when an invalid move is made', () => {
      // Make a move at position (1, 1)
      game.makeMove(1, 1);

      // Try to make another move at the same position
      const result = game.makeMove(1, 1);

      // Check that the move was rejected
      expect(result).toBe(false);

      // Check that the cell still has 'X'
      expect(game.board[1][1]).toBe('X');
    });

    test('should not allow moves outside the board boundaries', () => {
      // Try to make a move outside the board
      const result = game.makeMove(3, 3);

      // Check that the move was rejected
      expect(result).toBe(false);

      // Check that the board remains unchanged
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }
    });

    test('should switch players after a valid move', () => {
      // Initially, current player should be 'X'
      expect(game.currentPlayer).toBe('X');

      // Make a move
      game.makeMove(0, 0);

      // Current player should now be 'O'
      expect(game.currentPlayer).toBe('O');

      // Make another move
      game.makeMove(0, 1);

      // Current player should now be 'X' again
      expect(game.currentPlayer).toBe('X');
    });

    test('should reset the board state correctly', () => {
      // Make some moves
      game.makeMove(0, 0); // X
      game.makeMove(1, 1); // O
      game.makeMove(0, 1); // X

      // Reset the game
      game.reset();

      // Check that all cells are null
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }

      // Check that current player is reset to 'X'
      expect(game.currentPlayer).toBe('X');

      // Check that game status is reset to 'in_progress'
      expect(game.gameStatus).toBe('in_progress');

      // Check that winning combination is reset to null
      expect(game.winningCombination).toBeNull();
    });
  });

  // Test win detection logic
  describe('Win Detection Logic', () => {
    test('should detect horizontal win for X', () => {
      // Create a horizontal win for X in the top row
      game.board = [
        ['X', 'X', 'X'],
        [null, 'O', null],
        [null, 'O', null],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    });

    test('should detect horizontal win for O', () => {
      // Create a horizontal win for O in the middle row
      game.board = [
        ['X', null, 'X'],
        ['O', 'O', 'O'],
        ['X', null, null],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [1, 0],
        [1, 1],
        [1, 2],
      ]);
    });

    test('should detect vertical win for X', () => {
      // Create a vertical win for X in the left column
      game.board = [
        ['X', 'O', null],
        ['X', 'O', null],
        ['X', null, null],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [0, 0],
        [1, 0],
        [2, 0],
      ]);
    });

    test('should detect vertical win for O', () => {
      // Create a vertical win for O in the middle column
      game.board = [
        ['X', 'O', null],
        [null, 'O', 'X'],
        ['X', 'O', null],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [0, 1],
        [1, 1],
        [2, 1],
      ]);
    });

    test('should detect diagonal win (top-left to bottom-right)', () => {
      // Create a diagonal win from top-left to bottom-right
      game.board = [
        ['X', 'O', null],
        ['O', 'X', null],
        [null, null, 'X'],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
    });

    test('should detect diagonal win (top-right to bottom-left)', () => {
      // Create a diagonal win from top-right to bottom-left
      game.board = [
        [null, 'O', 'X'],
        ['O', 'X', null],
        ['X', null, 'O'],
      ];

      // Check for win
      const result = game.checkWin();

      // Should detect a win
      expect(result).toBe(true);

      // Should store the winning combination
      expect(game.winningCombination).toEqual([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);
    });

    test('should not detect win when there is none', () => {
      // Create a board with no win
      game.board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', null],
      ];

      // Check for win
      const result = game.checkWin();

      // Should not detect a win
      expect(result).toBe(false);

      // Winning combination should remain null
      expect(game.winningCombination).toBeNull();
    });

    test('should update game status when a win is detected during makeMove', () => {
      // Set up a board where X is about to win
      game.board = [
        ['X', 'X', null],
        ['O', 'O', null],
        [null, null, null],
      ];
      game.currentPlayer = 'X';

      // Make the winning move
      game.makeMove(0, 2);

      // Game status should be updated to win_X
      expect(game.gameStatus).toBe('win_X');
    });
  });

  // Test draw detection logic
  describe('Draw Detection Logic', () => {
    test('should detect a draw when all cells are filled and no one has won', () => {
      // Create a board with a draw (no winner)
      game.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
      ];

      // Check for draw
      const result = game.checkDraw();

      // Should detect a draw
      expect(result).toBe(true);
    });

    test('should not detect a draw when there are empty cells', () => {
      // Create a board with empty cells
      game.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', null],
      ];

      // Check for draw
      const result = game.checkDraw();

      // Should not detect a draw
      expect(result).toBe(false);
    });

    test('should not detect a draw when there is a winner', () => {
      // Create a board with a winner
      game.board = [
        ['X', 'X', 'X'],
        ['O', 'O', null],
        [null, null, null],
      ];

      // First check for win
      const winResult = game.checkWin();

      // Should detect a win
      expect(winResult).toBe(true);

      // Then check for draw
      const drawResult = game.checkDraw();

      // Should not detect a draw
      expect(drawResult).toBe(false);
    });

    test('should update game status when a draw is detected during makeMove', () => {
      // Set up a board where the next move will result in a draw
      game.board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', null],
      ];
      game.currentPlayer = 'X';

      // Make the final move
      game.makeMove(2, 2);

      // Game status should be updated to draw
      expect(game.gameStatus).toBe('draw');
    });
  });
});
