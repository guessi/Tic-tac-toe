describe('Dark Mode Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <link rel="stylesheet" href="dark-mode.min.css" id="dark-mode-stylesheet" />
      <button class="a11y-button" id="dark-mode-toggle" aria-label="Toggle dark mode">
        Dark Mode
      </button>
      <div id="sr-announcer" aria-live="assertive"></div>
    `;

    // Explicitly set the disabled property
    document.getElementById('dark-mode-stylesheet').disabled = true;

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  test('should enable dark mode when button is clicked', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

    expect(darkModeStylesheet.disabled).toBe(true);

    const initAccessibilityFeatures = () => {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      darkModeToggle.addEventListener('click', () => {
        const isEnabled = darkModeStylesheet.disabled;
        darkModeStylesheet.disabled = !isEnabled;
        darkModeToggle.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
        localStorage.setItem('darkMode', isEnabled ? 'true' : 'false');

        const message = isEnabled ? 'Dark mode enabled' : 'Dark mode disabled';
        const srAnnouncer = document.getElementById('sr-announcer');
        srAnnouncer.textContent = message;
      });
    };

    initAccessibilityFeatures();
    darkModeToggle.click();

    expect(darkModeStylesheet.disabled).toBe(false);
    expect(darkModeToggle.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    expect(document.getElementById('sr-announcer').textContent).toBe('Dark mode enabled');
  });

  test('should disable dark mode when button is clicked again', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

    darkModeStylesheet.disabled = false;
    darkModeToggle.setAttribute('aria-pressed', 'true');

    const initAccessibilityFeatures = () => {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      darkModeToggle.addEventListener('click', () => {
        const isEnabled = darkModeStylesheet.disabled;
        darkModeStylesheet.disabled = !isEnabled;
        darkModeToggle.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
        localStorage.setItem('darkMode', isEnabled ? 'true' : 'false');

        const message = isEnabled ? 'Dark mode enabled' : 'Dark mode disabled';
        const srAnnouncer = document.getElementById('sr-announcer');
        srAnnouncer.textContent = message;
      });
    };

    initAccessibilityFeatures();
    darkModeToggle.click();

    expect(darkModeStylesheet.disabled).toBe(true);
    expect(darkModeToggle.getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    expect(document.getElementById('sr-announcer').textContent).toBe('Dark mode disabled');
  });

  test('should load dark mode preference from localStorage on page load', () => {
    localStorage.getItem.mockReturnValue('true');

    const initAccessibilityFeatures = () => {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      if (darkModeEnabled) {
        darkModeStylesheet.disabled = false;
        darkModeToggle.setAttribute('aria-pressed', 'true');
      } else {
        darkModeToggle.setAttribute('aria-pressed', 'false');
      }
    };

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(false);
    expect(document.getElementById('dark-mode-toggle').getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
  });

  test('should default to light mode when no preference is stored', () => {
    localStorage.getItem.mockReturnValue(null);

    const initAccessibilityFeatures = () => {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      if (darkModeEnabled) {
        darkModeStylesheet.disabled = false;
        darkModeToggle.setAttribute('aria-pressed', 'true');
      } else {
        darkModeToggle.setAttribute('aria-pressed', 'false');
      }
    };

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(true);
    expect(document.getElementById('dark-mode-toggle').getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
  });
});
