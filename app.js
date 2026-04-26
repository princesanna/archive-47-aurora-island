/**
 * ARCHIVE 47 | КОРНЕВОЙ ДВИЖОК
 */

const INITIAL_AURORA_STATE = {
    unlockedFiles: ['intro.sys'],
    currentFile: 'intro.sys',
    justice: 30,
    pressure: 10
};

const INITIAL_CHAINS_STATE = {
    character: null,
    inventory: [],
    paranoia: 0,
    clues: 0,
    currentNode: 'character_select'
};

const auroraData = {
    files: [
        {
            id: 'intro.sys',
            title: 'АРХИВ №47 - ИНИЦИАЛИЗАЦИЯ',
            folder: 'СИСТЕМА',
            content: `> СОЕДИНЕНИЕ УСТАНОВЛЕНО\n> АРХИВ №47: ОСТРОВ AURORA\n> СТАТУС: ПОЛНОСТЬЮ РАССЕКРЕЧЕНО\n> УРОВЕНЬ ДОСТУПА: АГЕНТ\n\nСпециальный агент, миру неизвестно, что произошло на острове Aurora два года назад.\nМассовое исчезновение 42 человек. Все пути ведут в один архив.`,
            choices: [{ text: '► НАЧАТЬ РАССЛЕДОВАНИЕ', next: 'memo_01.txt', unlock: 'memo_01.txt' }]
        },
        {
            id: 'memo_01.txt',
            title: 'СЛУЖЕБНАЯ ЗАПИСКА',
            folder: 'ДОКУМЕНТЫ',
            content: `СЛУЖЕБНАЯ ЗАПИСКА\nОт: Детектив Александр Морозов\n\nЯ нашел связь между исчезновениями на Aurora и финансовым отделом.\n<span class="redacted">они исчезали так же, как и люди</span>.`,
            choices: [
                { text: '► ПРОВЕРИТЬ ТРАНЗАКЦИИ', next: 'transactions.log', unlock: 'transactions.log' },
                { text: '► ПЕРЕЙТИ К ПЕРЕПИСКЕ', next: 'chat_001.log', unlock: 'chat_001.log' }
            ]
        },
        {
            id: 'transactions.log',
            title: 'БАНКОВСКИЕ ТРАНЗАКЦИИ',
            folder: 'ДОКУМЕНТЫ',
            content: `ОТЧЕТ О ФИНАНСОВЫХ ОПЕРАЦИЯХ\nСчет: AURORA-GOV-7734\n\n[2024-10-01] ⚠ ТЕХНИЧЕСКАЯ ОШИБКА НА ATOM-01\nСотрудников на месте: 42 человека.`,
            choices: [{ text: '► ПЕРЕПИСКА САФИНА', next: 'chat_001.log', unlock: 'chat_001.log' }]
        },
        {
            id: 'chat_001.log',
            title: 'ПЕРЕХВАЧЕННАЯ ПЕРЕПИСКА',
            folder: 'ПЕРЕПИСКИ',
            content: `Участники: ФИНАНСИСТ + НЕИЗВЕСТНЫЙ\n\nФИНАНСИСТ: После этого <span class="redacted">они должны исчезнуть</span>.`,
            choices: [{ text: '► МЕДИЦИНСКИЕ ЗАПИСИ', next: 'medical.txt', unlock: 'medical.txt' }]
        },
        {
            id: 'medical.txt',
            title: 'МЕДИЦИНСКИЕ ОТЧЕТЫ',
            folder: 'ДОКУМЕНТЫ',
            content: `КОМПЛЕКСНЫЙ МЕДИЦИНСКИЙ ОТЧЕТ\nВ крови жертв обнаружены следы <span class="redacted">снотворного (диазепам)</span>.`,
            choices: [{ text: '► ФИНАЛЬНОЕ РЕШЕНИЕ', next: 'final.exe', unlock: 'final.exe' }]
        },
        {
            id: 'final.exe',
            title: 'ФИНАЛЬНОЕ РЕШЕНИЕ',
            folder: 'СИСТЕМА',
            content: `ВЫ ОБЛАДАЕТЕ ПОЛНОЙ ИНФОРМАЦИЕЙ.\nВыберите судьбу архива:\n1. СПРАВЕДЛИВОСТЬ\n2. МОЛЧАНИЕ`,
            choices: [
                { text: '► СПРАВЕДЛИВОСТЬ', next: 'end_justice', effect: (s) => s.justice = 100 },
                { text: '► МОЛЧАНИЕ', next: 'end_silence', effect: (s) => s.pressure = 100 }
            ]
        },
        { id: 'end_justice', title: 'ФИНАЛ: СПРАВЕДЛИВОСТЬ', folder: 'АРХИВ', content: 'Преступники наказаны. Вы герой.', choices: [] },
        { id: 'end_silence', title: 'ФИНАЛ: МОЛЧАНИЕ', folder: 'АРХИВ', content: 'Вы богаты, но совесть не дает покоя.', choices: [] }
    ]
};

const chainsData = {
    nodes: {
        'character_select': {
            text: "ВЫБЕРИТЕ ЛИЧНОСТЬ ДЛЯ ПРОНИКНОВЕНИЯ:\n\n1. ЖУРНАЛИСТ — имеет скрытый диктофон. Бонус к поиску улик.\n2. ЗВЕЗДА — имеет VIP-пропуск. Легкий доступ в закрытые зоны.\n3. БЫВШИЙ ОХРАННИК — имеет отмычки. Легко вскрывает замки.",
            choices: [
                { text: "ВЫБРАТЬ: ЖУРНАЛИСТ", next: 'intro', effect: (s) => { s.character = 'Журналист'; s.inventory.push('Диктофон'); } },
                { text: "ВЫБРАТЬ: ЗВЕЗДА", next: 'intro', effect: (s) => { s.character = 'Звезда'; s.inventory.push('VIP-пропуск'); } },
                { text: "ВЫБРАТЬ: ОХРАННИК", next: 'intro', effect: (s) => { s.character = 'Охранник'; s.inventory.push('Отмычки'); } }
            ]
        },
        'intro': {
            text: "Особняк Магната утопает в роскоши. В воздухе пахнет дорогим парфюмом и опасностью. Вы проходите через главный вход.\n\nВаша цель — найти список гостей закрытой секции.",
            choices: [
                { text: "Подняться на второй этаж (Скрытность)", next: 'search' },
                { text: "Пройти к бару (Социализация)", next: 'bar' },
                { text: "Осмотреть фуршетные столы", next: 'buffet', effect: (s) => { s.inventory.push('Снотворное'); game.notify('Вы нашли СНОТВОРНОЕ', 'info'); } }
            ]
        },
        'buffet': {
            text: "Вы делаете вид, что выбираете закуски, и незаметно прячете в карман пузырек со снотворным. Это может пригодиться.\n\nКуда теперь?",
            choices: [
                { text: "На второй этаж", next: 'search' },
                { text: "К барной стойке", next: 'bar' }
            ]
        },
        'search': { 
            text: "Второй этаж патрулируется. Вы видите массивную дубовую дверь кабинета.", 
            choices: [
                { text: "Проскользнуть мимо патруля", next: 'check_lock', chance: 70, failNext: 'caught_interrogation', failEffect: (s) => s.paranoia += 30 },
                { text: "Подлить снотворное в бокал охранника", next: 'sleep_guard', condition: (s) => s.inventory.includes('Снотворное') },
                { text: "Спрятаться в тени, ждать", next: 'hide', effect: (s) => s.clues += 5 }
            ] 
        },
        'caught_interrogation': {
            text: "ОХРАННИК: 'Эй! Что вы здесь делаете? Этот этаж закрыт для гостей!'\n\nОн кладет руку на кобуру. Нужно срочно что-то придумать.",
            choices: [
                { text: "Блефовать: 'Я ищу уборную'", next: 'check_lock', chance: 40, failNext: 'arrest', failEffect: (s) => s.paranoia += 50 },
                { text: "Предъявить VIP-пропуск", next: 'check_lock', condition: (s) => s.character === 'Звезда', effect: (s) => game.notify('Он извиняется и пропускает вас', 'info') },
                { text: "Попробовать оглушить его", next: 'check_lock', chance: 20, failNext: 'arrest', failEffect: (s) => s.paranoia = 100 }
            ]
        },
        'arrest': { text: "Вас грубо хватают и уводят в подвал. Ваше расследование бесславно завершено.", choices: [{ text: "ЗАНОВО", next: 'reset' }] },
        'sleep_guard': {
            text: "Вы мастерски отвлекаете охранника и добавляете препарат в его напиток. Спустя пару минут он начинает клевать носом.",
            choices: [{ text: "Обыскать спящего охранника", next: 'rob_guard', effect: (s) => { s.inventory.push('Ключ-карта'); game.notify('Получена КЛЮЧ-КАРТА', 'info'); } }]
        },
        'rob_guard': {
            text: "Теперь у вас есть доступ к служебным помещениям.",
            choices: [{ text: "Войти в кабинет", next: 'hack' }]
        },
        'check_lock': {
            text: "Замок сложный. Без инструментов его не вскрыть тихо.",
            choices: [
                { text: "Использовать отмычки (Охранник)", next: 'safe_mini_1', condition: (s) => s.character === 'Охранник' },
                { text: "Использовать ключ-карту", next: 'hack', condition: (s) => s.inventory.includes('Ключ-карта') },
                { text: "Попробовать выбить (Шумно)", next: 'kick', effect: (s) => s.paranoia += 40 },
                { text: "Вернуться назад", next: 'intro' }
            ]
        },
        // Мини-игра: Взлом сейфа
        'safe_mini_1': {
            text: "ВЗЛОМ: ШАГ 1/3\nВы вставляете отмычку. Чувствуете три пина. Какой нажать первым?",
            choices: [
                { text: "Верхний левый", next: 'safe_mini_2', chance: 90, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 10 },
                { text: "Нижний", next: 'safe_mini_2', chance: 50, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 20 }
            ]
        },
        'safe_mini_2': {
            text: "ВЗЛОМ: ШАГ 2/3\nВторой пин сопротивляется. Нужно больше усилия?",
            choices: [
                { text: "Нажать плавно", next: 'safe_mini_3', chance: 80, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 15 },
                { text: "Нажать резко", next: 'safe_mini_3', chance: 40, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 30 }
            ]
        },
        'safe_mini_3': {
            text: "ВЗЛОМ: ШАГ 3/3\nПоследний поворот.",
            choices: [
                { text: "По часовой стрелке", next: 'hack', chance: 95, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 40 },
                { text: "Против часовой", next: 'hack', chance: 30, failNext: 'safe_mini_1', failEffect: (s) => s.paranoia += 50 }
            ]
        },
        'bar': { 
            text: "У бара вы замечаете мужчину в дорогом костюме, который нервно теребит запонку. Это личный помощник Магната.", 
            choices: [
                { text: "Подслушать разговор (Диктофон)", next: 'record', condition: (s) => s.character === 'Журналист' },
                { text: "Подойти и представиться", next: 'talk_mini_1', chance: 60, failNext: 'talk_fail', failEffect: (s) => s.paranoia += 20 },
                { text: "Пройти в VIP-зону (VIP-пропуск)", next: 'vip_lounge', condition: (s) => s.character === 'Звезда' }
            ] 
        },
        // Мини-игра: Диалог
        'talk_mini_1': {
            text: "МАНИПУЛЯЦИЯ: ШАГ 1/2\nПомощник смотрит на вас с подозрением. 'Мы знакомы?'",
            choices: [
                { text: "Я от службы кейтеринга", next: 'talk_mini_2', condition: (s) => s.inventory.includes('Снотворное'), chance: 80, failNext: 'talk_fail' },
                { text: "Я старый друг Магната", next: 'talk_mini_2', chance: 30, failNext: 'talk_fail' }
            ]
        },
        'talk_mini_2': {
            text: "МАНИПУЛЯЦИЯ: ШАГ 2/2\n'Кейтеринг? Почему вы не в форме?'",
            choices: [
                { text: "У меня спецзадание от Магната", next: 'talk_success', chance: 70, failNext: 'talk_fail' },
                { text: "Моя форма испачкалась", next: 'talk_success', chance: 20, failNext: 'talk_fail' }
            ]
        },
        'talk_success': {
            text: "Помощник расслабляется. 'Ладно, берите этот ключ от подсобки и не мешайтесь'.",
            choices: [{ text: "Взять ключ", next: 'follow', effect: (s) => { s.inventory.push('Ключ-карта'); s.clues += 20; } }]
        },
        'talk_fail': { text: "Его подозрения только усилились. Охрана теперь следит за вами.", choices: [{ text: "Уйти", next: 'intro' }] },

        'record': {
            text: "Диктофон в кармане фиксирует шепот: '...груз с Авроры прибудет в полночь. Остров должен оставаться закрытым'.",
            choices: [{ text: "Продолжить сбор данных", next: 'follow', effect: (s) => s.clues += 25 }]
        },
        'vip_lounge': {
            text: "Охрана кланяется, видя ваш пропуск. Внутри VIP-зала вы видите Магната, склонившегося над картой островов.",
            choices: [
                { text: "Сфотографировать карту незаметно", next: 'map', chance: 75, failNext: 'magnate_office', failEffect: (s) => s.paranoia += 20 },
                { text: "Подойти к нему", next: 'magnate_office' }
            ]
        },
        'follow': {
            text: "Вы следуете за официантом в служебный коридор. Там вы находите пост охраны с мониторами.",
            choices: [
                { text: "Использовать USB-флешку", next: 'room', condition: (s) => s.inventory.includes('USB-флешка'), chance: 90, failNext: 'escape_run' },
                { text: "Обыскать стол охранника", next: 'search_desk', effect: (s) => { s.inventory.push('USB-флешка'); game.notify('Найдена ФЛЕШКА', 'info'); } },
                { text: "Наблюдать со стороны", next: 'they', effect: (s) => s.clues += 10 }
            ]
        },
        'search_desk': {
            text: "Вы находите зашифрованную флешку. Это может содержать доказательства преступлений на Авроре.",
            choices: [{ text: "Вернуться в коридор", next: 'follow' }]
        },
        'hack': { 
            text: "Щелчок — и вы внутри. Кабинет завален документами. На столе лежит список гостей с пометками 'ЛИКВИДИРОВАТЬ'.", 
            choices: [{ text: "Забрать список", next: 'desk', effect: (s) => s.clues += 40 }] 
        },
        'kick': {
            text: "Удар! Дверь открывается, но срабатывает сигнализация. У вас есть секунды.",
            choices: [{ text: "Хватать бумаги и бежать", next: 'escape_run', effect: (s) => s.paranoia += 50 }]
        },
        'desk': { 
            text: "Вы нашли ключ к разгадке. Но вдруг дверь открывается. Это сам Магнат. С пистолетом.", 
            choices: [{ text: "Предложить сделку", next: 'confrontation' }, { text: "Напасть", next: 'attack' }] 
        },
        'magnate_office': {
            text: "Магнат оборачивается. 'А, это вы. Я ожидал вашего визита. Вы слишком любопытны для своего же блага'.",
            choices: [{ text: "Потребовать ответов", next: 'confrontation' }]
        },
        'confrontation': {
            text: "Магнат усмехается. 'Аврора была лишь началом. На кону миллиарды. Что вы выберете: истину или жизнь?'",
            choices: [
                { text: "Опубликовать данные (Требует 60 улик)", next: 'end_exposure', condition: (s) => s.clues >= 60, chance: 80, failNext: 'end_escape' },
                { text: "Взять деньги и молчать", next: 'end_bribe' },
                { text: "Попробовать сбежать", next: 'end_escape', chance: 50, failNext: 'arrest' }
            ]
        },
        'attack': { text: "Вы бросаетесь на него, но охрана врывается в комнату раньше. Вы проиграли.", choices: [{ text: "ЗАНОВО", next: 'reset' }] },
        'room': { text: "Вы подключаете флешку. На экране мелькают записи с камер на Авроре. Вы видите, как людей погружают в контейнеры.", choices: [{ text: "Забрать данные и уйти", next: 'confrontation', effect: (s) => s.clues += 50 }] },
        'they': { text: "'Они' — это те, кто спонсирует этот архив. Вы слишком глубоко зашли.", choices: [{ text: "Продолжить", next: 'confrontation' }] },
        'map': { text: "Карта раскрывает координаты секретной лаборатории. Теперь у вас есть всё.", choices: [{ text: "Уйти незаметно", next: 'confrontation' }] },
        
        'end_exposure': { 
            text: "ФИНАЛ: РАЗОБЛАЧЕНИЕ\n\nВы передали данные прессе. Акции Магната рухнули, началось международное расследование. Остров Аврора снова в заголовках.", 
            choices: [{ text: "ВЕРНУТЬСЯ В ХАБ", next: 'hub_return' }] 
        },
        'end_bribe': { 
            text: "ФИНАЛ: ЗОЛОТАЯ КЛЕТКА\n\nВы получили чек на 10 миллионов. Теперь вы живете в роскоши, но каждый шорох за спиной заставляет вас вздрагивать. Вы — соучастник.", 
            choices: [{ text: "ВЕРНУТЬСЯ В ХАБ", next: 'hub_return' }] 
        },
        'end_escape': { 
            text: "ФИНАЛ: ТЕНЬ\n\nВы сбежали, но улик недостаточно для суда. Магнат всё еще на свободе, и теперь он знает ваше имя. Начинается долгая игра в кошки-мышки.", 
            choices: [{ text: "ВЕРНУТЬСЯ В ХАБ", next: 'hub_return' }] 
        },
        'escape_run': {
            text: "Вы выпрыгиваете в окно, преследуемый охраной. В руках — обрывки документов.",
            choices: [{ text: "Скрыться в ночи", next: 'end_escape' }]
        }
    }
};

// === ДВИЖОК ===
class ArchiveEngine {
    constructor() {
        this.state = {
            mode: 'hub',
            aurora: JSON.parse(JSON.stringify(INITIAL_AURORA_STATE)),
            chains: JSON.parse(JSON.stringify(INITIAL_CHAINS_STATE))
        };
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
        this.state.mode = 'hub';
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('hub-screen').classList.remove('hidden');
        document.getElementById('investigation-screen').classList.add('hidden');
    }

    startCase(caseId) {
        this.state.mode = caseId;
        document.getElementById('hub-screen').classList.add('hidden');
        document.getElementById('investigation-screen').classList.remove('hidden');
        
        document.getElementById('active-case-id').textContent = caseId === 'aurora' ? 'FILE_01' : 'FILE_02';
        document.getElementById('active-case-title').textContent = caseId === 'aurora' ? 'ОСТРОВ АВРОРА' : 'ЗОЛОТЫЕ ЦЕПИ';

        if (caseId === 'aurora') {
            document.getElementById('sidebar-aurora').classList.remove('hidden');
            document.getElementById('sidebar-chains').classList.add('hidden');
            this.renderAuroraFile(this.state.aurora.currentFile);
        } else {
            document.getElementById('sidebar-aurora').classList.add('hidden');
            document.getElementById('sidebar-chains').classList.remove('hidden');
            this.renderChainsNode(this.state.chains.currentNode);
        }
    }

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

    resetCurrentArchive() {
        if (!confirm('Сбросить прогресс?')) return;
        if (this.state.mode === 'aurora') {
            this.state.aurora = JSON.parse(JSON.stringify(INITIAL_AURORA_STATE));
            this.startCase('aurora');
        } else {
            this.state.chains = JSON.parse(JSON.stringify(INITIAL_CHAINS_STATE));
            this.startCase('chains');
        }
    }

    fullSystemReset() {
        if (confirm('Полный сброс системы?')) location.reload();
    }

    // --- АВРОРА ---
    renderFileTree() {
        const tree = document.getElementById('file-tree');
        tree.innerHTML = '';
        const folders = {};
        auroraData.files.forEach(f => {
            if (!folders[f.folder]) folders[f.folder] = [];
            folders[f.folder].push(f);
        });

        Object.keys(folders).forEach(fName => {
            const h = document.createElement('div');
            h.className = 'file-folder-header';
            h.textContent = fName;
            tree.appendChild(h);

            folders[fName].forEach(file => {
                const item = document.createElement('div');
                const isUnlocked = this.state.aurora.unlockedFiles.includes(file.id);
                item.className = `file-item ${isUnlocked ? '' : 'locked'} ${this.state.aurora.currentFile === file.id ? 'active' : ''}`;
                item.textContent = file.title;
                item.onclick = () => isUnlocked && this.renderAuroraFile(file.id);
                tree.appendChild(item);
            });
        });
    }

    renderAuroraFile(fileId) {
        this.state.aurora.currentFile = fileId;
        const file = auroraData.files.find(f => f.id === fileId);
        if (!file) return;

        document.getElementById('scene-container').innerHTML = `<div class="scene-text">${file.content}</div>`;
        const choices = document.getElementById('choices-container');
        choices.innerHTML = '';

        file.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c.text;
            btn.onclick = () => {
                if (c.unlock && !this.state.aurora.unlockedFiles.includes(c.unlock)) {
                    this.state.aurora.unlockedFiles.push(c.unlock);
                    this.notify('НОВЫЙ ФАЙЛ ДОСТУПЕН', 'info');
                }
                if (c.effect) c.effect(this.state.aurora);
                this.renderAuroraFile(c.next);
            };
            choices.appendChild(btn);
        });

        this.renderFileTree();
        this.updateStats();
        this.setupRedacted();
    }

    // --- ЦЕПИ ---
    renderChainsNode(nodeId) {
        if (nodeId === 'hub_return') return this.showHub();
        if (nodeId === 'reset') { this.state.chains = JSON.parse(JSON.stringify(INITIAL_CHAINS_STATE)); nodeId = 'character_select'; }
        
        this.state.chains.currentNode = nodeId;
        const node = chainsData.nodes[nodeId];
        if (!node) return console.error('Node not found:', nodeId);
        
        let dynamicText = node.text;
        if (this.state.chains.paranoia > 60) dynamicText += "\n\n[ ВЫ ЧУВСТВУЕТЕ ТЯЖЕЛЫЙ ВЗГЛЯД ОХРАНЫ НА СЕБЕ. ВРЕМЯ НА ИСХОДЕ. ]";
        
        const container = document.getElementById('scene-container');
        container.innerHTML = `<div class="scene-text">${dynamicText}</div>`;
        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';

        node.choices.forEach(c => {
            if (c.condition && !c.condition(this.state.chains)) return;
            
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c.text + (c.chance ? ` (${c.chance}%)` : '');
            btn.onclick = () => {
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 500);

                if (c.chance) {
                    if (this.rollDice(c.chance)) {
                        if (c.effect) c.effect(this.state.chains);
                        this.renderChainsNode(c.next);
                    } else {
                        if (c.failEffect) c.failEffect(this.state.chains);
                        this.renderChainsNode(c.failNext || nodeId);
                    }
                } else {
                    if (c.effect) c.effect(this.state.chains);
                    this.renderChainsNode(c.next);
                }
            };
            choicesContainer.appendChild(btn);
        });
        
        this.updateStats();
        
        const vignette = document.getElementById('danger-vignette');
        if (this.state.chains.paranoia > 50) vignette.classList.remove('hidden');
        else vignette.classList.add('hidden');

        if (this.state.chains.paranoia >= 100) {
            this.notify('СИСТЕМА ОБНАРУЖЕНИЯ: 100%. ПРОВАЛ.', 'danger');
            setTimeout(() => this.renderChainsNode('reset'), 1500);
        }
    }

    setupRedacted() {
        document.querySelectorAll('.redacted').forEach(el => {
            el.onclick = () => {
                if (!el.classList.contains('revealed')) {
                    el.classList.add('revealed');
                    this.state.aurora.justice = Math.min(100, this.state.aurora.justice + 5);
                    this.notify('ДАННЫЕ ВОССТАНОВЛЕНЫ', 'info');
                    this.updateStats();
                }
            };
        });
    }

    updateStats() {
        if (this.state.mode === 'aurora') {
            const j = document.getElementById('justice-bar');
            j.style.width = this.state.aurora.justice + '%';
            j.classList.add('stat-pulsing'); setTimeout(() => j.classList.remove('stat-pulsing'), 500);

            document.getElementById('pressure-bar').style.width = this.state.aurora.pressure + '%';
        } else {
            document.getElementById('paranoia-bar').style.width = this.state.chains.paranoia + '%';
            document.getElementById('clues-bar').style.width = this.state.chains.clues + '%';
            const inv = document.getElementById('inventory-list');
            inv.innerHTML = '';
            this.state.chains.inventory.forEach(i => {
                const li = document.createElement('li');
                li.textContent = i;
                inv.appendChild(li);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.game = new ArchiveEngine(); });
