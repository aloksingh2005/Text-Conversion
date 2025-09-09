/**
 * Text Conversion & Encoding Suite
 * A comprehensive text conversion tool supporting multiple encoding formats
 */

class TextConverter {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeMorseMaps();
        this.initializeEmojiMaps();
        this.loadUserPreferences();
        this.updateUI();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Main controls
        this.conversionMode = document.getElementById('conversionMode');
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.convertBtn = document.getElementById('convertBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.autoConvert = document.getElementById('autoConvert');

        // Labels and hints
        this.inputLabel = document.getElementById('inputLabel');
        this.outputLabel = document.getElementById('outputLabel');
        this.inputHint = document.getElementById('inputHint');
        this.outputHint = document.getElementById('outputHint');
        this.inputCount = document.getElementById('inputCount');
        this.outputCount = document.getElementById('outputCount');

        // Control buttons
        this.clearInput = document.getElementById('clearInput');
        this.pasteInput = document.getElementById('pasteInput');
        this.copyOutput = document.getElementById('copyOutput');
        this.downloadOutput = document.getElementById('downloadOutput');
        this.clearOutput = document.getElementById('clearOutput');

        // Options
        this.binaryOptions = document.getElementById('binaryOptions');
        this.hexOptions = document.getElementById('hexOptions');
        this.emojiOptions = document.getElementById('emojiOptions');
        this.emojiPreset = document.getElementById('emojiPreset');

        // Error and toast
        this.errorDisplay = document.getElementById('errorDisplay');
        this.errorMessage = document.getElementById('errorMessage');
        this.closeError = document.getElementById('closeError');
        this.toast = document.getElementById('toast');

        // Dark mode
        this.darkModeToggle = document.getElementById('darkModeToggle');
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Main conversion
        this.conversionMode.addEventListener('change', () => this.updateUI());
        this.convertBtn.addEventListener('click', () => this.performConversion());
        this.swapBtn.addEventListener('click', () => this.swapInputOutput());

        // Auto conversion
        this.autoConvert.addEventListener('change', () => {
            if (this.autoConvert.checked) {
                this.performConversion();
            }
        });

        // Input handling
        this.inputText.addEventListener('input', () => {
            this.updateCharCount();
            if (this.autoConvert.checked) {
                this.debounceConversion();
            }
        });

        // Control buttons
        this.clearInput.addEventListener('click', () => this.clearInputText());
        this.pasteInput.addEventListener('click', () => this.pasteToInput());
        this.copyOutput.addEventListener('click', () => this.copyOutputText());
        this.downloadOutput.addEventListener('click', () => this.downloadOutputText());
        this.clearOutput.addEventListener('click', () => this.clearOutputText());

        // Error handling
        this.closeError.addEventListener('click', () => this.hideError());

        // Dark mode
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Options change
        document.querySelectorAll('input[name="binaryBits"], input[name="hexCase"]').forEach(input => {
            input.addEventListener('change', () => {
                if (this.autoConvert.checked) {
                    this.performConversion();
                }
            });
        });

        this.emojiPreset.addEventListener('change', () => {
            if (this.autoConvert.checked) {
                this.performConversion();
            }
        });
    }

    /**
     * Initialize Morse code mappings
     */
    initializeMorseMaps() {
        this.morseToText = {
            '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
            '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
            '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
            '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
            '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
            '--..': 'Z', '.----': '1', '..---': '2', '...--': '3',
            '....-': '4', '.....': '5', '-....': '6', '--...': '7',
            '---..': '8', '----.': '9', '-----': '0', '--..--': ',',
            '.-.-.-': '.', '..--..': '?', '.----.': "'", '-.-.--': '!',
            '-..-.': '/', '-.--.': '(', '-.--.-': ')', '.-...': '&',
            '---...': ':', '-.-.-.': ';', '-...-': '=', '.-.-.': '+',
            '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$',
            '.--.-.': '@'
        };

        this.textToMorse = {};
        for (const [morse, text] of Object.entries(this.morseToText)) {
            this.textToMorse[text] = morse;
        }
    }

    /**
     * Initialize emoji mappings
     */
    initializeEmojiMaps() {
        this.emojiMaps = {
            letters: {
                'A': '🅰️', 'B': '🅱️', 'C': '©️', 'D': '🇩', 'E': '📧',
                'F': '🎏', 'G': '🇬', 'H': '🏨', 'I': 'ℹ️', 'J': '🎷',
                'K': '🎋', 'L': '🇱', 'M': 'Ⓜ️', 'N': '🎵', 'O': '⭕',
                'P': '🅿️', 'Q': '🇶', 'R': '®️', 'S': '💰', 'T': '🆃',
                'U': '⛎', 'V': '♈', 'W': '〰️', 'X': '❌', 'Y': '💴',
                'Z': '💤'
            },
            words: {
                'love': '❤️', 'heart': '💖', 'fire': '🔥', 'water': '💧',
                'sun': '☀️', 'moon': '🌙', 'star': '⭐', 'earth': '🌍',
                'tree': '🌳', 'flower': '🌸', 'cat': '🐱', 'dog': '🐶',
                'happy': '😊', 'sad': '😢', 'angry': '😠', 'surprised': '😲',
                'cool': '😎', 'party': '🎉', 'music': '🎵', 'book': '📚',
                'phone': '📱', 'computer': '💻', 'car': '🚗', 'house': '🏠',
                'food': '🍕', 'coffee': '☕', 'beer': '🍺', 'pizza': '🍕',
                'money': '💰', 'time': '⏰', 'work': '💼', 'sleep': '😴'
            },
            custom: {
                'hello': '👋', 'goodbye': '👋', 'yes': '✅', 'no': '❌',
                'good': '👍', 'bad': '👎', 'ok': '👌', 'peace': '✌️',
                'rock': '🤘', 'thumb': '👍', 'clap': '👏', 'pray': '🙏'
            }
        };
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const autoConvert = localStorage.getItem('autoConvert') === 'true';

        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.darkModeToggle.textContent = '☀️ Light Mode';
        }

        this.autoConvert.checked = autoConvert;
    }

    /**
     * Update UI based on current conversion mode
     */
    updateUI() {
        const mode = this.conversionMode.value;
        const [from, to] = mode.split('-to-');

        // Update labels
        this.inputLabel.textContent = `Input ${this.capitalizeFirst(from)}`;
        this.outputLabel.textContent = `Output ${this.capitalizeFirst(to)}`;

        // Update hints
        this.inputHint.textContent = this.getInputHint(mode);
        this.outputHint.textContent = this.getOutputHint(mode);

        // Show/hide options
        this.binaryOptions.style.display = mode.includes('binary') ? 'flex' : 'none';
        this.hexOptions.style.display = mode.includes('hex') ? 'flex' : 'none';
        this.emojiOptions.style.display = mode.includes('emoji') ? 'flex' : 'none';

        // Clear any previous errors
        this.hideError();

        // Update character counts
        this.updateCharCount();

        // Auto convert if enabled
        if (this.autoConvert.checked && this.inputText.value.trim()) {
            this.performConversion();
        }
    }

    /**
     * Get input hint for the current mode
     */
    getInputHint(mode) {
        const hints = {
            'text-to-binary': 'Enter text to convert to binary',
            'binary-to-text': 'Enter binary (0s and 1s, separated by spaces)',
            'text-to-base64': 'Enter text to encode in Base64',
            'base64-to-text': 'Enter valid Base64 encoded string',
            'text-to-morse': 'Enter text to convert to Morse code',
            'morse-to-text': 'Enter Morse code (dots, dashes, spaces, / for word breaks)',
            'text-to-ascii': 'Enter text to convert to ASCII codes',
            'ascii-to-text': 'Enter ASCII codes (numbers separated by spaces)',
            'text-to-hex': 'Enter text to convert to hexadecimal',
            'hex-to-text': 'Enter hexadecimal values (with or without spaces)',
            'text-to-emoji': 'Enter text to convert using emoji mappings',
            'emoji-to-text': 'Enter emoji to convert back to text'
        };
        return hints[mode] || 'Enter text to convert';
    }

    /**
     * Get output hint for the current mode
     */
    getOutputHint(mode) {
        return 'Converted result will appear here';
    }

    /**
     * Perform the selected conversion
     */
    async performConversion() {
        const input = this.inputText.value;
        const mode = this.conversionMode.value;

        if (!input.trim()) {
            this.outputText.value = '';
            this.updateCharCount();
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            let result = '';

            switch (mode) {
                case 'text-to-binary':
                    result = this.textToBinary(input);
                    break;
                case 'binary-to-text':
                    result = this.binaryToText(input);
                    break;
                case 'text-to-base64':
                    result = this.textToBase64(input);
                    break;
                case 'base64-to-text':
                    result = this.base64ToText(input);
                    break;
                case 'text-to-morse':
                    result = this.textToMorse(input);
                    break;
                case 'morse-to-text':
                    result = this.morseToTextConvert(input);
                    break;
                case 'text-to-ascii':
                    result = this.textToAscii(input);
                    break;
                case 'ascii-to-text':
                    result = this.asciiToText(input);
                    break;
                case 'text-to-hex':
                    result = this.textToHex(input);
                    break;
                case 'hex-to-text':
                    result = this.hexToText(input);
                    break;
                case 'text-to-emoji':
                    result = this.textToEmoji(input);
                    break;
                case 'emoji-to-text':
                    result = this.emojiToText(input);
                    break;
                default:
                    throw new Error('Unknown conversion mode');
            }

            this.outputText.value = result;
            this.updateCharCount();

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Text to Binary conversion
     */
    textToBinary(text) {
        const bits = document.querySelector('input[name="binaryBits"]:checked').value;
        const bitLength = parseInt(bits);

        return text.split('').map(char => {
            const binary = char.charCodeAt(0).toString(2);
            return binary.padStart(bitLength, '0');
        }).join(' ');
    }

    /**
     * Binary to Text conversion
     */
    binaryToText(binary) {
        // Remove extra whitespace and validate
        const cleanBinary = binary.replace(/\s+/g, ' ').trim();

        if (!/^[01\s]+$/.test(cleanBinary)) {
            throw new Error('Invalid binary string. Only 0s, 1s, and spaces are allowed.');
        }

        const binaryGroups = cleanBinary.split(' ').filter(group => group.length > 0);

        return binaryGroups.map(group => {
            if (group.length < 7 || group.length > 8) {
                throw new Error(`Invalid binary group length: ${group}. Expected 7 or 8 bits.`);
            }

            const decimal = parseInt(group, 2);
            if (decimal > 127 && group.length === 7) {
                throw new Error(`Invalid 7-bit binary: ${group}. Value ${decimal} exceeds 127.`);
            }

            return String.fromCharCode(decimal);
        }).join('');
    }

    /**
     * Text to Base64 conversion
     */
    textToBase64(text) {
        try {
            // Handle Unicode characters properly
            const utf8Bytes = new TextEncoder().encode(text);
            const binary = Array.from(utf8Bytes, byte => byte.toString(2).padStart(8, '0')).join('');

            let base64 = '';
            for (let i = 0; i < binary.length; i += 6) {
                const chunk = binary.substr(i, 6).padEnd(6, '0');
                const decimal = parseInt(chunk, 2);
                base64 += this.base64Chars.charAt(decimal);
            }

            // Add padding
            while (base64.length % 4 !== 0) {
                base64 += '=';
            }

            return base64;
        } catch (error) {
            // Fallback to browser's built-in btoa for simple ASCII text
            try {
                return btoa(unescape(encodeURIComponent(text)));
            } catch (e) {
                throw new Error('Failed to encode text to Base64');
            }
        }
    }

    /**
     * Base64 to Text conversion
     */
    base64ToText(base64) {
        try {
            // Validate Base64 format
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
                throw new Error('Invalid Base64 format');
            }

            return decodeURIComponent(escape(atob(base64)));
        } catch (error) {
            throw new Error('Invalid Base64 string');
        }
    }

    /**
     * Text to Morse conversion
     */
    textToMorse(text) {
        return text.toUpperCase().split('').map(char => {
            if (char === ' ') return '/';
            return this.textToMorse[char] || char;
        }).join(' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Morse to Text conversion
     */
    morseToTextConvert(morse) {
        // Validate Morse code format
        if (!/^[.\-\s\/]+$/.test(morse)) {
            throw new Error('Invalid Morse code. Use only dots (.), dashes (-), spaces, and forward slashes (/).');
        }

        return morse.split('/').map(word => {
            return word.trim().split(/\s+/).map(code => {
                if (!code) return '';
                const char = this.morseToText[code];
                if (!char) {
                    throw new Error(`Unknown Morse code: ${code}`);
                }
                return char;
            }).join('');
        }).join(' ');
    }

    /**
     * Text to ASCII conversion
     */
    textToAscii(text) {
        return text.split('').map(char => char.charCodeAt(0)).join(' ');
    }

    /**
     * ASCII to Text conversion
     */
    asciiToText(ascii) {
        const codes = ascii.trim().split(/\s+/).map(code => {
            const num = parseInt(code, 10);
            if (isNaN(num) || num < 0 || num > 127) {
                throw new Error(`Invalid ASCII code: ${code}. Must be between 0 and 127.`);
            }
            return num;
        });

        return codes.map(code => String.fromCharCode(code)).join('');
    }

    /**
     * Text to Hex conversion
     */
    textToHex(text) {
        const hexCase = document.querySelector('input[name="hexCase"]:checked').value;

        return text.split('').map(char => {
            const hex = char.charCodeAt(0).toString(16);
            return hexCase === 'upper' ? hex.toUpperCase() : hex.toLowerCase();
        }).join(' ');
    }

    /**
     * Hex to Text conversion
     */
    hexToText(hex) {
        // Remove spaces and validate
        const cleanHex = hex.replace(/\s+/g, '');

        if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
            throw new Error('Invalid hexadecimal string. Use only 0-9, A-F, a-f.');
        }

        if (cleanHex.length % 2 !== 0) {
            throw new Error('Invalid hex length. Hex string must have even number of characters.');
        }

        let result = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
            const hexPair = cleanHex.substr(i, 2);
            const decimal = parseInt(hexPair, 16);
            result += String.fromCharCode(decimal);
        }

        return result;
    }

    /**
     * Text to Emoji conversion
     */
    textToEmoji(text) {
        const preset = this.emojiPreset.value;
        const emojiMap = this.emojiMaps[preset];

        // First try word replacement
        let result = text;
        for (const [word, emoji] of Object.entries(emojiMap)) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            result = result.replace(regex, emoji);
        }

        // Then try letter replacement for remaining characters
        if (preset === 'letters') {
            result = result.split('').map(char => {
                const upper = char.toUpperCase();
                return emojiMap[upper] || char;
            }).join('');
        }

        return result;
    }

    /**
     * Emoji to Text conversion (basic reverse mapping)
     */
    emojiToText(emoji) {
        const preset = this.emojiPreset.value;
        const emojiMap = this.emojiMaps[preset];

        // Create reverse mapping
        const reverseMap = {};
        for (const [text, emojiChar] of Object.entries(emojiMap)) {
            reverseMap[emojiChar] = text;
        }

        let result = emoji;
        for (const [emojiChar, text] of Object.entries(reverseMap)) {
            result = result.replace(new RegExp(emojiChar, 'g'), text);
        }

        return result;
    }

    /**
     * Base64 character set
     */
    get base64Chars() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    }

    /**
     * Swap input and output
     */
    swapInputOutput() {
        const inputValue = this.inputText.value;
        const outputValue = this.outputText.value;

        this.inputText.value = outputValue;
        this.outputText.value = inputValue;

        // Also swap the conversion mode
        const mode = this.conversionMode.value;
        const [from, to] = mode.split('-to-');
        const swappedMode = `${to}-to-${from}`;

        // Check if swapped mode exists
        const option = Array.from(this.conversionMode.options).find(opt => opt.value === swappedMode);
        if (option) {
            this.conversionMode.value = swappedMode;
            this.updateUI();
        }

        this.updateCharCount();
        this.showToast('Input and output swapped!');
    }

    /**
     * Clear input text
     */
    clearInputText() {
        this.inputText.value = '';
        this.updateCharCount();
        this.inputText.focus();

        if (this.autoConvert.checked) {
            this.outputText.value = '';
            this.updateCharCount();
        }
    }

    /**
     * Paste to input
     */
    async pasteToInput() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.updateCharCount();
            this.inputText.focus();

            if (this.autoConvert.checked) {
                this.performConversion();
            }

            this.showToast('Text pasted!');
        } catch (error) {
            this.showToast('Failed to paste. Please paste manually.', 'error');
        }
    }

    /**
     * Copy output text
     */
    async copyOutputText() {
        if (!this.outputText.value) {
            this.showToast('Nothing to copy!', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.outputText.value);
            this.showToast('Copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            this.outputText.select();
            document.execCommand('copy');
            this.showToast('Copied to clipboard!');
        }
    }

    /**
     * Download output text
     */
    downloadOutputText() {
        if (!this.outputText.value) {
            this.showToast('Nothing to download!', 'warning');
            return;
        }

        const mode = this.conversionMode.value;
        const [from, to] = mode.split('-to-');
        const filename = `converted_${to}_${new Date().getTime()}.txt`;

        const blob = new Blob([this.outputText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('File downloaded!');
    }

    /**
     * Clear output text
     */
    clearOutputText() {
        this.outputText.value = '';
        this.updateCharCount();
    }

    /**
     * Update character count
     */
    updateCharCount() {
        const inputLength = this.inputText.value.length;
        const outputLength = this.outputText.value.length;

        this.inputCount.textContent = `${inputLength.toLocaleString()} characters`;
        this.outputCount.textContent = `${outputLength.toLocaleString()} characters`;

        // Warning for large input
        if (inputLength > 10000) {
            this.inputCount.style.color = 'var(--warning-color)';
            this.inputCount.textContent += ' (large input may be slow)';
        } else {
            this.inputCount.style.color = 'var(--text-secondary)';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorDisplay.style.display = 'flex';
    }

    /**
     * Hide error message
     */
    hideError() {
        this.errorDisplay.style.display = 'none';
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.convertBtn.classList.add('loading');
        this.convertBtn.textContent = 'Converting...';
        document.querySelector('.conversion-area').classList.add('converting');
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.convertBtn.classList.remove('loading');
        this.convertBtn.textContent = '🔄 Convert';
        document.querySelector('.conversion-area').classList.remove('converting');
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme === 'light' ? null : 'dark');
        this.darkModeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

        localStorage.setItem('darkMode', newTheme === 'dark');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Ctrl/Cmd + Enter to convert
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.performConversion();
        }

        // Escape to clear error
        if (e.key === 'Escape' && this.errorDisplay.style.display === 'flex') {
            this.hideError();
        }
    }

    /**
     * Debounce function for auto-conversion
     */
    debounceConversion() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performConversion();
        }, 500);
    }

    /**
     * Utility function to capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextConverter();
});

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}
