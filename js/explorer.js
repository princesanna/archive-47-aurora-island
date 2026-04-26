/**
 * Archive 47 - File Explorer Module
 */
class FileExplorer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.files = [
            { id: 'folder_aurora', name: 'AURORA_PROJECT', type: 'folder', items: [
                { id: 'file_logs', name: 'security_logs.txt', type: 'file', content: 'Entry 047: Multiple signals detected at the perimeter. Protocol 9 activated.' },
                { id: 'file_manifest', name: 'personnel.db', type: 'file', content: 'REDACTED: 42 names found. Status: UNKNOWN.' }
            ]},
            { id: 'file_secret', name: 'TOP_SECRET.doc', type: 'file', content: 'The Anchor is located beneath the estate. Code: 47-X.' },
            { id: 'file_note', name: 'note.txt', type: 'file', content: 'Don\'t trust the Star. She knows more than she says.' }
        ];
        this.currentDir = this.files;
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.currentDir.forEach(item => {
            const el = document.createElement('div');
            el.className = 'explorer-item';
            el.innerHTML = `
                <div class="item-icon">${item.type === 'folder' ? '📁' : '📄'}</div>
                <div class="item-name">${item.name}</div>
            `;
            el.onclick = () => this.handleItemClick(item);
            this.container.appendChild(el);
        });
    }

    handleItemClick(item) {
        if (item.type === 'folder') {
            this.currentDir = item.items;
            this.render();
            this.addBackButton();
        } else {
            this.openFile(item);
        }
    }

    addBackButton() {
        const btn = document.createElement('div');
        btn.className = 'explorer-item back-btn';
        btn.innerHTML = `<div class="item-icon">⬅️</div><div class="item-name">..BACK</div>`;
        btn.onclick = () => {
            this.currentDir = this.files;
            this.render();
        };
        this.container.prepend(btn);
    }

    openFile(file) {
        // Создаем временное окно для контента файла
        if (window.game) {
            window.game.notify("READING: " + file.name, "info");
        }
        
        // Можно вывести в терминал или создать новое окно
        if (window.game && window.game.terminal) {
            window.game.terminal.print(`--- ${file.name} ---`, "system");
            window.game.terminal.print(file.content, "info");
            window.osCore.openWindow('terminal-window-wrapper');
        }
    }
}

window.FileExplorer = FileExplorer;
