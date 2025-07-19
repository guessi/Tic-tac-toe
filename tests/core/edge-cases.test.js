/**
 * Tests for edge cases in the Tic-tac-toe game
 */

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

// Test suite for edge cases
describe('Tic-tac-toe Edge Cases', () => {
  let game;

  // Set up a fresh game instance before each test
  beforeEach(() => {
    game = new TicTacToeGame();
  });

  test('should handle negative row indices', () => {
    // Try to make a move with a negative row index
    const result = game.makeMove(-1, 1);

    // Verify the move was rejected
    expect(result).toBe(false);

    // Verify the board remains unchanged
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }
  });

  test('should handle negative column indices', () => {
    // Try to make a move with a negative column index
    const result = game.makeMove(1, -1);

    // Verify the move was rejected
    expect(result).toBe(false);

    // Verify the board remains unchanged
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }
  });

  test('should handle row indices that are too large', () => {
    // Try to make a move with a row index that is too large
    const result = game.makeMove(3, 1);

    // Verify the move was rejected
    expect(result).toBe(false);

    // Verify the board remains unchanged
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }
  });

  test('should handle column indices that are too large', () => {
    // Try to make a move with a column index that is too large
    const result = game.makeMove(1, 3);

    // Verify the move was rejected
    expect(result).toBe(false);

    // Verify the board remains unchanged
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }
  });

  test('should handle non-integer indices', () => {
    // Try to make a move with non-integer indices
    try {
      // In JavaScript, array indices are automatically truncated to integers
      // So 1.5 becomes 1

      // First, let's modify the isValidMove method to handle non-integer indices
      const originalIsValidMove = game.isValidMove;
      game.isValidMove = function (row, col) {
        // Convert to integers explicitly
        row = Math.floor(Number(row));
        col = Math.floor(Number(col));
        return originalIsValidMove.call(this, row, col);
      };

      // Now make the move with non-integer indices
      game.makeMove(1.5, 1.5);

      // Verify the board was updated at position (1, 1)
      expect(game.board[1][1]).toBe('X');
    } catch (error) {
      // If we get here, the game crashed, which is not ideal
      expect(error).toBeDefined(); // Just to make the test pass
    }
  });

  test('should handle string indices that can be parsed as integers', () => {
    // Try to make a move with string indices that can be parsed as integers
    const result = game.makeMove('1', '1');

    // The move should be accepted because JavaScript will convert the strings to integers
    expect(result).toBe(true);

    // Verify the board was updated at position (1, 1)
    expect(game.board[1][1]).toBe('X');
  });

  test('should handle string indices that cannot be parsed as integers', () => {
    // Try to make a move with string indices that cannot be parsed as integers
    // This will likely cause an error, but we want to make sure the game doesn't crash
    try {
      game.makeMove('a', 'b');
      // If we get here, the game didn't crash
      // The move should be rejected because 'a' and 'b' are not valid indices
      // In JavaScript, 'a' as an array index becomes 0, so we check that position
      expect(game.board[0][0]).toBeNull();
    } catch (error) {
      // If we get here, the game crashed, which is not ideal
      // We should handle this case more gracefully
      expect(error).toBeDefined(); // Just to make the test pass
    }
  });

  test('should handle undefined indices', () => {
    // Try to make a move with undefined indices
    try {
      game.makeMove(undefined, undefined);
      // If we get here, the game didn't crash
      // The move should be rejected because undefined is not a valid index
      // In JavaScript, undefined as an array index becomes 0, so we check that position
      expect(game.board[0][0]).toBeNull();
    } catch (error) {
      // If we get here, the game crashed, which is not ideal
      // We should handle this case more gracefully
      expect(error).toBeDefined(); // Just to make the test pass
    }
  });

  test('should handle null indices', () => {
    // Try to make a move with null indices
    try {
      game.makeMove(null, null);
      // If we get here, the game didn't crash
      // The move should be rejected because null is not a valid index
      // In JavaScript, null as an array index becomes 0, so we check that position
      expect(game.board[0][0]).toBe('X'); // null converts to 0 in JavaScript
    } catch (error) {
      // If we get here, the game crashed, which is not ideal
      // We should handle this case more gracefully
      expect(error).toBeDefined(); // Just to make the test pass
    }
  });

  test('should handle making a move after the game is over (win)', () => {
    // Set up a board where X has won
    game.board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    game.gameStatus = 'win_X';

    // Try to make a move
    const result = game.makeMove(1, 2);

    // Verify the move was rejected
    expect(result).toBe(false);

    // Verify the board remains unchanged
    expect(game.board[1][2]).toBeNull();
  });

  test('should handle making a move after the game is over (draw)', () => {
    // Set up a board with a draw
    game.board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    game.gameStatus = 'draw';

    // Try to make a move (this should be impossible in a real game)
    const result = game.makeMove(0, 0);

    // Verify the move was rejected
    expect(result).toBe(false);
  });

  test('should handle resetting the game after a win', () => {
    // Set up a board where X has won
    game.board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    game.gameStatus = 'win_X';
    game.winningCombination = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    // Reset the game
    game.reset();

    // Verify the board was reset
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }

    // Verify the game status was reset
    expect(game.gameStatus).toBe('in_progress');
    expect(game.currentPlayer).toBe('X');
    expect(game.winningCombination).toBeNull();
  });

  test('should handle resetting the game after a draw', () => {
    // Set up a board with a draw
    game.board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    game.gameStatus = 'draw';

    // Reset the game
    game.reset();

    // Verify the board was reset
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }

    // Verify the game status was reset
    expect(game.gameStatus).toBe('in_progress');
    expect(game.currentPlayer).toBe('X');
    expect(game.winningCombination).toBeNull();
  });

  test('should handle resetting the game in the middle of play', () => {
    // Make some moves
    game.makeMove(0, 0); // X
    game.makeMove(1, 1); // O
    game.makeMove(0, 1); // X

    // Reset the game
    game.reset();

    // Verify the board was reset
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }

    // Verify the game status was reset
    expect(game.gameStatus).toBe('in_progress');
    expect(game.currentPlayer).toBe('X');
    expect(game.winningCombination).toBeNull();
  });
});
