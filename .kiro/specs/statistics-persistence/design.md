# Design Document: Game Statistics Persistence

## Overview

This document outlines the design for ensuring game statistics persistence in the Tic-tac-toe game. The feature will guarantee that game statistics (wins for Player X, wins for Player O, and draws) are properly saved and loaded between page refreshes, ensuring that players can track their performance over time without data loss.

## Current Implementation Analysis

The current implementation has the following components related to statistics persistence:

1. **GameStatistics Class**: Handles tracking and persistence of game statistics
   - Contains methods for incrementing wins and draws
   - Contains methods for saving to and loading from localStorage
   - Contains methods for resetting statistics

2. **Statistics Initialization**: The `initStatistics()` function creates a global instance of GameStatistics
   - Called during page load via DOMContentLoaded event

3. **Statistics Display**: The TicTacToeController updates the UI with statistics values
   - `updateStatisticsDisplay()` method updates the DOM elements with current statistics

4. **Statistics Update**: Game results trigger statistics updates
   - When a game ends, the controller calls `updateStatistics()` on the GameStatistics instance

## Issue Identification

After analyzing the code, we've identified the following potential issues that could cause statistics to reset on page refresh:

1. **Initialization Timing**: The statistics might be initialized before the DOM is fully loaded, causing display issues.

2. **localStorage Access**: There might be issues with accessing localStorage (permissions, private browsing mode).

3. **Data Validation**: The validation of loaded statistics might be too strict, causing valid data to be rejected.

4. **Error Handling**: Errors during loading might cause the statistics to reset to default values without notification.

5. **Race Conditions**: There might be race conditions between loading statistics and updating the display.

## Architecture Changes

To address these issues, we'll make the following architectural changes:

1. **Enhanced Error Handling**: Add more robust error handling for localStorage operations with user notifications.

2. **Improved Data Validation**: Refine the validation logic to be more tolerant of minor data structure variations.

3. **Initialization Sequence**: Ensure proper sequencing of statistics loading and display initialization.

4. **Verification System**: Add verification steps to confirm statistics are properly persisted.

5. **Debug Logging**: Add optional debug logging to help diagnose persistence issues.

## Component Design

### GameStatistics Class Enhancements

```javascript
class GameStatistics {
  constructor() {
    this.stats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
    };
    this.storageAvailable = this.checkStorageAvailability();
    this.loadStatistics();
  }

  // New method to check if localStorage is available
  checkStorageAvailability() {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available. Statistics will not persist between sessions.');
      return false;
    }
  }

  // Enhanced loadStatistics method with better error handling
  loadStatistics() {
    if (!this.storageAvailable) return false;

    try {
      const savedStats = localStorage.getItem('ticTacToeStatistics');
      if (!savedStats) return false;

      const parsedStats = JSON.parse(savedStats);

      // More tolerant validation
      if (typeof parsedStats === 'object') {
        // Use default values for missing properties
        this.stats = {
          xWins: Number(parsedStats.xWins) || 0,
          oWins: Number(parsedStats.oWins) || 0,
          draws: Number(parsedStats.draws) || 0,
        };

        console.log('Statistics loaded successfully:', this.stats);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load statistics from localStorage:', error);
      // Don't reset stats on error, keep defaults
      return false;
    }
  }

  // Enhanced saveStatistics method with verification
  saveStatistics() {
    if (!this.storageAvailable) return false;

    try {
      const statsJson = JSON.stringify(this.stats);
      localStorage.setItem('ticTacToeStatistics', statsJson);

      // Verify the save was successful
      const savedData = localStorage.getItem('ticTacToeStatistics');
      const saveSuccessful = savedData === statsJson;

      if (!saveSuccessful) {
        console.error('Statistics verification failed. Saved data does not match.');
      }

      return saveSuccessful;
    } catch (error) {
      console.error('Failed to save statistics to localStorage:', error);
      return false;
    }
  }
}
```

### Controller Enhancements

```javascript
class TicTacToeController {
  // Enhanced updateStatisticsDisplay method
  updateStatisticsDisplay() {
    if (!window.gameStatistics) return;

    const stats = window.gameStatistics.getStatistics();

    const xWinsElement = document.getElementById('player-x-wins');
    const oWinsElement = document.getElementById('player-o-wins');
    const drawsElement = document.getElementById('draws');

    if (xWinsElement) xWinsElement.textContent = stats.xWins;
    if (oWinsElement) oWinsElement.textContent = stats.oWins;
    if (drawsElement) drawsElement.textContent = stats.draws;

    // Add visual feedback for update
    const statisticsSection = document.getElementById('statistics-section');
    if (statisticsSection) {
      statisticsSection.classList.add('updated');
      setTimeout(() => {
        statisticsSection.classList.remove('updated');
      }, 500);
    }
  }
}
```

### Initialization Sequence

```javascript
function initStatistics() {
  // Create a global statistics instance
  window.gameStatistics = new GameStatistics();

  // Ensure the controller updates the display after statistics are loaded
  if (window.gameController) {
    window.gameController.updateStatisticsDisplay();
  } else {
    // If controller isn't ready yet, wait for it
    document.addEventListener('gameControllerReady', () => {
      window.gameController.updateStatisticsDisplay();
    });
  }
}

function initGame() {
  const model = new TicTacToeGame();
  const view = new TicTacToeView();
  const controller = new TicTacToeController(model, view);

  window.gameController = controller;
  setupKeyboardNavigation(controller);

  // Dispatch event to notify that controller is ready
  document.dispatchEvent(new CustomEvent('gameControllerReady'));

  return controller;
}
```

## CSS Enhancements

```css
/* Visual feedback for statistics updates */
@keyframes statistics-updated {
  0% {
    background-color: inherit;
  }
  50% {
    background-color: rgba(76, 175, 80, 0.2); /* Light green flash */
  }
  100% {
    background-color: inherit;
  }
}

.statistics-section.updated {
  animation: statistics-updated 0.5s ease;
}
```

## Testing Strategy

1. **Unit Tests**:
   - Test localStorage availability detection
   - Test statistics loading with various data scenarios
   - Test statistics saving with verification
   - Test error handling for localStorage operations

2. **Integration Tests**:
   - Test the full lifecycle of statistics from game end to persistence
   - Test page refresh with existing statistics
   - Test statistics reset functionality

3. **Edge Case Tests**:
   - Test with localStorage disabled
   - Test with corrupted localStorage data
   - Test with localStorage quota exceeded
   - Test with very large numbers in statistics

4. **Cross-Browser Tests**:
   - Test in Chrome, Firefox, Safari, and Edge
   - Test in private browsing mode

## Implementation Plan

1. Enhance the GameStatistics class with improved error handling and validation
2. Add storage availability detection
3. Implement verification for save operations
4. Enhance the controller's updateStatisticsDisplay method
5. Improve the initialization sequence
6. Add visual feedback for statistics updates
7. Add comprehensive error logging
8. Test across different scenarios and browsers
