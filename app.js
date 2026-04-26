/**
 * ARCHIVE 47 | ГЛОБАЛЬНЫЙ НАРРАТИВНЫЙ СИНТЕЗ
 * Версия: 3.0 (Масштабная трилогия)
 */

// Глобальное состояние сессии, сохраняющееся между файлами
const SESSION = {
    character: null,
    inventory: [],
    clues: 0,
    auroraComplete: false,
    chainsComplete: false
};

const INITIAL_AURORA_STATE = {
    currentNode: 'intro',
    evidenceFound: []
};

const INITIAL_CHAINS_STATE = {
    paranoia: 0,
    clues: 0,
    currentNode: 'intro'
};

const INITIAL_PHANTOM_STATE = {
    integrity: 100,
    sync: 0,
    currentNode: 'start'
};

// --- FILE_01: ОСТРОВ АВРОРА (ПЕРЕРАБОТАНО В КВЕСТ) ---
const auroraData = {
    nodes: {
        'intro': {
            text: "ВЫ ПРИБЫЛИ НА ОСТРОВ АВРОРА.\n\nРуины научного комплекса 'ATOM-01' возвышаются над берегом как скелет доисторического чудовища. Здесь два года назад исчезли 42 человека. У вас есть приказ — найти истину.\n\nКак вы начнете поиск?",
            choices: [
                { text: "Искать свидетельские показания (Журналист)", next: 'aurora_jour_interviews', condition: (s) => SESSION.character === 'Журналист' },
                { text: "Запросить секретные архивы правительства (Звезда)", next: 'aurora_star_archives', condition: (s) => SESSION.character === 'Звезда' },
                { text: "Взломать периметр комплекса (Охранник)", next: 'aurora_guard_breach', condition: (s) => SESSION.character === 'Охранник' },
                { text: "Осмотреть береговую линию", next: 'aurora_shore' }
            ]
        },

        // Путь Журналиста
        'aurora_jour_interviews': {
            text: "Вы находите старого смотрителя маяка. Его глаза полны ужаса. 'Они не умерли', шепчет он. 'Они просто... перестали быть здесь'.",
            choices: [
                { text: "Записать его слова (Диктофон)", next: 'aurora_clue_1', effect: () => SESSION.clues += 20 },
                { text: "Показать ему фото пропавших", next: 'aurora_photo_match' }
            ]
        },
        'aurora_clue_1': {
            text: "Слова старика подтверждают теорию о портале. Вы находите обрывок кода: 'ALPHA-77'. Это может пригодиться позже.",
            choices: [{ text: "Продолжить", next: 'aurora_final', effect: () => SESSION.inventory.push('Код ALPHA-77') }]
        },

        // Путь Звезды
        'aurora_star_archives': {
            text: "Используя свои связи в министерстве, вы получаете зашифрованную папку. В ней отчеты о странных выбросах энергии за неделю до инцидента.",
            choices: [
                { text: "Анализировать финансовые потоки", next: 'aurora_finance', effect: () => SESSION.clues += 30 },
                { text: "Найти список инвесторов", next: 'aurora_clue_2' }
            ]
        },
        'aurora_clue_2': {
            text: "В списке инвесторов вы видите фамилию Магната из FILE_02. Теперь связь очевидна.",
            choices: [{ text: "Забрать документы", next: 'aurora_final', effect: () => { SESSION.inventory.push('Досье Магната'); SESSION.clues += 20; } }]
        },

        // Путь Охранника
        'aurora_guard_breach': {
            text: "Вы обходите датчики движения и вскрываете дверь в блок управления. Внутри пахнет озоном и горелой проводкой.",
            choices: [
                { text: "Скачать логи безопасности", next: 'aurora_logs', chance: 85, failNext: 'aurora_alarm' },
                { text: "Осмотреть реакторный зал", next: 'aurora_reactor' }
            ]
        },
        'aurora_logs': {
            text: "Логи показывают, что система безопасности была отключена ИЗНУТРИ за минуту до исчезновения. Кто-то помог им.",
            choices: [{ text: "Забрать ключ-карту доступа", next: 'aurora_final', effect: () => SESSION.inventory.push('Мастер-ключ') }]
        },

        'aurora_shore': { text: "На берегу вы находите выброшенный на песок пропуск одного из сотрудников. Он выглядит так, будто пролежал в кислоте.", choices: [{ text: "Вернуться к входу", next: 'intro' }] },
        'aurora_alarm': { text: "Сработала ловушка! Автоматические турели активированы. Вам пришлось бежать, бросив всё.", choices: [{ text: "ПОПРОБОВАТЬ СНОВА", next: 'reset' }] },
        
        'aurora_final': {
            text: "Первый этап завершен. У вас достаточно данных, чтобы понять — Аврора была лишь полигоном. Настоящая игра разворачивается в особняке Магната.\n\nFILE_01 ЗАВЕРШЕН.",
            choices: [{ text: "ВЕРНУТЬСЯ В ХАБ", next: 'hub_return', effect: () => SESSION.auroraComplete = true }]
        }
    }
};

// --- FILE_02: ЗОЛОТЫЕ ЦЕПИ (ОБНОВЛЕНО С УЧЕТОМ FILE_01) ---
const chainsData = {
    nodes: {
        'intro': {
            text: "ВТОРОЙ ЭТАП: ОСОБНЯК МАГНАТА.\n\nВы стоите перед массивными воротами. Атмосфера праздника скрывает запах крови и заговора.",
            choices: [
                { text: "Использовать 'Код ALPHA-77'", next: 'chains_secret_door', condition: () => SESSION.inventory.includes('Код ALPHA-77') },
                { text: "Предъявить 'Мастер-ключ'", next: 'chains_guard_hack', condition: () => SESSION.inventory.includes('Мастер-ключ') },
                { text: "Проникнуть стандартным путем", next: 'chains_standard' }
            ]
        },
        'chains_secret_door': {
            text: "Код из FILE_01 открывает потайной люк в саду. Вы оказываетесь прямо в подвале, минуя охрану.",
            choices: [{ text: "Обыскать подвал", next: 'chains_basement', effect: (s) => s.clues += 50 }]
        },
        'chains_standard': {
            text: "Вы проходите через главный вход. Охрана подозрительно осматривает гостей.",
            choices: [
                { text: "Блефовать (Журналист)", next: 'chains_jour_path', condition: () => SESSION.character === 'Журналист' },
                { text: "Очаровать (Звезда)", next: 'chains_star_path', condition: () => SESSION.character === 'Звезда' },
                { text: "Отвлечь (Охранник)", next: 'chains_guard_path', condition: () => SESSION.character === 'Охранник' }
            ]
        },
        // ... (Пути персонажей из предыдущей итерации, но с интеграцией Legacy)
        'chains_jour_path': { text: "Вы проходите как пресса. Камеры здесь запрещены, но ваш диктофон готов.", choices: [{ text: "Искать кабинет", next: 'chains_office' }] },
        'chains_star_path': { text: "Вы — душа компании. Магнат лично приветствует вас.", choices: [{ text: "Соблазнить Магната", next: 'chains_office' }] },
        'chains_guard_path': { text: "Вы знаете, где стоят датчики. Вы — тень в этом доме.", choices: [{ text: "Взломать систему", next: 'chains_office' }] },
        
        'chains_office': {
            text: "В кабинете вы находите подтверждение: Магнат строит ВТОРОЙ ЯКОРЬ прямо под особняком. Аврора повторяется.",
            choices: [{ text: "Забрать данные и бежать", next: 'chains_final' }]
        },
        'chains_final': {
            text: "Вы получили всё, что нужно. Но Магнат знает ваше лицо. Время уходить в цифровую тень.\n\nFILE_02 ЗАВЕРШЕН.",
            choices: [{ text: "ВЕРНУТЬСЯ В ХАБ", next: 'hub_return', effect: () => SESSION.chainsComplete = true }]
        }
    }
};

// --- FILE_03: ФАНТОМНЫЙ ПРОТОКОЛ (ГЛОБАЛЬНЫЙ ФИНАЛ) ---
const phantomData = {
    nodes: {
        'start': {
            text: "ФИНАЛЬНЫЙ ЭТАП: СИНХРОНИЗАЦИЯ.\n\nВы подключаетесь к ядру системы. Теперь ваши действия в FILE_01 и FILE_02 определят исход всего человечества.",
            choices: [
                { text: "Загрузить данные Авроры", next: 'phantom_sync', condition: () => SESSION.auroraComplete },
                { text: "Загрузить данные Магната", next: 'phantom_sync', condition: () => SESSION.chainsComplete }
            ]
        },
        'phantom_sync': {
            text: "Синхронизация: " + SESSION.clues + " улик собрано. Система анализирует вашу личность...",
            choices: [
                { text: "Принять истину", next: 'phantom_truth', timer: 5 },
                { text: "Уничтожить систему", next: 'phantom_void', timer: 5 }
            ]
        },
        'phantom_truth': {
            text: "ВЫВОД СИСТЕМЫ: Вы " + SESSION.character + ". Ваша тяга к правде изменила мир.",
            choices: [{ text: "ПОКАЗАТЬ ФИНАЛ", next: 'mega_ending' }]
        },
        'mega_ending': {
            text: "ГЛОБАЛЬНЫЙ ФИНАЛ: " + (SESSION.clues > 100 ? "ЗОЛОТОЙ ВЕК" : "ЦИФРОВОЙ ХАОС") + "\n\nВаша роль: " + SESSION.character + ".\nСобрано улик: " + SESSION.clues + ".\n\nСпасибо за игру в Archive 47.",
            choices: [{ text: "В НАЧАЛО (СБРОС ВСЕГО)", next: 'full_reset' }]
        }
    }
};

// === ДВИЖОК ===
class ArchiveEngine {
    constructor() {
        this.state = {
            mode: 'hub',
            aurora: JSON.parse(JSON.stringify(INITIAL_AURORA_STATE)),
            chains: JSON.parse(JSON.stringify(INITIAL_CHAINS_STATE)),
            phantom: JSON.parse(JSON.stringify(INITIAL_PHANTOM_STATE))
        };
        this.timer = null;
        this.terminal = null;
        this.deduction = null;
        this.explorer = null;
        this.gameTimer = null;
        this.init();
    }

    init() { this.setupBoot(); }

    setupBoot() {
        const bar = document.getElementById('bootProgress');
        let p = 0;
        const it = setInterval(() => {
            p += 25;
            if (p >= 100) { p = 100; clearInterval(it); setTimeout(() => this.showHub(), 400); }
            if (bar) bar.style.width = p + '%';
        }, 80);
    }

    showHub() {
        this.clearTimer();
        this.state.mode = 'hub';
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('hub-screen').classList.remove('hidden');
        document.getElementById('investigation-screen').classList.add('hidden');
        document.getElementById('os-screen').classList.add('hidden');
        this.updateHubStatus();
    }

    showOS() {
        this.bootOS();
    }

    bootOS() {
        const overlay = document.getElementById('os-boot-overlay');
        const log = document.getElementById('boot-log');
        overlay.classList.remove('hidden');
        log.innerHTML = '';
        
        const lines = [
            "ARCHIVE_47 BIOS v4.0.7",
            "Checking memory... 640KB OK",
            "Initializing kernel...",
            "Loading terminal.exe...",
            "Loading explorer.sys...",
            "Connecting to neural_net... SUCCESS",
            "WELCOME, AGENT."
        ];

        let i = 0;
        const it = setInterval(() => {
            const l = document.createElement('div');
            l.className = 'boot-line';
            l.textContent = lines[i];
            log.appendChild(l);
            i++;
            if (i >= lines.length) {
                clearInterval(it);
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    this.finishOSBoot();
                }, 1000);
            }
        }, 300);
    }

    finishOSBoot() {
        this.state.mode = 'os';
        document.getElementById('hub-screen').classList.add('hidden');
        document.getElementById('investigation-screen').classList.add('hidden');
        document.getElementById('os-screen').classList.remove('hidden');

        if (!this.terminal) {
            this.terminal = new Terminal('terminal-history', 'terminal-input');
        }
        if (!this.deduction) {
            this.deduction = new DeductionBoard('deduction-board');
        }
        if (!this.explorer) {
            this.explorer = new FileExplorer('explorer-content');
        }
        if (!this.gameTimer) {
            this.gameTimer = new GameTimer('game-clock');
            window.gameTimer = this.gameTimer;
            this.gameTimer.start();
        }
        
        if (window.osCore) {
            window.osCore.openWindow('terminal-window-wrapper');
        }
    }

    updateHubStatus() {
        if (!SESSION.character) {
            document.querySelectorAll('.case-card').forEach(c => c.classList.add('locked'));
            this.showCharacterSelectInHub();
        } else {
            document.querySelectorAll('.case-card').forEach(c => c.classList.remove('locked'));
        }
    }

    showCharacterSelectInHub() {
        const grid = document.querySelector('.case-grid');
        if (document.getElementById('hub-char-select')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'hub-char-select';
        overlay.className = 'char-select-overlay';
        overlay.innerHTML = `
            <h2>ВЫБЕРИТЕ СВОЮ РОЛЬ В ТРИЛОГИИ</h2>
            <div class="char-options">
                <button onclick="game.selectGlobalChar('Журналист')">ЖУРНАЛИСТ</button>
                <button onclick="game.selectGlobalChar('Звезда')">ЗВЕЗДА</button>
                <button onclick="game.selectGlobalChar('Охранник')">ОХРАННИК</button>
            </div>
        `;
        document.getElementById('hub-screen').appendChild(overlay);
    }

    selectGlobalChar(char) {
        SESSION.character = char;
        this.notify('РОЛЬ ВЫБРАНА: ' + char.toUpperCase(), 'info');
        const overlay = document.getElementById('hub-char-select');
        if (overlay) overlay.remove();
        this.updateHubStatus();
    }

    startCase(caseId) {
        if (!SESSION.character) return this.notify('СНАЧАЛА ВЫБЕРИТЕ РОЛЬ', 'danger');
        this.state.mode = caseId;
        document.getElementById('hub-screen').classList.add('hidden');
        document.getElementById('investigation-screen').classList.remove('hidden');
        document.getElementById('active-case-id').textContent = caseId.toUpperCase();
        document.getElementById('active-case-title').textContent = caseId === 'aurora' ? 'ОСТРОВ АВРОРА' : (caseId === 'chains' ? 'ЗОЛОТЫЕ ЦЕПИ' : 'ФАНТОМНЫЙ ПРОТОКОЛ');
        ['aurora', 'chains', 'phantom'].forEach(id => document.getElementById(`sidebar-${id}`).classList.add('hidden'));
        document.getElementById(`sidebar-${caseId}`).classList.remove('hidden');

        if (caseId === 'aurora') this.renderAuroraNode(this.state.aurora.currentNode);
        else if (caseId === 'chains') this.renderChainsNode(this.state.chains.currentNode);
        else this.renderPhantomNode(this.state.phantom.currentNode);
    }

    // --- УНИФИЦИРОВАННЫЙ РЕНДЕР ---
    renderNode(data, nodeId, stateRef, nextFunc) {
        this.clearTimer();
        if (nodeId === 'hub_return') return this.showHub();
        if (nodeId === 'reset') { this.resetCurrentArchive(); return; }
        if (nodeId === 'full_reset') { location.reload(); return; }

        stateRef.currentNode = nodeId;
        const node = data.nodes[nodeId];
        const container = document.getElementById('scene-container');
        container.innerHTML = `<div class="scene-text ${this.state.phantom.integrity < 40 && this.state.mode === 'phantom' ? 'corrupted' : ''}">${node.text}</div>`;
        
        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';

        node.choices.forEach(c => {
            if (c.condition && !c.condition(stateRef)) return;
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c.text + (c.chance ? ` (${c.chance}%)` : '') + (c.timer ? ` [${c.timer}s]` : '');
            btn.onclick = () => {
                this.clearTimer();
                container.classList.add('shake'); setTimeout(() => container.classList.remove('shake'), 500);
                if (c.chance) {
                    if (this.rollDice(c.chance)) { if (c.effect) c.effect(stateRef); nextFunc(c.next); }
                    else { if (c.failEffect) c.failEffect(stateRef); nextFunc(c.failNext || nodeId); }
                } else { if (c.effect) c.effect(stateRef); nextFunc(c.next); }
            };
            choicesContainer.appendChild(btn);
        });

        const timed = node.choices.find(c => c.timer);
        if (timed) this.startChoiceTimer(timed.timer, () => nextFunc(timed.failNext || 'corruption_event'));

        this.updateStats();
    }

    renderAuroraNode(id) { this.renderNode(auroraData, id, this.state.aurora, (nid) => this.renderAuroraNode(nid)); }
    renderChainsNode(id) { this.renderNode(chainsData, id, this.state.chains, (nid) => this.renderChainsNode(nid)); }
    renderPhantomNode(id) { this.renderNode(phantomData, id, this.state.phantom, (nid) => this.renderPhantomNode(nid)); }

    notify(text, type = 'info') {
        const container = document.getElementById('game-notification');
        const item = document.createElement('div');
        item.className = `notif-item ${type}`;
        item.textContent = text;
        container.appendChild(item);
        setTimeout(() => item.remove(), 3000);
    }

    rollDice(chance) {
        const roll = Math.floor(Math.random() * 101);
        const success = roll <= chance;
        this.notify(`${success ? 'УСПЕХ' : 'ПРОВАЛ'} (${roll}% / ${chance}%)`, success ? 'info' : 'danger');
        return success;
    }

    clearTimer() {
        if (this.timer) { clearTimeout(this.timer); this.timer = null; }
        document.getElementById('choice-timer-container').classList.add('hidden');
        const bar = document.getElementById('choice-timer-bar');
        bar.style.animation = 'none';
    }

    startChoiceTimer(seconds, onTimeout) {
        this.clearTimer();
        const container = document.getElementById('choice-timer-container');
        const bar = document.getElementById('choice-timer-bar');
        container.classList.remove('hidden');
        bar.style.animation = `timerDecrease ${seconds}s linear forwards`;
        this.timer = setTimeout(() => { this.notify('ВРЕМЯ ИСТЕКЛО', 'danger'); onTimeout(); }, seconds * 1000);
    }

    resetCurrentArchive() {
        if (this.state.mode === 'aurora') this.state.aurora = JSON.parse(JSON.stringify(INITIAL_AURORA_STATE));
        else if (this.state.mode === 'chains') this.state.chains = JSON.parse(JSON.stringify(INITIAL_CHAINS_STATE));
        else this.state.phantom = JSON.parse(JSON.stringify(INITIAL_PHANTOM_STATE));
        this.startCase(this.state.mode);
    }

    fullSystemReset() { if (confirm('Полный сброс системы?')) location.reload(); }

    updateStats() {
        const m = this.state.mode;
        if (m === 'aurora') {
            document.getElementById('justice-bar').style.width = (SESSION.clues / 2) + '%';
            document.getElementById('pressure-bar').style.width = '0%';
        } else if (m === 'chains') {
            document.getElementById('paranoia-bar').style.width = this.state.chains.paranoia + '%';
            document.getElementById('clues-bar').style.width = (SESSION.clues / 2) + '%';
            const inv = document.getElementById('inventory-list'); inv.innerHTML = '';
            SESSION.inventory.forEach(i => { const li = document.createElement('li'); li.textContent = i; inv.appendChild(li); });
        } else if (m === 'phantom') {
            document.getElementById('integrity-bar').style.width = this.state.phantom.integrity + '%';
            document.getElementById('sync-bar').style.width = this.state.phantom.sync + '%';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.game = new ArchiveEngine(); });
