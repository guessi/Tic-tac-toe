/**
 * Notification system for user feedback
 */
class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notification-container');
    this.notifications = [];
    this.nextId = 1;
  }

  /**
   * Shows a notification to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (info, warning, error, success)
   * @param {Object} options - Additional options
   * @param {number} options.duration - Duration in milliseconds (0 for persistent)
   * @param {Array} options.actions - Array of action objects with label and callback
   * @returns {number} The notification ID
   */
  show(message, type = 'info', options = {}) {
    const id = this.nextId++;
    const duration = options.duration !== undefined ? options.duration : 5000;
    const actions = options.actions || [];

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.dataset.id = id;

    // Create content
    const content = document.createElement('div');
    content.className = 'notification-content';

    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    switch (type) {
      case 'info':
        icon.textContent = 'ℹ️';
        break;
      case 'warning':
        icon.textContent = '⚠️';
        break;
      case 'error':
        icon.textContent = '❌';
        break;
      case 'success':
        icon.textContent = '✅';
        break;
    }
    content.appendChild(icon);

    // Add message
    const messageEl = document.createElement('span');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    content.appendChild(messageEl);

    notification.appendChild(content);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.textContent = '✕';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.addEventListener('click', () => this.dismiss(id));
    notification.appendChild(closeButton);

    // Add actions if provided
    if (actions.length > 0) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'notification-actions';

      actions.forEach((action, index) => {
        const button = document.createElement('button');
        button.className = `notification-action ${index === 0 ? 'primary' : ''}`;
        button.textContent = action.label;
        button.addEventListener('click', () => {
          action.callback();
          this.dismiss(id);
        });
        actionsContainer.appendChild(button);
      });

      notification.appendChild(actionsContainer);
    }

    // Add to container
    this.container.appendChild(notification);

    // Store notification data
    this.notifications.push({
      id,
      element: notification,
      timeout: duration > 0 ? setTimeout(() => this.dismiss(id), duration) : null,
    });

    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);

    return id;
  }

  /**
   * Dismisses a notification
   * @param {number} id - The notification ID
   */
  dismiss(id) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      const notification = this.notifications[index];

      // Clear timeout if exists
      if (notification.timeout) {
        clearTimeout(notification.timeout);
      }

      // Hide with animation
      notification.element.classList.remove('visible');

      // Remove after animation
      setTimeout(() => {
        if (notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
        }
        this.notifications.splice(index, 1);
      }, 300);
    }
  }

  /**
   * Dismisses all notifications
   */
  dismissAll() {
    [...this.notifications].forEach((notification) => {
      this.dismiss(notification.id);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded, initializing game components...');

  // Initialize notification system
  window.notifications = new NotificationSystem();

  // Initialize statistics first to ensure they're loaded before the game starts
  initStatistics();

  // Then initialize the game and accessibility features
  initGame();
  initAccessibilityFeatures();

  // Ensure statistics display is updated after all components are initialized
  if (window.gameController && window.gameStatistics) {
    console.log('Updating statistics display after initialization');
    window.gameController.updateStatisticsDisplay();
  }
});

/**
 * Initializes theme toggle and other accessibility features
 */
function initAccessibilityFeatures() {
  const themeToggle = document.getElementById('dark-mode-toggle');
  const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

  // Initialize theme based on localStorage
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
  if (darkModeEnabled) {
    darkModeStylesheet.removeAttribute('disabled');
    themeToggle.checked = true;
  } else {
    themeToggle.checked = false;
  }

  // Theme toggle event
  themeToggle.addEventListener('change', () => {
    const isDarkMode = themeToggle.checked;
    darkModeStylesheet.disabled = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

    const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
    const srAnnouncer = document.getElementById('sr-announcer');
    srAnnouncer.textContent = message;
    setTimeout(() => {
      srAnnouncer.textContent = '';
    }, 3000);
  });

  // Initialize collapsible instructions
  const instructionsToggle = document.getElementById('instructions-toggle');
  const instructionsContent = document.getElementById('instructions-content');

  if (instructionsToggle && instructionsContent) {
    // Set initial state (collapsed by default)
    const isExpanded = localStorage.getItem('instructionsExpanded') === 'true';

    if (isExpanded) {
      instructionsToggle.setAttribute('aria-expanded', 'true');
      instructionsContent.removeAttribute('hidden');
    }

    instructionsToggle.addEventListener('click', () => {
      const isCurrentlyExpanded = instructionsToggle.getAttribute('aria-expanded') === 'true';
      const newExpandedState = !isCurrentlyExpanded;

      instructionsToggle.setAttribute('aria-expanded', newExpandedState.toString());

      if (newExpandedState) {
        instructionsContent.removeAttribute('hidden');
      } else {
        instructionsContent.setAttribute('hidden', '');
      }

      // Save preference
      localStorage.setItem('instructionsExpanded', newExpandedState.toString());

      // Announce to screen readers
      const message = newExpandedState
        ? 'Keyboard instructions expanded'
        : 'Keyboard instructions collapsed';
      const srAnnouncer = document.getElementById('sr-announcer');
      if (srAnnouncer) {
        srAnnouncer.textContent = message;
        setTimeout(() => {
          srAnnouncer.textContent = '';
        }, 1000);
      }
    });
  }
}

/**
 * Game Model - Handles the game state and logic
 */
class TicTacToeGame {
  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.currentPlayer = 'X';
    this.gameStatus = 'in_progress'; // 'in_progress', 'win_X', 'win_O', 'draw'
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

  /**
   * Checks if the game has ended in a draw
   * @returns {boolean} True if the game is a draw
   */
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

  /**
   * Switches the current player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  /**
   * Resets the game to initial state
   * @returns {boolean} True indicating successful reset
   */
  reset() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.currentPlayer = 'X'; // Player X always starts
    this.gameStatus = 'in_progress';
    this.winningCombination = null;
    return true;
  }
}

/**
 * Game View - Handles the rendering of the game
 */
class TicTacToeView {
  constructor() {
    // DOM elements
    this.boardElement = document.getElementById('game-board');
    this.statusElement = document.getElementById('status');
    this.resetButton = document.getElementById('reset-button');
    this.cells = document.querySelectorAll('.cell');
    this.gameOverOverlay = document.getElementById('game-over-overlay');
    this.gameOverMessage = document.getElementById('game-over-message');
    this.srAnnouncer = document.getElementById('sr-announcer');

    // Keyboard navigation state
    this.currentFocusRow = 0;
    this.currentFocusCol = 0;
  }

  /**
   * Updates the UI to reflect the current board state
   * @param {Array} board - The game board array
   */
  renderBoard(board) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('x', 'o');

        const humanRow = row + 1;
        const humanCol = col + 1;

        if (board[row][col] === 'X') {
          cell.classList.add('x');
          cell.textContent = 'X';
          cell.setAttribute('aria-label', `X, row ${humanRow}, column ${humanCol}`);
        } else if (board[row][col] === 'O') {
          cell.classList.add('o');
          cell.textContent = 'O';
          cell.setAttribute('aria-label', `O, row ${humanRow}, column ${humanCol}`);
        } else {
          cell.textContent = '';
          cell.setAttribute('aria-label', `empty cell, row ${humanRow}, column ${humanCol}`);
        }
      }
    }
  }

  /**
   * Updates the game status display
   * @param {string} status - Current game status
   * @param {string} player - Current player
   */
  updateStatus(status, player) {
    this.statusElement.classList.remove('win', 'draw');
    this.boardElement.classList.remove('player-x', 'player-o', 'game-over');

    if (status === 'in_progress') {
      this.statusElement.textContent = `Player ${player}'s turn`;
      this.hideGameOverMessage();
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);
      this.boardElement.setAttribute('aria-live', 'polite');
      this.boardElement.setAttribute('aria-atomic', 'true');

      this.cells.forEach((cell) => {
        if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
          cell.removeAttribute('disabled');
          cell.removeAttribute('aria-disabled');
          cell.style.pointerEvents = 'auto';
        }
      });
    } else if (status.startsWith('win')) {
      const message = `Player ${player} wins!`;
      this.statusElement.textContent = message;
      this.statusElement.classList.add('win');
      this.showGameOverMessage(message);
      this.boardElement.classList.add(`player-${player.toLowerCase()}`);
      this.boardElement.classList.add('game-over');
      this.boardElement.setAttribute('aria-live', 'assertive');
      this.boardElement.setAttribute('aria-atomic', 'true');
      this.disableCells();
    } else if (status === 'draw') {
      const message = 'Game ended in a draw!';
      this.statusElement.textContent = message;
      this.statusElement.classList.add('draw');
      this.showGameOverMessage(message);
      this.boardElement.classList.add('game-over');
      this.disableCells();
      this.boardElement.classList.remove('player-x', 'player-o');
    }

    this.boardElement.setAttribute(
      'aria-label',
      `Tic-tac-toe game board. ${this.statusElement.textContent}`
    );
  }

  /**
   * Displays the game over message
   * @param {string} message - The message to display
   */
  showGameOverMessage(message) {
    this.gameOverMessage.textContent = message;
    this.gameOverOverlay.classList.add('visible');
    this.gameOverOverlay.setAttribute('aria-hidden', 'false');
    this.resetButton.focus();
  }

  /**
   * Hides the game over message overlay
   */
  hideGameOverMessage() {
    this.gameOverOverlay.classList.remove('visible');
    this.gameOverOverlay.setAttribute('aria-hidden', 'true');
  }

  /**
   * Highlights the winning combination of cells
   * @param {Array} combination - Array of winning cell coordinates
   */
  highlightWinningCombination(combination) {
    document.querySelectorAll('.cell.highlight').forEach((cell) => {
      cell.classList.remove('highlight');
      cell.removeAttribute('aria-selected');
    });

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

  /**
   * Updates the reset button appearance
   */
  showResetButton(gameOver = false) {
    if (gameOver) {
      this.resetButton.classList.add('game-over');
    } else {
      this.resetButton.classList.remove('game-over');
    }
  }

  /**
   * Disables all cells when game ends
   */
  disableCells() {
    this.cells.forEach((cell) => {
      cell.setAttribute('tabindex', '-1');
      cell.setAttribute('disabled', 'true');
      cell.setAttribute('aria-disabled', 'true');
      cell.style.pointerEvents = 'none';
      cell.classList.add('disabled');
    });

    this.resetButton.setAttribute('tabindex', '0');
    this.resetButton.focus();
  }
}

/**
 * Game Controller - Handles user interactions and game flow
 */
class TicTacToeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupEventListeners();

    // Initialize statistics display if available
    if (window.gameStatistics) {
      console.log('Statistics available during controller initialization, updating display');
      this.updateStatisticsDisplay();
    } else {
      console.log(
        'Statistics not available during controller initialization, will update when ready'
      );
      // Listen for statistics ready event
      document.addEventListener('statisticsReady', (event) => {
        console.log('Statistics ready event received, updating display');
        this.updateStatisticsDisplay();
      });
    }
  }

  /**
   * Sets up event listeners for user interactions
   */
  setupEventListeners() {
    this.view.cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        this.handleCellClick(row, col);
      });

      cell.addEventListener('keydown', (event) => {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));

        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            this.handleCellClick(row, col);
            break;
        }
      });
    });

    this.view.resetButton.addEventListener('click', () => {
      this.handleResetClick();
    });

    this.view.resetButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleResetClick();
      }
    });

    // Add event listener for reset statistics button
    const resetStatisticsButton = document.getElementById('reset-statistics-button');
    if (resetStatisticsButton) {
      resetStatisticsButton.addEventListener('click', () => {
        this.handleResetStatisticsClick();
      });

      resetStatisticsButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleResetStatisticsClick();
        }
      });
    }

    this.view.renderBoard(this.model.board);
    this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);
  }

  /**
   * Focuses a specific cell with bounds checking
   */
  focusCell(row, col) {
    row = Math.max(0, Math.min(2, row));
    col = Math.max(0, Math.min(2, col));

    this.view.currentFocusRow = row;
    this.view.currentFocusCol = col;

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      if (
        document.activeElement &&
        document.activeElement.classList &&
        document.activeElement.classList.contains('cell')
      ) {
        document.querySelectorAll('.cell').forEach((c) => {
          c.classList.remove('keyboard-focus');
        });
        cell.classList.add('keyboard-focus');
      }

      try {
        cell.focus();
      } catch (e) {
        setTimeout(() => {
          try {
            cell.focus();
          } catch (innerError) {
            // If it still fails, silently continue
          }
        }, 50);
      }
    }
  }

  /**
   * Handles cell click or selection
   */
  handleCellClick(row, col) {
    if (this.model.gameStatus !== 'in_progress') {
      this.announceToScreenReader('Game is already over. Please reset to play again.');
      return;
    }

    if (this.model.board[row][col] !== null) {
      this.announceToScreenReader('Cell is already marked. Please choose another cell.');
      return;
    }

    const currentPlayer = this.model.currentPlayer;

    if (this.model.makeMove(row, col)) {
      const humanRow = row + 1;
      const humanCol = col + 1;

      this.announceToScreenReader(
        `Player ${currentPlayer} placed at row ${humanRow}, column ${humanCol}`
      );

      this.view.renderBoard(this.model.board);

      if (this.model.gameStatus !== 'in_progress') {
        const displayPlayer = this.model.gameStatus.startsWith('win')
          ? this.model.gameStatus.split('_')[1]
          : this.model.currentPlayer;

        this.view.updateStatus(this.model.gameStatus, displayPlayer);

        // Update statistics based on game result
        if (window.gameStatistics) {
          const updatedValue = window.gameStatistics.updateStatistics(this.model.gameStatus);

          // Determine which stat was updated for visual feedback
          let updatedStatId = null;
          if (this.model.gameStatus === 'win_X') {
            updatedStatId = 'player-x-wins';
          } else if (this.model.gameStatus === 'win_O') {
            updatedStatId = 'player-o-wins';
          } else if (this.model.gameStatus === 'draw') {
            updatedStatId = 'draws';
          }

          this.updateStatisticsDisplay(updatedStatId);

          // Announce statistics update
          if (this.model.gameStatus.startsWith('win')) {
            const winningPlayer = this.model.gameStatus.split('_')[1];
            this.announceToScreenReader(
              `Player ${winningPlayer} wins! Player ${winningPlayer} now has ${updatedValue} total wins.`,
              'polite'
            );
          } else if (this.model.gameStatus === 'draw') {
            this.announceToScreenReader(
              `Game ended in a draw. Total draws: ${updatedValue}.`,
              'polite'
            );
          }
        }

        if (this.model.winningCombination) {
          this.view.highlightWinningCombination(this.model.winningCombination);

          const winningPlayer = this.model.gameStatus.split('_')[1];
          this.announceToScreenReader(
            `Player ${winningPlayer} wins with ${this.describeWinningCombination(this.model.winningCombination)}`,
            'assertive'
          );
        } else {
          this.announceToScreenReader(
            'Game ended in a draw. No more moves available.',
            'assertive'
          );
        }

        this.view.showResetButton(true);
      } else {
        this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);
      }
    }
  }

  /**
   * Updates the statistics display with current values
   * @param {string} updatedStat - Optional parameter to indicate which stat was updated
   */
  updateStatisticsDisplay(updatedStat = null) {
    if (window.gameStatistics) {
      console.log('Updating statistics display');
      const stats = window.gameStatistics.getStatistics();

      const xWinsElement = document.getElementById('player-x-wins');
      const oWinsElement = document.getElementById('player-o-wins');
      const drawsElement = document.getElementById('draws');
      const statisticsSection = document.getElementById('statistics-section');

      // Update the display values
      if (xWinsElement) xWinsElement.textContent = stats.xWins;
      if (oWinsElement) oWinsElement.textContent = stats.oWins;
      if (drawsElement) drawsElement.textContent = stats.draws;

      // Add visual feedback for the update
      if (statisticsSection) {
        statisticsSection.classList.add('updated');
        setTimeout(() => {
          statisticsSection.classList.remove('updated');
        }, 500);
      }

      // Add specific animation to the updated stat
      if (updatedStat) {
        const elementToAnimate = document.getElementById(updatedStat);
        if (elementToAnimate) {
          elementToAnimate.classList.add('updated');
          setTimeout(() => {
            elementToAnimate.classList.remove('updated');
          }, 500);
        }
      }

      // Verify that displayed values match stored values
      const displayedStats = {
        xWins: xWinsElement ? parseInt(xWinsElement.textContent) : null,
        oWins: oWinsElement ? parseInt(oWinsElement.textContent) : null,
        draws: drawsElement ? parseInt(drawsElement.textContent) : null,
      };

      const allMatch =
        displayedStats.xWins === stats.xWins &&
        displayedStats.oWins === stats.oWins &&
        displayedStats.draws === stats.draws;

      if (!allMatch) {
        console.error('Statistics display mismatch. Displayed:', displayedStats, 'Stored:', stats);
        // Force update again if there's a mismatch
        setTimeout(() => this.updateStatisticsDisplay(), 100);
      } else {
        console.log('Statistics display updated successfully');
      }
    }
  }

  /**
   * Handles reset statistics button click
   */
  handleResetStatisticsClick() {
    if (window.gameStatistics) {
      // Confirm before resetting
      if (confirm('Are you sure you want to reset all game statistics?')) {
        window.gameStatistics.resetStatistics();
        this.updateStatisticsDisplay();
        this.announceToScreenReader('Game statistics have been reset to zero.', 'assertive');

        // Add visual feedback
        const resetButton = document.getElementById('reset-statistics-button');
        if (resetButton) {
          resetButton.classList.add('active');
          setTimeout(() => {
            resetButton.classList.remove('active');
          }, 300);
        }
      }
    }
  }

  /**
   * Describes the winning combination in a human-readable format
   */
  describeWinningCombination(combination) {
    if (!combination || combination.length !== 3) {
      return 'unknown combination';
    }

    if (combination[0][0] === combination[1][0] && combination[1][0] === combination[2][0]) {
      return `three in a row at row ${combination[0][0] + 1}`;
    }

    if (combination[0][1] === combination[1][1] && combination[1][1] === combination[2][1]) {
      return `three in a column at column ${combination[0][1] + 1}`;
    }

    if (
      (combination[0][0] === 0 &&
        combination[0][1] === 0 &&
        combination[1][0] === 1 &&
        combination[1][1] === 1 &&
        combination[2][0] === 2 &&
        combination[2][1] === 2) ||
      (combination.some((pos) => pos[0] === 0 && pos[1] === 0) &&
        combination.some((pos) => pos[0] === 1 && pos[1] === 1) &&
        combination.some((pos) => pos[0] === 2 && pos[1] === 2))
    ) {
      return 'three in a diagonal from top-left to bottom-right';
    }

    if (
      (combination[0][0] === 0 &&
        combination[0][1] === 2 &&
        combination[1][0] === 1 &&
        combination[1][1] === 1 &&
        combination[2][0] === 2 &&
        combination[2][1] === 0) ||
      (combination.some((pos) => pos[0] === 0 && pos[1] === 2) &&
        combination.some((pos) => pos[0] === 1 && pos[1] === 1) &&
        combination.some((pos) => pos[0] === 2 && pos[1] === 0))
    ) {
      return 'three in a diagonal from top-right to bottom-left';
    }

    return 'three in a row';
  }

  /**
   * Announces messages to screen readers with specified priority
   * @param {string} message - The message to announce
   * @param {string} priority - ARIA live region priority ('polite' or 'assertive')
   */
  announceToScreenReader(message, priority = 'polite') {
    this.view.srAnnouncer.textContent = message;
    this.view.srAnnouncer.setAttribute('aria-live', priority);

    setTimeout(() => {
      this.view.srAnnouncer.textContent = '';
      this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
    }, 3000);
  }

  /**
   * Handles reset button click
   */
  handleResetClick() {
    this.model.reset();
    this.view.renderBoard(this.model.board);
    this.view.updateStatus(this.model.gameStatus, this.model.currentPlayer);

    document.querySelectorAll('.cell.highlight').forEach((cell) => {
      cell.classList.remove('highlight');
      cell.removeAttribute('aria-selected');
    });

    document.querySelectorAll('.cell.disabled').forEach((cell) => {
      cell.classList.remove('disabled');
      cell.removeAttribute('disabled');
      cell.removeAttribute('aria-disabled');
      cell.style.pointerEvents = 'auto';
      cell.setAttribute('tabindex', '0'); // Restore tabindex for keyboard navigation
    });

    document.querySelectorAll('.cell.keyboard-focus').forEach((cell) => {
      cell.classList.remove('keyboard-focus');
    });

    this.view.hideGameOverMessage();
    this.view.showResetButton(false);
    this.announceToScreenReader('Game has been reset. Player X starts.');
  }
}

/**
 * Initialize the game with MVC components
 * @returns {TicTacToeController} The game controller instance
 */
function initGame() {
  console.log('Initializing game components...');

  const model = new TicTacToeGame();
  const view = new TicTacToeView();
  const controller = new TicTacToeController(model, view);

  window.gameController = controller;
  setupKeyboardNavigation(controller);

  // Create a custom event to signal that the game controller is ready
  const controllerReadyEvent = new CustomEvent('gameControllerReady', { detail: { controller } });
  document.dispatchEvent(controllerReadyEvent);

  console.log('Game components initialized');
  return controller;
}

/**
 * Sets up keyboard navigation for the game board
 * @param {TicTacToeController} controller - The game controller instance
 */
/**
 * Game Statistics - Handles tracking and persistence of game statistics
 */
class GameStatistics {
  constructor() {
    this.stats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
    };
    // Check if localStorage is available before trying to use it
    this.storageAvailable = this.checkStorageAvailability();
    this.loadStatistics();

    // Log initial statistics state for debugging
    console.log(
      'Initial statistics state:',
      { ...this.stats },
      'Storage available:',
      this.storageAvailable
    );
  }

  /**
   * Checks if localStorage is available and working
   * @returns {boolean} True if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      // Verify the test was successful
      const isAvailable = testValue === testKey;

      if (!isAvailable) {
        console.warn('localStorage test failed. Storage may be disabled or not working correctly.');

        // Show notification to user
        if (window.notifications) {
          window.notifications.show(
            'Game statistics cannot be saved. Your progress will not be remembered when you refresh the page.',
            'warning',
            {
              duration: 8000,
            }
          );
        }
      }

      return isAvailable;
    } catch (e) {
      console.warn(
        'localStorage is not available. Statistics will not persist between sessions.',
        e
      );

      // Show notification to user
      if (window.notifications) {
        window.notifications.show(
          'Game statistics cannot be saved. You may be in private browsing mode or have cookies disabled.',
          'warning',
          {
            duration: 8000,
          }
        );
      }

      return false;
    }
  }

  /**
   * Increments the win counter for Player X
   */
  incrementXWins() {
    this.stats.xWins++;
    this.saveStatistics();
    return this.stats.xWins;
  }

  /**
   * Increments the win counter for Player O
   */
  incrementOWins() {
    this.stats.oWins++;
    this.saveStatistics();
    return this.stats.oWins;
  }

  /**
   * Increments the draw counter
   */
  incrementDraws() {
    this.stats.draws++;
    this.saveStatistics();
    return this.stats.draws;
  }

  /**
   * Resets all statistics to zero
   */
  resetStatistics() {
    this.stats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
    };
    this.saveStatistics();
    return this.stats;
  }

  /**
   * Saves statistics to localStorage
   * @param {boolean} retry - Whether this is a retry attempt
   * @returns {boolean} Whether the save was successful
   */
  saveStatistics(retry = false) {
    // Skip saving if localStorage is not available
    if (!this.storageAvailable) {
      console.warn('Cannot save statistics: localStorage is not available');
      return false;
    }

    try {
      const statsJson = JSON.stringify(this.stats);
      localStorage.setItem('ticTacToeStatistics', statsJson);

      // Verify the save was successful
      const savedData = localStorage.getItem('ticTacToeStatistics');
      const saveSuccessful = savedData === statsJson;

      if (!saveSuccessful) {
        console.error('Statistics verification failed. Saved data does not match.');

        // Show notification to user with retry option
        if (window.notifications && !retry) {
          window.notifications.show(
            'Failed to save game statistics. Your progress may not be remembered.',
            'error',
            {
              duration: 0, // Persistent until user dismisses
              actions: [
                {
                  label: 'Retry',
                  callback: () => this.saveStatistics(true),
                },
              ],
            }
          );
        }
      } else {
        console.log('Statistics saved successfully:', this.stats);
      }

      return saveSuccessful;
    } catch (error) {
      console.error('Failed to save statistics to localStorage:', error);

      // Show notification to user with retry option
      if (window.notifications && !retry) {
        window.notifications.show(
          'Failed to save game statistics: ' + (error.message || 'Unknown error'),
          'error',
          {
            duration: 0, // Persistent until user dismisses
            actions: [
              {
                label: 'Retry',
                callback: () => this.saveStatistics(true),
              },
            ],
          }
        );
      }

      return false;
    }
  }

  /**
   * Loads statistics from localStorage
   */
  loadStatistics() {
    // Skip loading if localStorage is not available
    if (!this.storageAvailable) {
      console.warn('Cannot load statistics: localStorage is not available');
      return false;
    }

    try {
      const savedStats = localStorage.getItem('ticTacToeStatistics');
      if (!savedStats) {
        console.log('No saved statistics found. Using default values.');
        return false;
      }

      const parsedStats = JSON.parse(savedStats);
      console.log('Loaded statistics from localStorage:', parsedStats);

      // Validate the structure of loaded statistics with more tolerance
      if (typeof parsedStats === 'object') {
        // Use default values for missing properties and ensure numbers
        this.stats = {
          xWins: Number(parsedStats.xWins) || 0,
          oWins: Number(parsedStats.oWins) || 0,
          draws: Number(parsedStats.draws) || 0,
        };

        console.log('Statistics loaded and validated successfully:', this.stats);
        return true;
      }

      console.warn('Invalid statistics format in localStorage. Using default values.');
      return false;
    } catch (error) {
      console.error('Failed to load statistics from localStorage:', error);
      // Don't reset stats on error, keep defaults
      return false;
    }
  }

  /**
   * Gets the current statistics
   */
  getStatistics() {
    return { ...this.stats };
  }

  /**
   * Updates statistics based on game result
   * @param {string} result - The game result ('win_X', 'win_O', or 'draw')
   */
  updateStatistics(result) {
    if (result === 'win_X') {
      return this.incrementXWins();
    } else if (result === 'win_O') {
      return this.incrementOWins();
    } else if (result === 'draw') {
      return this.incrementDraws();
    }
    return null;
  }
}

/**
 * Initializes the game statistics functionality
 */
function initStatistics() {
  console.log('Initializing game statistics...');

  // Create a global statistics instance
  window.gameStatistics = new GameStatistics();

  // Create a custom event to signal that statistics are ready
  const statisticsReadyEvent = new CustomEvent('statisticsReady', {
    detail: { stats: window.gameStatistics },
  });
  document.dispatchEvent(statisticsReadyEvent);

  console.log('Game statistics initialized');
}

function setupKeyboardNavigation(controller) {
  document.addEventListener('keydown', function (event) {
    if (controller.model.gameStatus !== 'in_progress') {
      if (event.key === 'Tab') {
        return; // Allow default tab behavior
      }

      if (event.key === 'Enter' || event.key === ' ') {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        return;
      }

      return;
    }

    let row = controller.view.currentFocusRow;
    let col = controller.view.currentFocusCol;

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
  });
}
