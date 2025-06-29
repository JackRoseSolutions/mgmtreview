// UI helper functions and toast notifications
export const showToast = (message, duration = 3000) => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, duration);
};

// Theme management
export const loadTheme = () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(savedTheme);
    updateThemeDropdown(savedTheme);
};

export const applyTheme = (themeName) => {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
};

export const updateThemeDropdown = (selectedTheme) => {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === selectedTheme) {
            option.classList.add('active');
        }
    });
};

export const saveTheme = (themeName) => {
    localStorage.setItem('selectedTheme', themeName);
    applyTheme(themeName);
    updateThemeDropdown(themeName);
};

