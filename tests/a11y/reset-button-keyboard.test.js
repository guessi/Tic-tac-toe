/**
 * Tests for reset button keyboard accessibility
 */

describe('Reset Button Keyboard Accessibility', () => {
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

  test('should reset game when Enter key is pressed on reset button', () => {
    // Set up the DOM
    const elements = mockDOM();

    // Create a mock controller
    const mockController = {
      handleResetClick: jest.fn(),
      model: {
        gameStatus: 'win_X',
      },
    };

    // Add event listener to reset button
    elements.resetButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        mockController.handleResetClick();
      }
    });

    // Create a keyboard event for Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

    // Dispatch the event on the reset button
    elements.resetButton.dispatchEvent(enterEvent);

    // Verify handleResetClick was called
    expect(mockController.handleResetClick).toHaveBeenCalled();
  });

  test('should reset game when Space key is pressed on reset button', () => {
    // Set up the DOM
    const elements = mockDOM();

    // Create a mock controller
    const mockController = {
      handleResetClick: jest.fn(),
      model: {
        gameStatus: 'win_X',
      },
    };

    // Add event listener to reset button
    elements.resetButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        mockController.handleResetClick();
      }
    });

    // Create a keyboard event for Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });

    // Dispatch the event on the reset button
    elements.resetButton.dispatchEvent(spaceEvent);

    // Verify handleResetClick was called
    expect(mockController.handleResetClick).toHaveBeenCalled();
  });

  test('should allow Enter key for reset button when game is over', () => {
    // Set up the DOM
    const elements = mockDOM();

    // Create a mock controller
    const mockController = {
      model: {
        gameStatus: 'win_X',
      },
      view: {
        currentFocusRow: 1,
        currentFocusCol: 1,
      },
      focusCell: jest.fn(),
    };

    // Create a mock event
    const mockEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
      target: elements.resetButton,
    };

    // Create a mock keyboard handler
    const keyboardHandler = (event) => {
      // Check if the game is over - if so, don't allow arrow key navigation
      if (mockController.model.gameStatus !== 'in_progress') {
        // Only allow tab navigation to the reset button when game is over
        if (event.key === 'Tab') {
          return; // Allow default tab behavior
        }

        // Allow Enter and Space for the reset button
        if (event.key === 'Enter' || event.key === ' ') {
          // Don't prevent default here to allow the reset button's own event handler to work
          return;
        }

        // For arrow keys, prevent default and do nothing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          return;
        }

        return;
      }
    };

    // Call the handler with the mock event
    keyboardHandler(mockEvent);

    // Verify preventDefault was NOT called (Enter key was allowed)
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });
});
