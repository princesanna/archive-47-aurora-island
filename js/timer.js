/**
 * Archive 47 - Game Timer Module
 * Управление игровым временем и событиями.
 */
class GameTimer {
    constructor(displayId) {
        this.display = document.getElementById(displayId);
        this.hours = 20;
        this.minutes = 0;
        this.isRunning = false;
        this.interval = null;

        this.updateDisplay();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.advanceTime(1);
        }, 10000); // 1 игровая минута = 10 реальных секунд (для теста)
    }

    stop() {
        this.isRunning = false;
        clearInterval(this.interval);
    }

    advanceTime(mins) {
        this.minutes += mins;
        while (this.minutes >= 60) {
            this.minutes -= 60;
            this.hours += 1;
        }

        if (this.hours >= 24) {
            this.hours = 0;
            this.triggerMidnight();
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const h = String(this.hours).padStart(2, '0');
        const m = String(this.minutes).padStart(2, '0');
        if (this.display) {
            this.display.textContent = `${h}:${m}`;
        }
    }

    triggerMidnight() {
        console.log("CRITICAL EVENT: MIDNIGHT REACHED.");
        if (window.game) {
            window.game.notify("КРИТИЧЕСКОЕ СОБЫТИЕ: ПОЛНОЧЬ!", "danger");
        }
        // Здесь можно добавить логику завершения игры или спец. событие
    }
}

window.GameTimer = GameTimer;
