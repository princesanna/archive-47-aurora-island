/**
 * Archive 47 - Terminal Module
 * Логика командной строки и симуляция хакинга.
 */
class Terminal {
    constructor(containerId, inputId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.history = [];
        this.commands = {
            'help': () => this.showHelp(),
            'scan network': () => this.scanNetwork(),
            'decrypt file_01': () => this.decryptFile('file_01'),
            'clear': () => this.clear()
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim().toLowerCase();
                this.execute(cmd);
                this.input.value = '';
            }
        });
        
        this.print("ARCHIVE 47 OS [Version 10.0.47]", "system");
        this.print("System integrity: 98%. Connection: SECURE.", "system");
        this.print("Type 'help' to see available commands.", "info");
    }

    execute(cmd) {
        if (!cmd) return;
        this.print(`> ${cmd}`, "user");

        if (this.commands[cmd]) {
            this.commands[cmd]();
        } else {
            this.print(`Unknown command: ${cmd}`, "error");
            // Штраф по времени за ошибку (если таймер подключен)
            if (window.gameTimer) {
                window.gameTimer.advanceTime(15);
                this.print("Time penalty: -15 minutes due to system error.", "warning");
            }
        }
        
        this.container.scrollTop = this.container.scrollHeight;
    }

    print(text, type = "default") {
        const line = document.createElement('div');
        line.className = `terminal-line line-${type}`;
        this.container.appendChild(line);
        
        // Эффект печатающегося текста
        let i = 0;
        const speed = 20;
        const typeWriter = () => {
            if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        typeWriter();
    }

    showHelp() {
        const helpText = [
            "Available commands:",
            "  help            - Show this list",
            "  scan network    - Scan for local IP addresses",
            "  decrypt [file]  - Attempt to decrypt a file",
            "  clear           - Clear terminal history"
        ];
        helpText.forEach(t => this.print(t, "info"));
    }

    scanNetwork() {
        this.print("Scanning network...", "system");
        setTimeout(() => {
            this.print("Found 3 active nodes:", "info");
            this.print("  192.168.1.104 [SECURE]", "default");
            this.print("  192.168.1.107 [VULNERABLE]", "warning");
            this.print("  10.0.0.47     [ENCRYPTED]", "error");
        }, 1000);
    }

    decryptFile(file) {
        if (file === 'file_01') {
            this.print("Decrypting file_01...", "system");
            setTimeout(() => {
                this.print("ACCESS GRANTED. LORE FRAGMENT:", "success");
                this.print("'The subject 47 was last seen entering the Aurora complex. No biometric signals since...'", "info");
            }, 1500);
        } else {
            this.print(`File not found: ${file}`, "error");
        }
    }

    clear() {
        this.container.innerHTML = '';
        this.print("Terminal cleared.", "system");
    }
}

// Экспортируем или инициализируем глобально
window.Terminal = Terminal;
