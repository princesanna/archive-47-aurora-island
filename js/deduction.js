/**
 * Archive 47 - Deduction Board Module
 * Механика Drag-and-Drop для комбинирования улик.
 */
class DeductionBoard {
    constructor(boardId) {
        this.board = document.getElementById(boardId);
        this.clues = [
            { id: 'clue_photo', name: 'Фото Магната', icon: '📸', description: 'Снимок сделан скрытой камерой. Магнат что-то передает человеку в плаще.' },
            { id: 'clue_invoice', name: 'Счет из отеля', icon: '📄', description: 'Оплачен наличными в день исчезновения. Номер 407.' },
            { id: 'clue_keycard', name: 'Ключ-карта', icon: '💳', description: 'Имеет логотип "ATOM-01". Видны следы взлома.' },
            { id: 'clue_map', name: 'Карта острова', icon: '🗺️', description: 'Старая морская карта с пометкой "X".' }
        ];
        
        this.combinations = {
            'clue_photo+clue_invoice': {
                newClue: { id: 'clue_address', name: 'Секретный адрес', icon: '📍', description: 'Адрес заброшенного склада на окраине.' },
                message: 'Счет подтверждает местоположение Магната на фото!'
            }
        };

        this.init();
    }

    init() {
        this.renderClues();
        this.setupEventListeners();
    }

    renderClues() {
        this.board.innerHTML = '';
        this.clues.forEach(clue => {
            const el = document.createElement('div');
            el.className = 'evidence-card';
            el.id = clue.id;
            el.draggable = true;
            el.innerHTML = `
                <div class="evidence-icon">${clue.icon}</div>
                <div class="evidence-name">${clue.name}</div>
            `;
            el.title = clue.description;
            this.board.appendChild(el);
        });
    }

    setupEventListeners() {
        this.board.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('evidence-card')) {
                e.dataTransfer.setData('text/plain', e.target.id);
                e.target.classList.add('dragging');
            }
        });

        this.board.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('evidence-card')) {
                e.target.classList.remove('dragging');
            }
        });

        this.board.addEventListener('dragover', (e) => {
            e.preventDefault(); // Разрешаем drop
        });

        this.board.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const targetEl = e.target.closest('.evidence-card');

            if (targetEl && targetEl.id !== draggedId) {
                this.tryCombine(draggedId, targetEl.id);
            }
        });
    }

    tryCombine(id1, id2) {
        const comboKey1 = `${id1}+${id2}`;
        const comboKey2 = `${id2}+${id1}`;
        const combo = this.combinations[comboKey1] || this.combinations[comboKey2];

        if (combo) {
            // Удаляем старые улики
            this.clues = this.clues.filter(c => c.id !== id1 && c.id !== id2);
            // Добавляем новую
            this.clues.push(combo.newClue);
            
            this.renderClues();
            this.showMessage(combo.message, "success");
            
            if (window.game) {
                window.game.notify("НОВАЯ УЛИКА: " + combo.newClue.name, "success");
            }
        } else {
            this.showMessage("Эти улики не связаны.", "error");
        }
    }

    showMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `board-message message-${type}`;
        msg.textContent = text;
        this.board.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }
}

window.DeductionBoard = DeductionBoard;
