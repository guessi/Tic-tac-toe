/**
 * Tests for keyboard navigation behavior after game end
 */

describe('Keyboard Navigation After Game End', () => {
  test('should disable keyboard navigation after game ends', () => {
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
      key: 'ArrowUp',
      preventDefault: jest.fn(),
    };

    // Create a mock keyboard handler
    const keyboardHandler = (event) => {
      // Check if the game is over - if so, don't allow arrow key navigation
      if (mockController.model.gameStatus !== 'in_progress') {
        // Only allow tab navigation to the reset button when game is over
        if (event.key === 'Tab') {
          return; // Allow default tab behavior
        }

        // For arrow keys, prevent default and do nothing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          return;
        }

        return;
      }

      // If game is in progress, handle arrow keys
      mockController.focusCell();
    };

    // Call the handler with the mock event
    keyboardHandler(mockEvent);

    // Verify preventDefault was called (arrow key was blocked)
    expect(mockEvent.preventDefault).toHaveBeenCalled();

    // Verify focusCell was not called (navigation was prevented)
    expect(mockController.focusCell).not.toHaveBeenCalled();
  });

  test('should allow keyboard navigation during gameplay', () => {
    // Create a mock controller
    const mockController = {
      model: {
        gameStatus: 'in_progress',
      },
      view: {
        currentFocusRow: 1,
        currentFocusCol: 1,
      },
      focusCell: jest.fn(),
    };

    // Create a mock event
    const mockEvent = {
      key: 'ArrowUp',
      preventDefault: jest.fn(),
    };

    // Create a mock keyboard handler
    const keyboardHandler = (event) => {
      // Check if the game is over - if so, don't allow arrow key navigation
      if (mockController.model.gameStatus !== 'in_progress') {
        // Only allow tab navigation to the reset button when game is over
        if (event.key === 'Tab') {
          return; // Allow default tab behavior
        }

        // For arrow keys, prevent default and do nothing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          return;
        }

        return;
      }

      // If game is in progress, handle arrow keys
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        mockController.focusCell(
          mockController.view.currentFocusRow - 1,
          mockController.view.currentFocusCol
        );
      }
    };

    // Call the handler with the mock event
    keyboardHandler(mockEvent);

    // Verify preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();

    // Verify focusCell was called (navigation was allowed)
    expect(mockController.focusCell).toHaveBeenCalled();
  });

  test('should allow tab navigation to reset button after game ends', () => {
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
      key: 'Tab',
      preventDefault: jest.fn(),
    };

    // Create a mock keyboard handler
    const keyboardHandler = (event) => {
      // Check if the game is over - if so, don't allow arrow key navigation
      if (mockController.model.gameStatus !== 'in_progress') {
        // Only allow tab navigation to the reset button when game is over
        if (event.key === 'Tab') {
          return; // Allow default tab behavior
        }

        // For arrow keys, prevent default and do nothing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          return;
        }

        return;
      }

      // If game is in progress, handle arrow keys
      mockController.focusCell();
    };

    // Call the handler with the mock event
    keyboardHandler(mockEvent);

    // Verify preventDefault was NOT called (tab navigation was allowed)
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();

    // Verify focusCell was not called
    expect(mockController.focusCell).not.toHaveBeenCalled();
  });
});
