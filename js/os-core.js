/**
 * Archive 47 - OS Core Module
 * Управление окнами, перетаскиванием и интерфейсом системы.
 */
class OSCore {
    constructor() {
        this.zIndex = 1000;
        this.openWindows = new Set();
        this.init();
    }

    init() {
        document.querySelectorAll('.os-window').forEach(win => {
            this.makeDraggable(win);
            win.addEventListener('mousedown', () => this.bringToFront(win));
        });

        // Клик по любому месту терминала фокусирует ввод
        const termContent = document.querySelector('.terminal-theme');
        if (termContent) {
            termContent.addEventListener('click', () => {
                const input = document.getElementById('terminal-input');
                if (input) input.focus();
            });
        }
    }

    openWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.classList.remove('hidden');
            this.bringToFront(win);
            this.openWindows.add(id);
            this.updateTaskbar();
            
            // Если открываем терминал, фокусим ввод
            if (id === 'terminal-window-wrapper') {
                setTimeout(() => document.getElementById('terminal-input').focus(), 100);
            }
        }
    }

    closeWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.classList.add('hidden');
            this.openWindows.delete(id);
            this.updateTaskbar();
        }
    }

    updateTaskbar() {
        const container = document.getElementById('taskbar-items');
        if (!container) return;
        container.innerHTML = '';
        
        this.openWindows.forEach(id => {
            const win = document.getElementById(id);
            const title = win.querySelector('.window-title').textContent;
            const item = document.createElement('div');
            item.className = 'task-item active';
            item.textContent = title;
            item.onclick = () => this.bringToFront(win);
            container.appendChild(item);
        });
    }

    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = (e) => {
            if (e.target.tagName === 'SPAN') return; // Не тащим за кнопки закрытия
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            this.bringToFront(el);
        };

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    bringToFront(el) {
        this.zIndex++;
        el.style.zIndex = this.zIndex;
        
        // Визуально выделяем активное окно в таскбаре
        document.querySelectorAll('.task-item').forEach(item => {
            if (item.textContent === el.querySelector('.window-title').textContent) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Глобальная инициализация
window.addEventListener('DOMContentLoaded', () => {
    window.osCore = new OSCore();
});
