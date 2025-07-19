describe('Screen Reader Announcements', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="status" id="status">Player X's turn</div>
      <div class="sr-only" id="sr-announcer" aria-live="assertive"></div>
      <div class="game-board" id="game-board">
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
      <button id="reset-button">Reset Game</button>
    `;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should announce player turns with polite priority', () => {
    const controller = {
      model: {
        currentPlayer: 'X',
        gameStatus: 'in_progress',
      },
      view: {
        srAnnouncer: document.getElementById('sr-announcer'),
      },
      announceToScreenReader: function (message, priority = 'polite') {
        this.view.srAnnouncer.textContent = message;
        this.view.srAnnouncer.setAttribute('aria-live', priority);

        setTimeout(() => {
          this.view.srAnnouncer.textContent = '';
          this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
        }, 3000);
      },
    };

    controller.announceToScreenReader("Player X's turn");

    expect(controller.view.srAnnouncer.textContent).toBe("Player X's turn");
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('polite');

    jest.advanceTimersByTime(3000);

    expect(controller.view.srAnnouncer.textContent).toBe('');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should announce game results with assertive priority', () => {
    const controller = {
      model: {
        currentPlayer: 'X',
        gameStatus: 'win_X',
        winningCombination: [
          [0, 0],
          [0, 1],
          [0, 2],
        ],
      },
      view: {
        srAnnouncer: document.getElementById('sr-announcer'),
      },
      announceToScreenReader: function (message, priority = 'polite') {
        this.view.srAnnouncer.textContent = message;
        this.view.srAnnouncer.setAttribute('aria-live', priority);

        setTimeout(() => {
          this.view.srAnnouncer.textContent = '';
          this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
        }, 3000);
      },
      describeWinningCombination: function (combination) {
        if (combination[0][0] === combination[1][0] && combination[1][0] === combination[2][0]) {
          return `three in a row at row ${combination[0][0] + 1}`;
        }
        return 'three in a row';
      },
    };

    const winningPlayer = controller.model.gameStatus.split('_')[1];
    controller.announceToScreenReader(
      `Player ${winningPlayer} wins with ${controller.describeWinningCombination(controller.model.winningCombination)}`,
      'assertive'
    );

    expect(controller.view.srAnnouncer.textContent).toBe(
      'Player X wins with three in a row at row 1'
    );
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');

    jest.advanceTimersByTime(3000);

    expect(controller.view.srAnnouncer.textContent).toBe('');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should announce draw game with assertive priority', () => {
    const controller = {
      model: {
        gameStatus: 'draw',
      },
      view: {
        srAnnouncer: document.getElementById('sr-announcer'),
      },
      announceToScreenReader: function (message, priority = 'polite') {
        this.view.srAnnouncer.textContent = message;
        this.view.srAnnouncer.setAttribute('aria-live', priority);

        setTimeout(() => {
          this.view.srAnnouncer.textContent = '';
          this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
        }, 3000);
      },
    };

    controller.announceToScreenReader(
      'Game ended in a draw. No more moves available.',
      'assertive'
    );

    expect(controller.view.srAnnouncer.textContent).toBe(
      'Game ended in a draw. No more moves available.'
    );
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');

    jest.advanceTimersByTime(3000);

    expect(controller.view.srAnnouncer.textContent).toBe('');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should announce invalid moves with polite priority', () => {
    const controller = {
      model: {
        currentPlayer: 'X',
        gameStatus: 'in_progress',
        board: [
          ['X', null, null],
          [null, null, null],
          [null, null, null],
        ],
      },
      view: {
        srAnnouncer: document.getElementById('sr-announcer'),
      },
      announceToScreenReader: function (message, priority = 'polite') {
        this.view.srAnnouncer.textContent = message;
        this.view.srAnnouncer.setAttribute('aria-live', priority);

        setTimeout(() => {
          this.view.srAnnouncer.textContent = '';
          this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
        }, 3000);
      },
      handleCellClick: function (row, col) {
        if (this.model.board[row][col] !== null) {
          this.announceToScreenReader('Cell is already marked. Please choose another cell.');
          return;
        }
      },
    };

    controller.handleCellClick(0, 0);

    expect(controller.view.srAnnouncer.textContent).toBe(
      'Cell is already marked. Please choose another cell.'
    );
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('polite');

    jest.advanceTimersByTime(3000);

    expect(controller.view.srAnnouncer.textContent).toBe('');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should announce game reset', () => {
    const controller = {
      model: {
        reset: function () {
          return true;
        },
      },
      view: {
        srAnnouncer: document.getElementById('sr-announcer'),
        renderBoard: jest.fn(),
        updateStatus: jest.fn(),
        hideGameOverMessage: jest.fn(),
        showResetButton: jest.fn(),
      },
      announceToScreenReader: function (message, priority = 'polite') {
        this.view.srAnnouncer.textContent = message;
        this.view.srAnnouncer.setAttribute('aria-live', priority);

        setTimeout(() => {
          this.view.srAnnouncer.textContent = '';
          this.view.srAnnouncer.setAttribute('aria-live', 'assertive');
        }, 3000);
      },
      handleResetClick: function () {
        this.model.reset();
        this.view.renderBoard();
        this.view.updateStatus();
        this.view.hideGameOverMessage();
        this.view.showResetButton(false);
        this.announceToScreenReader('Game has been reset. Player X starts.');
      },
    };

    controller.handleResetClick();

    expect(controller.view.srAnnouncer.textContent).toBe('Game has been reset. Player X starts.');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('polite');

    jest.advanceTimersByTime(3000);

    expect(controller.view.srAnnouncer.textContent).toBe('');
    expect(controller.view.srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });
});
