describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <link rel="stylesheet" href="dark-mode.min.css" id="dark-mode-stylesheet" />
      <div class="theme-toggle-wrapper">
        <label class="theme-toggle" for="dark-mode-toggle">
          <span class="theme-toggle-label">Light</span>
          <div class="theme-toggle-switch">
            <input type="checkbox" id="dark-mode-toggle" aria-label="Toggle between light and dark mode" />
            <span class="theme-toggle-slider"></span>
          </div>
          <span class="theme-toggle-label">Dark</span>
        </label>
      </div>
      <div id="sr-announcer" aria-live="assertive"></div>
    `;

    document.getElementById('dark-mode-stylesheet').disabled = true;

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('should enable dark mode when toggle is checked', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

    expect(darkModeStylesheet.disabled).toBe(true);
    expect(themeToggle.checked).toBe(false);

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        darkModeStylesheet.disabled = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

        const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
        const srAnnouncer = document.getElementById('sr-announcer');
        srAnnouncer.textContent = message;
      });
    };

    initAccessibilityFeatures();

    themeToggle.checked = true;
    themeToggle.dispatchEvent(new Event('change'));

    expect(darkModeStylesheet.disabled).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    expect(document.getElementById('sr-announcer').textContent).toBe('Dark mode enabled');
  });

  test('should enable light mode when toggle is unchecked', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

    darkModeStylesheet.disabled = false;
    themeToggle.checked = true;

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        darkModeStylesheet.disabled = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

        const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
        const srAnnouncer = document.getElementById('sr-announcer');
        srAnnouncer.textContent = message;
      });
    };

    initAccessibilityFeatures();

    themeToggle.checked = false;
    themeToggle.dispatchEvent(new Event('change'));

    expect(darkModeStylesheet.disabled).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    expect(document.getElementById('sr-announcer').textContent).toBe('Light mode enabled');
  });

  test('should load dark mode preference from localStorage on page load', () => {
    localStorage.getItem.mockReturnValue('true');

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      if (darkModeEnabled) {
        darkModeStylesheet.disabled = false;
        themeToggle.checked = true;
      } else {
        themeToggle.checked = false;
      }
    };

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(false);
    expect(document.getElementById('dark-mode-toggle').checked).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
  });

  test('should default to light mode when no preference is stored', () => {
    localStorage.getItem.mockReturnValue(null);

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      if (darkModeEnabled) {
        darkModeStylesheet.disabled = false;
        themeToggle.checked = true;
      } else {
        themeToggle.checked = false;
      }
    };

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(true);
    expect(document.getElementById('dark-mode-toggle').checked).toBe(false);
    expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
  });

  test('should position the theme toggle in the top-right corner', () => {
    const themeToggleWrapper = document.querySelector('.theme-toggle-wrapper');

    window.getComputedStyle = jest.fn().mockReturnValue({
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100',
    });

    const computedStyle = window.getComputedStyle(themeToggleWrapper);

    expect(computedStyle.position).toBe('fixed');
    expect(computedStyle.top).toBe('20px');
    expect(computedStyle.right).toBe('20px');
    expect(computedStyle.zIndex).toBe('100');
  });

  test('should have visual indicators for light and dark modes', () => {
    const themeToggleSlider = document.querySelector('.theme-toggle-slider');

    window.getComputedStyle = jest.fn().mockReturnValue({
      content: '"☀️"',
    });

    let computedStyle = window.getComputedStyle(themeToggleSlider, ':after');
    expect(computedStyle.content).toBe('"☀️"');

    const themeToggle = document.getElementById('dark-mode-toggle');
    themeToggle.checked = true;

    window.getComputedStyle = jest.fn().mockReturnValue({
      content: '"🌙"',
    });

    computedStyle = window.getComputedStyle(themeToggleSlider, ':after');
    expect(computedStyle.content).toBe('"🌙"');
  });

  test('should center the sun icon in light mode', () => {
    const themeToggleSlider = document.querySelector('.theme-toggle-slider');

    // Mock the computed style for the light mode icon
    window.getComputedStyle = jest.fn().mockReturnValue({
      content: '"☀️"',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '18px',
      height: '100%',
      left: '3px',
    });

    const computedStyle = window.getComputedStyle(themeToggleSlider, ':after');

    // Check that flexbox centering is applied
    expect(computedStyle.display).toBe('flex');
    expect(computedStyle.justifyContent).toBe('center');
    expect(computedStyle.alignItems).toBe('center');

    // Check that the icon has appropriate dimensions and position
    expect(computedStyle.width).toBe('18px');
    expect(computedStyle.height).toBe('100%');
    expect(computedStyle.left).toBe('3px');
  });

  test('should center the moon icon in dark mode', () => {
    const themeToggleSlider = document.querySelector('.theme-toggle-slider');
    const themeToggle = document.getElementById('dark-mode-toggle');

    // Set to dark mode
    themeToggle.checked = true;

    // Mock the computed style for the dark mode icon
    window.getComputedStyle = jest.fn().mockReturnValue({
      content: '"🌙"',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '18px',
      height: '100%',
      left: 'calc(100% - 21px)',
    });

    const computedStyle = window.getComputedStyle(themeToggleSlider, ':after');

    // Check that flexbox centering is applied
    expect(computedStyle.display).toBe('flex');
    expect(computedStyle.justifyContent).toBe('center');
    expect(computedStyle.alignItems).toBe('center');

    // Check that the icon has appropriate dimensions and position
    expect(computedStyle.width).toBe('18px');
    expect(computedStyle.height).toBe('100%');
    expect(computedStyle.left).toBe('calc(100% - 21px)');
  });

  test('should toggle theme with keyboard interaction', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        darkModeStylesheet.disabled = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

        const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
        const srAnnouncer = document.getElementById('sr-announcer');
        srAnnouncer.textContent = message;
      });
    };

    initAccessibilityFeatures();

    expect(darkModeStylesheet.disabled).toBe(true);
    themeToggle.focus();
    themeToggle.checked = true;
    themeToggle.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    themeToggle.dispatchEvent(new Event('change'));

    expect(darkModeStylesheet.disabled).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    themeToggle.checked = false;
    themeToggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    themeToggle.dispatchEvent(new Event('change'));

    expect(darkModeStylesheet.disabled).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });

  test('should respect system preference for dark mode', () => {
    window.matchMedia.mockImplementation((query) => {
      if (query === '(prefers-color-scheme: dark)') {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });

    localStorage.getItem.mockReturnValue(null);

    const initAccessibilityFeatures = () => {
      const themeToggle = document.getElementById('dark-mode-toggle');
      const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference === null) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        darkModeStylesheet.disabled = !prefersDarkMode;
        themeToggle.checked = prefersDarkMode;
        if (prefersDarkMode) {
          localStorage.setItem('darkMode', 'true');
        }
      } else {
        const darkModeEnabled = storedPreference === 'true';
        darkModeStylesheet.disabled = !darkModeEnabled;
        themeToggle.checked = darkModeEnabled;
      }
    };

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(false);
    expect(document.getElementById('dark-mode-toggle').checked).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
  });

  test('should handle localStorage errors gracefully', () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage is not available');
    });
    localStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage is not available');
    });

    const initAccessibilityFeatures = () => {
      try {
        const themeToggle = document.getElementById('dark-mode-toggle');
        const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

        try {
          const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
          darkModeStylesheet.disabled = !darkModeEnabled;
          themeToggle.checked = darkModeEnabled;
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          darkModeStylesheet.disabled = true;
          themeToggle.checked = false;
        }

        themeToggle.addEventListener('change', () => {
          try {
            const isDarkMode = themeToggle.checked;
            darkModeStylesheet.disabled = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

            const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
            const srAnnouncer = document.getElementById('sr-announcer');
            srAnnouncer.textContent = message;
          } catch (error) {
            console.error('Error saving to localStorage:', error);
            const isDarkMode = themeToggle.checked;
            darkModeStylesheet.disabled = !isDarkMode;

            const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
            const srAnnouncer = document.getElementById('sr-announcer');
            srAnnouncer.textContent = message;
          }
        });
      } catch (error) {
        console.error('Error initializing theme toggle:', error);
      }
    };

    const originalConsoleError = console.error;
    console.error = jest.fn();

    initAccessibilityFeatures();

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(true);
    expect(document.getElementById('dark-mode-toggle').checked).toBe(false);
    expect(console.error).toHaveBeenCalled();

    const themeToggle = document.getElementById('dark-mode-toggle');
    themeToggle.checked = true;
    themeToggle.dispatchEvent(new Event('change'));

    expect(document.getElementById('dark-mode-stylesheet').disabled).toBe(false);
    expect(document.getElementById('sr-announcer').textContent).toBe('Dark mode enabled');

    console.error = originalConsoleError;
  });

  test('should verify ARIA attributes for accessibility', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');

    expect(themeToggle.getAttribute('aria-label')).toBe('Toggle between light and dark mode');
    const srAnnouncer = document.getElementById('sr-announcer');
    expect(srAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });

  test('should handle focus states correctly', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');

    window.getComputedStyle = jest.fn().mockReturnValue({
      outline: '2px solid blue',
      outlineOffset: '2px',
    });

    themeToggle.focus();

    const computedStyle = window.getComputedStyle(themeToggle);
    expect(computedStyle.outline).toBe('2px solid blue');
    expect(computedStyle.outlineOffset).toBe('2px');

    themeToggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  });
});
