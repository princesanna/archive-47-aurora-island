/* ========================================
   АРХИВ №47: ОСТРОВ AURORA
   Логика игры-расследования
   ======================================== */

// ===== БАЗА ДАННЫХ ИГРЫ =====
const gameData = {
    // Состояние игрока
    state: {
        unlockedFiles: ['intro.sys'],
        discoveredFacts: [],
        currentFile: 'intro.sys',
        ending: null,
        clickedRedacted: []
    },

    // Файлы и содержимое
    files: [
        {
            id: 'intro.sys',
            title: 'АРХИВ №47 - ИНИЦИАЛИЗАЦИЯ',
            folder: 'СИСТЕМА',
            content: `> СОЕДИНЕНИЕ УСТАНОВЛЕНО
> АРХИВ №47: ОСТРОВ AURORA
> СТАТУС: ПОЛНОСТЬЮ РАССЕКРЕЧЕНО
> УРОВЕНЬ ДОСТУПА: АГЕНТ

Специальный агент, миру неизвестно, что произошло на острове Aurora два года назад.
Массовое исчезновение 42 человек. Все пути ведут в один архив.

Финансовые махинации. Коррупция на высшем уровне. И один человек знал слишком много.

Твоя задача: изучить доказательства и принять решение о судьбе архива.

> ИНИЦИАЛИЗАЦИЯ ПОЛНА. ГОТОВ К РАБОТЕ.
`,
            requiredProgress: [],
            choices: [
                { text: '► НАЧАТЬ РАССЛЕДОВАНИЕ', action: 'unlockFile', target: 'memo_01.txt' }
            ]
        },

        {
            id: 'memo_01.txt',
            title: 'СЛУЖЕБНАЯ ЗАПИСКА',
            folder: 'ДОКУМЕНТЫ',
            content: `СЛУЖЕБНАЯ ЗАПИСКА
От: Детектив Александр Морозов
Дата: 15 октября 2024 г.
Статус: КОНФИДЕНЦИАЛЬНО

Коллеги, я нашел связь между исчезновениями на Aurora и финансовым отделом администрации.

Главный финансист Виктор Сафин совершал переводы денег на анонимные счета каждый месяц.
Сумма: 500 000 долларов ежемесячно. Всего за два года: 12 миллионов.

Источник: государственные контракты на оборону. Деньги должны были идти на развитие 
инфраструктуры острова Aurora, но вместо этого...

<span class="redacted">они исчезали так же, как и люди</span>.

На острове произошла <span class="redacted">авария на атомной станции</span>. Официально: 
"техническая ошибка". Неофициально: <span class="redacted">Сафин приказал скрыть доказательства, 
и 42 работника станции знали правду.</span>

Все они исчезли. И никто не искал их слишком усердно.

РЕКОМЕНДАЦИЯ: Требуется доступ к платежным документам за октябрь 2024 года.
Нужно заблокировать Сафина до того, как он переведет новую партию денег.

А.М.
`,
            requiredProgress: [],
            choices: [
                { text: '► ПРОВЕРИТЬ БАНКОВСКИЕ ТРАНЗАКЦИИ', action: 'unlockFile', target: 'transactions.log' },
                { text: '► ПЕРЕЙТИ К ПЕРЕПИСКЕ', action: 'unlockFile', target: 'chat_001.log' }
            ]
        },

        {
            id: 'transactions.log',
            title: 'БАНКОВСКИЕ ТРАНЗАКЦИИ',
            folder: 'ДОКУМЕНТЫ',
            content: `╔════════════════════════════════════════════════════╗
║        ОТЧЕТ О ФИНАНСОВЫХ ОПЕРАЦИЯХ               ║
║        Счет: AURORA-GOV-7734                       ║
║        Период: СЕНТЯБРЬ - ОКТЯБРЬ 2024            ║
╚════════════════════════════════════════════════════╝

[2024-09-15 09:23:44] ВХОДЯЩИЙ ПЕРЕВОД
Сумма: 1,200,000 USD
Источник: МИНОБОРОНЫ - Оборонный контракт
Описание: Финансирование проекта "Aurora Station"
Статус: ✓ ПРИНЯТО

[2024-09-16 14:05:12] ИСХОДЯЩИЙ ПЕРЕВОД
Сумма: 500,000 USD
Получатель: <span class="redacted">СЧЕТ SWVIFT-7891 (Люксембург)</span>
Инициатор: <span class="redacted">ВИКТОР САФИН</span>
Статус: ✓ УСПЕШНО

[2024-09-23 11:47:33] ИСХОДЯЩИЙ ПЕРЕВОД
Сумма: 500,000 USD
Получатель: <span class="redacted">СЧЕТ SWVIFT-7891 (Люксембург)</span>
Инициатор: <span class="redacted">ВИКТОР САФИН</span>
Статус: ✓ УСПЕШНО

[2024-10-01 08:15:20] КРИТИЧЕСКОЕ СОБЫТИЕ
⚠ ТЕХНИЧЕСКАЯ ОШИБКА НА ATOM-01
Мощность реактора: 150% (КРИТИЧНЫЙ УРОВЕНЬ)
Статус: <span class="redacted">АВТОМАТИЧЕСКОЕ ОТКЛЮЧЕНИЕ</span>
Время инцидента: 08:15:19 UTC
Сотрудников на месте: 42 человека
Эвакуация: <span class="redacted">НЕ ПРОВЕДЕНА</span>

[2024-10-02 16:22:55] ИСХОДЯЩИЙ ПЕРЕВОД
Сумма: 2,000,000 USD (СРОЧНЫЙ ПЕРЕВОД)
Получатель: <span class="redacted">СЧЕТ SWVIFT-9445 (Каймановы острова)</span>
Инициатор: <span class="redacted">ВИКТОР САФИН</span>
Описание: <span class="redacted">ЭКСТРЕННОЕ ФИНАНСИРОВАНИЕ</span>
Статус: ✓ УСПЕШНО

⚠ ПРИМЕЧАНИЕ: После инцидента на станции все документы по содержанию реактора
были <span class="redacted">удалены из системы</span>.

═════════════════════════════════════════════════════
ВЫВОД: Финансист Сафин совершил крупное растрату 
через два дня после смерти 42 человек.

Совпадение? Закрытие рта? 🔒
═════════════════════════════════════════════════════
`,
            requiredProgress: [],
            choices: [
                { text: '► ПОСМОТРЕТЬ ПЕРЕПИСКУ САФИНА', action: 'unlockFile', target: 'chat_001.log' },
                { text: '► ПЕРЕЙТИ К МЕДИЦИНСКИМ ЗАПИСЯМ', action: 'unlockFile', target: 'medical.txt' }
            ]
        },

        {
            id: 'chat_001.log',
            title: 'ПЕРЕХВАЧЕННАЯ ПЕРЕПИСКА',
            folder: 'ПЕРЕПИСКИ',
            content: `╔════════════════════════════════════════════════════╗
║     ЗАЩИЩЕННЫЙ КАНАЛ #AURORA-VIP-7774           ║
║     Участники: ФИНАНСИСТ + НЕИЗВЕСТНЫЙ          ║
║     Дата: 30 сентября - 3 октября 2024          ║
╚════════════════════════════════════════════════════╝

[30.09.2024 | 18:47] ФИНАНСИСТ:
Все готово на октябрь?

[30.09.2024 | 18:49] НЕИЗВЕСТНЫЙ (Х):
Да. Инженеры согласны молчать. 
Цена вопроса: <span class="redacted">каждому по 100 тыс</span>.

[30.09.2024 | 18:51] ФИНАНСИСТ:
Слишком дорого. Я могу заплатить максимум 50.

[30.09.2024 | 18:52] НЕИЗВЕСТНЫЙ (Х):
Они знают, что видели. Если они разговорят нас...
Для них это цена молчания.

[30.09.2024 | 18:54] ФИНАНСИСТ:
Ладно. Переводу 4.2 миллиона. После этого <span class="redacted">они должны 
исчезнуть</span>. Нету людей - нету свидетелей. Нету свидетелей - 
нету проблемы.

[01.10.2024 | 07:13] НЕИЗВЕСТНЫЙ (Х):
Готово. Эвакуация <span class="redacted">отменена</span> по твоему приказу.
Аварийные системы были <span class="redacted">деактивированы</span>.
Реактор выведет из строя все живое в радиусе 200 метров.

[01.10.2024 | 07:15] ФИНАНСИСТ:
Сколько?

[01.10.2024 | 07:16] НЕИЗВЕСТНЫЙ (Х):
Все 42. Красиво. Никаких следов. Техническая ошибка - 
лучший способ избавиться от проблемы.

[01.10.2024 | 08:01] ФИНАНСИСТ:
✓ Деньги переведены. Убедись, что это выглядит как случай.

[02.10.2024 | 22:33] НЕИЗВЕСТНЫЙ (Х):
Все отчеты переписаны. Инцидент классифицирован. 
Документы уничтожены. Мы чистые.

[03.10.2024 | 11:47] ФИНАНСИСТ:
Я уезжаю с архипелага на две недели. Когда вернусь, 
архив должен быть закрыт. Нельзя оставлять концы.
`,
            requiredProgress: [],
            choices: [
                { text: '► ПОСМОТРЕТЬ МЕДИЦИНСКИЕ ЗАПИСИ', action: 'unlockFile', target: 'medical.txt' },
                { text: '► ПЕРЕЙТИ К ИТОГОВОМУ ДОСЬЕ', action: 'unlockFile', target: 'final_decision.exe' }
            ]
        },

        {
            id: 'medical.txt',
            title: 'МЕДИЦИНСКИЕ ОТЧЕТЫ',
            folder: 'ДОКУМЕНТЫ',
            content: `КОМПЛЕКСНЫЙ МЕДИЦИНСКИЙ ОТЧЕТ
Объект: ОСТРОВ AURORA, АТОМНАЯ СТАНЦИЯ

Дата исследования: 5-10 октября 2024 г.
Исследователь: Др. Елена Ковалева, канд. мед. наук

═════════════════════════════════════════════════════

ЖЕРТВЫ И ОБСТОЯТЕЛЬСТВА:

На момент аварии на станции находилось 42 сотрудника.
Состояние тел указывает на <span class="redacted">воздействие 
ионизирующего излучения смертельной интенсивности</span>.

Рентгенологические данные:
- Острая лучевая болезнь, 4-я степень: 38 человек
- Полная деструкция внутренних органов: 42 человека
- Время смерти: <span class="redacted">от 3 до 8 минут после облучения</span>

ВЫВОД: Смерть наступила в результате <span class="redacted">преднамеренного 
отключения защитных систем реактора</span>, а не случайной технической ошибки.

═════════════════════════════════════════════════════

СКРЫТЫЕ ДОКАЗАТЕЛЬСТВА:

1. В крови трех жертв обнаружены следы <span class="redacted">снотворного 
вещества (диазепам, высокие концентрации)</span>
   → Жертвы были приведены в состояние седации перед облучением

2. На одежде и коже потерпевших найдены <span class="redacted">следы 
физического насилия</span>: ушибы, разрывы ткани, переломы

3. Анализ ДНК под ногтями жертвы #7 показал <span class="redacted">ДНК 
неизвестного мужского индивидуума</span>

МЕДИЦИНСКОЕ ЗАКЛЮЧЕНИЕ:
"Это не авария. Это расправа."

ДАЛЬНЕЙШАЯ СУДЬБА ЭТОГО ОТЧЕТА: <span class="redacted">УНИЧТОЖЕН ПО ПРИКАЗУ 
АДМИНИСТРАЦИИ</span>. Настоящая копия хранилась в личном сейфе 
Dr. Ковалевой.

═════════════════════════════════════════════════════

Подпись: Dr. Е. Ковалева
Статус: ИСЧЕЗЛА (8 октября 2024 г.)
`,
            requiredProgress: [],
            choices: [
                { text: '► ПЕРЕХОД К ФИНАЛЬНОМУ РЕШЕНИЮ', action: 'unlockFile', target: 'final_decision.exe' },
                { text: '► ВЕРНУТЬСЯ К МЕНЮ', action: 'goToFile', target: 'intro.sys' }
            ]
        },

        {
            id: 'final_decision.exe',
            title: 'ФИНАЛЬНОЕ РЕШЕНИЕ',
            folder: 'СИСТЕМА',
            content: `╔════════════════════════════════════════════════════╗
║              ФИНАЛЬНОЕ РЕШЕНИЕ v7.4              ║
║                    АРХИВ №47                      ║
╚════════════════════════════════════════════════════╝

АГЕНТ, ВЫ ОБЛАДАЕТЕ ПОЛНОЙ ИНФОРМАЦИЕЙ.

42 НЕВИННЫХ ЖИЗНЕЙ ЗАГУБЛЕНО
12 МИЛЛИОНОВ ДОЛЛАРОВ УКРАДЕНО
1 ГЛАВНЫЙ ПРЕСТУПНИК ОСТАЕТСЯ НА ВОЛЕ

Виктор Сафин готовится покинуть страну через 72 часа.
Его сообщник "X" находится в недоступности.

ПЕРЕД ВАМИ ТРИ ПУТИ:

═══ ВАРИАНТ 1: СПРАВЕДЛИВОСТЬ ═══
Предать всю информацию правоохранительным органам.
Арестовать Виктора Сафина по полному пакету обвинений.

Последствия:
✓ Преступник будет наказан
✓ Семьи жертв получат ответы
✗ Дело будет долгим и шумным
✗ Твое имя станет известно
✗ Возможны репрессии со стороны его влиятельных друзей

═══ ВАРИАНТ 2: ОТКРЫТОСТЬ ═══
Слить всю информацию в интернет анонимно.
Дать правде возможность распространиться.

Последствия:
✓ Информация будет недоступна для уничтожения
✓ Международное внимание
✓ Общественное давление
✗ Сафин скроется
✗ Его сообщники получат возможность скрыть следы
✗ Следствие будет затруднено

═══ ВАРИАНТ 3: МОЛЧАНИЕ ═══
Удалить архив. Стереть все доказательства.
Оставить преступление нераскрытым.
Спасти только себя.

Последствия:
✓ Ты останешься в живых
✓ Никто не узнает твое имя
✗ Виктор Сафин уходит безнаказанным
✗ 42 жизни остаются без справедливости
✗ Ты будешь жить со знанием о преступлении

═════════════════════════════════════════════════════

ВЫБИРАЙ СВОЙ ПУТЬ, АГЕНТ.
`,
            requiredProgress: [],
            choices: [
                { text: '► ВАРИАНТ 1: СПРАВЕДЛИВОСТЬ', action: 'triggerEnding', ending: 1 },
                { text: '► ВАРИАНТ 2: ОТКРЫТОСТЬ', action: 'triggerEnding', ending: 2 },
                { text: '► ВАРИАНТ 3: МОЛЧАНИЕ', action: 'triggerEnding', ending: 3 }
            ]
        }
    ],

    // Концовки
    endings: {
        1: {
            title: 'КОНЦОВКА 1: СПРАВЕДЛИВОСТЬ',
            text: `УГОЛОВНОЕ РАССЛЕДОВАНИЕ ОТКРЫТО

Через 6 часов информация поступает в прокуратуру.
Виктор Сафин арестован в аэропорту во время попытки вылета.

ИТОГИ:
- Виктор Сафин: пожизненное заключение
- Его сообщник "X" (начальник безопасности): 25 лет
- 15 соучастников получают сроки от 5 до 15 лет
- 12 миллионов долларов возвращены государству

ТВОЯ СУДЬБА:
Твое имя классифицировано. Ты получаешь новую личность.
Программа свидетелей государства гарантирует безопасность.

ПАМЯТИ ЖЕРТВ:
На острове Aurora воздвигнут мемориал 42 погибшим.
Ежегодно 1 октября проводится День памяти.

Последняя запись в архиве:
"Справедливость может быть медленной, но она приходит.
 42 голоса, наконец, услышаны."

════════════════════════════════════════════════════

КОНЕЦ РАССЛЕДОВАНИЯ
`
        },
        2: {
            title: 'КОНЦОВКА 2: ОТКРЫТОСТЬ',
            text: `ИНФОРМАЦИЯ РАСПРОСТРАНЕНА

Архив размещен в 47 хранилищах по всему миру.
За 2 часа информация достигает 500 млн человек.

МЕЖДУНАРОДНЫЙ СКАНДАЛ:
- ООН требует независимого расследования
- Европарламент требует санкций
- Российское правительство отрицает причастность

СУДЬБА ВИКТОРА САФИНА:
Он получает 72 часа предупреждения. Скрывается в Монако.
Интерпол издает красный ордер, но он остается недосягаем.
Его имущество конфисковано, но жизнь продолжается вне досягаемости.

ТВОЯ СУДЬБА:
Спецслужбы усиленно ищут тебя. Ты становишься "врагом государства".
Новая личность. Вечное бегство. Фальшивые документы.
Ты свободен, но никогда не сможешь остановиться.

ПАМЯТИ ЖЕРТВ:
42 имени становятся известны миру. На стены домов наносят их портреты.
Их смерть не забыта, но их убийца живет на свободе.

ПОСЛЕДНИЙ ТЕКСТ В АРХИВЕ:
"Правда опубликована. Но справедливость остается мечтой.
 Истина без наказания - это половина победы."

════════════════════════════════════════════════════

КОНЕЦ РАССЛЕДОВАНИЯ
`
        },
        3: {
            title: 'КОНЦОВКА 3: МОЛЧАНИЕ',
            text: `АРХИВ УНИЧТОЖЕН

Команда технических специалистов полностью стирает все доказательства.
Все серверы, копии, резервные копии - уничтожены.

СУДЬБА ВИКТОРА САФИНА:
Он улетает на частном самолете.
Начинает новую жизнь под новым именем в Швейцарии.
Через 10 лет становится известным филантропом.

ОФИЦИАЛЬНАЯ ВЕРСИЯ:
Авария на острове Aurora осталась "технической ошибкой".
42 работника похоронены как жертвы несчастного случая.
Их семьи получают скромные компенсации и молчат.

ТВОЯ СУДЬБА:
Ты живешь обычной жизнью.
Получаешь щедрое вознаграждение: 2 миллиона долларов.
Красивый дом. Хорошая карьера. Процветание.

Но каждую ночь ты помнишь 42 имени.
Каждый день ты видишь их лица.
Холод в груди никогда не исчезает.

ПОСЛЕДНИЙ ТЕКСТ:
"Молчание - это удобство, купленное ценой совести.
 Архив закрыт. История забыта. Но боль остается."

════════════════════════════════════════════════════

КОНЕЦ РАССЛЕДОВАНИЯ
`
        }
    }
};

// ===== ОСНОВНОЙ КЛАСС ИГРЫ =====
class ArchiveGame {
    constructor() {
        this.loadState();
        this.initializeUI();
        this.setupEventListeners();
        this.renderCurrentFile();
        this.renderFileTree();
    }

    // Загрузка состояния из localStorage
    loadState() {
        const saved = localStorage.getItem('archiveGameState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                gameData.state = { ...gameData.state, ...parsed };
            } catch (e) {
                console.error('Ошибка загрузки состояния:', e);
            }
        }
    }

    // Сохранение состояния в localStorage
    saveState() {
        localStorage.setItem('archiveGameState', JSON.stringify(gameData.state));
    }

    // Инициализация интерфейса
    initializeUI() {
        // Рендеринг левой панели (список файлов)
        this.renderFileTree();
        // Рендеринг правой панели (содержимое)
        this.renderCurrentFile();
    }

    // Отрисовка дерева файлов в левой панели
    renderFileTree() {
        const fileTree = document.querySelector('.file-tree');
        fileTree.innerHTML = '';

        // Группируем файлы по папкам
        const filesByFolder = {};
        gameData.files.forEach(file => {
            const folder = file.folder || 'СИСТЕМА';
            if (!filesByFolder[folder]) {
                filesByFolder[folder] = [];
            }
            filesByFolder[folder].push(file);
        });

        // Отрисовываем папки и файлы
        Object.keys(filesByFolder).sort().forEach(folder => {
            // Папка
            const folderDiv = document.createElement('div');
            folderDiv.className = 'file-folder-header';
            folderDiv.textContent = folder;
            fileTree.appendChild(folderDiv);

            // Файлы в папке
            filesByFolder[folder].forEach(file => {
                const fileEl = document.createElement('div');
                fileEl.className = 'file-item';
                
                if (!gameData.state.unlockedFiles.includes(file.id)) {
                    fileEl.classList.add('locked');
                }
                
                if (gameData.state.currentFile === file.id) {
                    fileEl.classList.add('active');
                }

                fileEl.textContent = file.title;
                fileEl.onclick = () => this.selectFile(file.id);
                fileTree.appendChild(fileEl);
            });
        });
    }

    // Выбор файла
    selectFile(fileId) {
        const file = gameData.files.find(f => f.id === fileId);
        
        if (!file) return;
        
        if (!gameData.state.unlockedFiles.includes(fileId)) {
            // Файл заблокирован
            this.showMessage('ДОСТУП ЗАПРЕЩЕН', 'Этот файл еще не разблокирован.');
            return;
        }

        gameData.state.currentFile = fileId;
        this.saveState();
        this.renderCurrentFile();
        this.renderFileTree();
    }

    // Отрисовка содержимого текущего файла
    renderCurrentFile() {
        const file = gameData.files.find(f => f.id === gameData.state.currentFile);
        if (!file) return;

        // Обновляем заголовок
        document.getElementById('currentFileName').textContent = file.title;

        // Обновляем содержимое
        const contentArea = document.getElementById('content');
        
        // Анимация появления
        contentArea.classList.remove('fade-in');
        void contentArea.offsetWidth; // trigger reflow
        contentArea.classList.add('fade-in');

        contentArea.innerHTML = file.content;

        // Добавляем обработчики кликов на redacted элементы
        this.setupRedactedClickHandlers();

        // Обновляем кнопки выборов
        this.renderChoices(file);

        // Прокручиваем контент в начало
        contentArea.scrollTop = 0;

        // Обновляем статус бар
        this.updateStatusBar();
    }

    // Установка обработчиков для элементов .redacted
    setupRedactedClickHandlers() {
        document.querySelectorAll('.redacted:not(.revealed)').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                
                // Проверяем, не кликали ли уже на этот элемент
                const content = el.textContent;
                const key = gameData.state.currentFile + '_' + el.innerHTML;
                
                if (!gameData.state.clickedRedacted.includes(key)) {
                    gameData.state.clickedRedacted.push(key);
                    this.saveState();
                }

                // Добавляем классы для анимации
                el.classList.add('unlocking');
                
                // После анимации показываем текст
                setTimeout(() => {
                    el.classList.add('revealed');
                    el.classList.remove('unlocking');
                }, 500);

                // Добавляем эффект разблокировки
                this.playUnlockEffect();
            };
        });
    }

    // Эффект разблокировки
    playUnlockEffect() {
        // Визуальный эффект
        const container = document.querySelector('.content-panel');
        container.style.boxShadow = 'inset 0 0 40px rgba(255, 51, 51, 0.4)';
        setTimeout(() => {
            container.style.boxShadow = '';
        }, 300);
    }

    // Отрисовка кнопок выборов
    renderChoices(file) {
        const choicesPanel = document.getElementById('choicesPanel');
        choicesPanel.innerHTML = '';

        if (!file.choices || file.choices.length === 0) {
            return;
        }

        file.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => this.handleChoice(choice);
            choicesPanel.appendChild(button);
        });
    }

    // Обработка выбора игрока
    handleChoice(choice) {
        if (choice.action === 'unlockFile') {
            if (!gameData.state.unlockedFiles.includes(choice.target)) {
                gameData.state.unlockedFiles.push(choice.target);
                this.saveState();
            }
            gameData.state.currentFile = choice.target;
            this.saveState();
            this.renderCurrentFile();
            this.renderFileTree();
        } else if (choice.action === 'goToFile') {
            gameData.state.currentFile = choice.target;
            this.saveState();
            this.renderCurrentFile();
            this.renderFileTree();
        } else if (choice.action === 'triggerEnding') {
            this.triggerEnding(choice.ending);
        }
    }

    // Запуск концовки
    triggerEnding(endingNumber) {
        gameData.state.ending = endingNumber;
        this.saveState();

        const ending = gameData.endings[endingNumber];
        const modal = document.getElementById('endingModal');
        
        document.getElementById('endingTitle').textContent = ending.title;
        document.getElementById('endingText').textContent = ending.text;
        
        modal.classList.add('show');
    }

    // Показ сообщения
    showMessage(title, text) {
        const modal = document.getElementById('endingModal');
        document.getElementById('endingTitle').textContent = title;
        document.getElementById('endingText').textContent = text;
        document.querySelector('.ending-button').textContent = '× ЗАКРЫТЬ';
        document.querySelector('.ending-button').onclick = () => modal.classList.remove('show');
        modal.classList.add('show');
    }

    // Обновление статус бара
    updateStatusBar() {
        const file = gameData.files.find(f => f.id === gameData.state.currentFile);
        const unlockedCount = gameData.state.unlockedFiles.length;
        const totalCount = gameData.files.length;
        const progressPercentage = (unlockedCount / totalCount) * 100;
        
        document.getElementById('progress-info').textContent = 
            `РАСШИФРОВКА: ${Math.round(progressPercentage)}%`;
            
        const progressBar = document.getElementById('progressBar');
        if(progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    // Установка слушателей событий
    setupEventListeners() {
        // Клавиша ESC - закрыть модаль
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('endingModal');
                if (modal.classList.contains('show')) {
                    modal.classList.remove('show');
                }
            }
        });
        
        // Часы
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            setInterval(() => {
                const now = new Date();
                timeDisplay.textContent = now.toLocaleTimeString('ru-RU', { hour12: false });
            }, 1000);
            const initialNow = new Date();
            timeDisplay.textContent = initialNow.toLocaleTimeString('ru-RU', { hour12: false });
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ИГРЫ =====
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ArchiveGame();
    
    // Для отладки в консоли
    console.log('%cАРХИВ №47 ИНИЦИАЛИЗИРОВАН', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('Используйте window.game для доступа к объекту игры');
});

// Функция сброса игры (если нужно)
function resetGame() {
    localStorage.removeItem('archiveGameState');
    location.reload();
}
