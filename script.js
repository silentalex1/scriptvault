document.addEventListener('DOMContentLoaded', () => {
    const scriptForm = document.getElementById('scriptForm');
    const scriptList = document.getElementById('scriptList');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const themeSelect = document.getElementById('theme');
    const accountBtn = document.getElementById('accountBtn') || document.getElementById('createAccountBtn');
    const accountModal = document.getElementById('accountModal');
    const closeAccount = document.getElementById('closeAccount');
    const saveAccount = document.getElementById('saveAccount');
    const welcomeUser = document.getElementById('welcomeUser');
    const authTabs = document.getElementById('authTabs');
    const showCreate = document.getElementById('showCreate');
    const showLogin = document.getElementById('showLogin');
    const createForm = document.getElementById('createForm');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    const addAnnouncementModal = document.getElementById('addAnnouncementModal');
    const closeAddAnnouncement = document.getElementById('closeAddAnnouncement');
    const postAnnouncementBtn = document.getElementById('postAnnouncementBtn');
    const announcementTitle = document.getElementById('announcementTitle');
    const announcementDesc = document.getElementById('announcementDesc');
    const announceList = document.getElementById('announceList');
    const scriptSubmitBtn = document.getElementById('scriptSubmitBtn');
    const scriptCancelEditBtn = document.getElementById('scriptCancelEditBtn');
    let editingScriptId = null;

    function setSession(username, token) {
        localStorage.setItem('sv_user', username);
        localStorage.setItem('sv_token', token);
    }
    function clearSession() {
        localStorage.removeItem('sv_user');
        localStorage.removeItem('sv_token');
    }
    function getSession() {
        return {
            username: localStorage.getItem('sv_user'),
            token: localStorage.getItem('sv_token')
        }
    }
    async function loadScripts() {
        try {
            const response = await fetch('/api/scripts', {
                headers: { 'x-auth': getSession().token || '' }
            });
            if (!response.ok) throw new Error();
            const scripts = await response.json();
            scriptList.innerHTML = '';
            if (scripts.length === 0) {
                scriptList.innerHTML = `<div class="script-card" style="text-align:center;color:#a5b4fc;font-size:1.1rem;">No scripts yet. Be the first to save one!</div>`;
                return;
            }
            const session = getSession();
            scripts.slice().reverse().forEach(script => {
                const scriptCard = document.createElement('div');
                scriptCard.className = 'script-card';
                scriptCard.innerHTML = `<h3>${escapeHtml(script.title)}</h3>
<pre>${escapeHtml(script.content)}</pre>`;
                if (session.username && script.owner === session.username) {
                    const actions = document.createElement('div');
                    actions.className = 'script-actions';
                    actions.innerHTML = `<button data-id="${script.id}" class="edit-script-btn">Edit</button>
                    <button data-id="${script.id}" class="delete-script-btn">Delete</button>`;
                    scriptCard.appendChild(actions);
                }
                scriptList.appendChild(scriptCard);
            });
            addScriptActionsListeners();
        } catch {
            scriptList.innerHTML = '<div class="script-card" style="text-align:center;color:#f87171;">Failed to load scripts. Please try again later.</div>';
        }
    }
    function addScriptActionsListeners() {
        document.querySelectorAll('.edit-script-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const all = await fetch('/api/scripts', {
                    headers: { 'x-auth': getSession().token || '' }
                });
                const scripts = await all.json();
                const script = scripts.find(s => String(s.id) === String(id));
                if (!script) return;
                document.getElementById('scriptTitle').value = script.title;
                document.getElementById('scriptContent').value = script.content;
                editingScriptId = id;
                scriptSubmitBtn.textContent = "Update Script";
                scriptCancelEditBtn.classList.remove('hidden');
            });
        });
        document.querySelectorAll('.delete-script-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const session = getSession();
                if (!session.username || !session.token) return;
                await fetch(`/api/scripts/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-auth': session.token }
                });
                if (editingScriptId === id) {
                    editingScriptId = null;
                    scriptForm.reset();
                    scriptSubmitBtn.textContent = "Add Script";
                    scriptCancelEditBtn.classList.add('hidden');
                }
                loadScripts();
                showToast('Script deleted!', 'success');
            });
        });
    }
    scriptCancelEditBtn && scriptCancelEditBtn.addEventListener('click', () => {
        editingScriptId = null;
        scriptForm.reset();
        scriptSubmitBtn.textContent = "Add Script";
        scriptCancelEditBtn.classList.add('hidden');
    });
    scriptForm && scriptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const session = getSession();
        if (!session.username || !session.token) {
            accountModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
            updateAuthTab('login');
            return;
        }
        const title = document.getElementById('scriptTitle').value.trim();
        const content = document.getElementById('scriptContent').value.trim();
        if (!title || !content) {
            showToast('Please fill in both title and content.');
            return;
        }
        try {
            if (editingScriptId) {
                const response = await fetch(`/api/scripts/${editingScriptId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-auth': session.token },
                    body: JSON.stringify({ title, content })
                });
                if (!response.ok) throw new Error();
                editingScriptId = null;
                showToast('Script updated!', 'success');
                scriptSubmitBtn.textContent = "Add Script";
                scriptCancelEditBtn.classList.add('hidden');
            } else {
                const response = await fetch('/api/scripts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-auth': session.token },
                    body: JSON.stringify({ title, content })
                });
                if (!response.ok) throw new Error();
                showToast('Script saved!', 'success');
            }
            scriptForm.reset();
            loadScripts();
        } catch {
            showToast('Failed to save script. Please try again.', 'error');
        }
    });
    settingsBtn && settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    closeSettings && closeSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    saveSettings && saveSettings.addEventListener('click', () => {
        const theme = themeSelect.value;
        localStorage.setItem('theme', theme);
        setTheme(theme);
        settingsModal.classList.add('hidden');
        showToast('Settings saved!', 'success');
    });
    accountBtn && accountBtn.addEventListener('click', () => {
        accountModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        updateAuthTab('login');
    });
    closeAccount && closeAccount.addEventListener('click', () => {
        accountModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    });
    function updateAuthTab(tab = 'create') {
        if (tab === 'create') {
            showCreate.classList.add('active');
            showLogin.classList.remove('active');
            createForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        } else {
            showCreate.classList.remove('active');
            showLogin.classList.add('active');
            createForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    }
    showCreate && showCreate.addEventListener('click', () => updateAuthTab('create'));
    showLogin && showLogin.addEventListener('click', () => updateAuthTab('login'));
    saveAccount && saveAccount.addEventListener('click', async () => {
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const email = document.getElementById('newEmail').value.trim();
        if (!username || !password || !email) {
            showToast('Please fill in username, email, and password.');
            return;
        }
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await response.json();
            if (!response.ok) {
                showToast(data.error || 'Failed to create account.', 'error');
                return;
            }
            setSession(username, data.token);
            updateWelcome();
            showToast('Account created!', 'success');
            updateAuthTab('login');
            accountModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
            loadScripts();
        } catch {
            showToast('Failed to create account. Please try again.', 'error');
        }
    });
    loginBtn && loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!username || !password) {
            showToast('Please fill in your username and password.');
            return;
        }
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) {
                showToast(data.error || 'Failed to login.', 'error');
                return;
            }
            setSession(username, data.token);
            updateWelcome();
            accountModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
            showToast('Logged in!', 'success');
            showAddAnnouncementBtn();
            loadScripts();
        } catch {
            showToast('Failed to login. Please try again.', 'error');
        }
    });
    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }
    }
    function updateWelcome() {
        const session = getSession();
        if (session.username) {
            welcomeUser.textContent = `Welcome ${session.username}!`;
            welcomeUser.classList.add('show');
        } else {
            welcomeUser.textContent = '';
            welcomeUser.classList.remove('show');
        }
        showAddAnnouncementBtn();
    }
    function showAddAnnouncementBtn() {
        if (!addAnnouncementBtn) return;
        const session = getSession();
        if (session.username && session.username.toLowerCase() === 'realalex') {
            addAnnouncementBtn.classList.remove('hidden');
        } else {
            addAnnouncementBtn.classList.add('hidden');
        }
    }
    function showToast(msg, type = 'info') {
        let toast = document.createElement('div');
        toast.textContent = msg;
        toast.className = 'toast ' + type;
        Object.assign(toast.style, {
            position: 'fixed',
            left: '50%', transform: 'translateX(-50%)',
            bottom: '2.2rem', zIndex: 9999,
            background: type === 'success' ? 'linear-gradient(90deg,#818cf8 60%,#22d3ee 100%)' :
                type === 'error' ? 'linear-gradient(90deg,#ef4444 60%,#a855f7 100%)' : 'rgba(30,27,75,0.98)',
            color: '#fff', padding: '1rem 2.5rem', borderRadius: '1.1rem',
            fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.01em',
            boxShadow: '0 4px 18px rgba(45,32,102,0.09)', opacity: 0, pointerEvents: 'none',
            transition: 'opacity 0.14s'
        });
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = 1; }, 40);
        setTimeout(() => { toast.style.opacity = 0; }, 1800);
        setTimeout(() => { toast.remove(); }, 2100);
    }
    function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/[&<>"']/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
    }
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    updateWelcome();
    if (scriptList) loadScripts();
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('mousedown', function (e) {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });
    if (addAnnouncementBtn) {
        addAnnouncementBtn.addEventListener('click', () => {
            addAnnouncementModal.classList.remove('hidden');
            announcementTitle.value = '';
            announcementDesc.value = '';
        });
    }
    if (closeAddAnnouncement) {
        closeAddAnnouncement.addEventListener('click', () => {
            addAnnouncementModal.classList.add('hidden');
        });
    }
    if (postAnnouncementBtn) {
        postAnnouncementBtn.addEventListener('click', async () => {
            const title = announcementTitle.value.trim();
            const desc = announcementDesc.value.trim();
            const session = getSession();
            if (!title || !desc) {
                showToast('Fill in title and announcement.', 'error');
                return;
            }
            if (!session.username || session.username.toLowerCase() !== 'realalex') {
                showToast('Only the owner can post.', 'error');
                return;
            }
            try {
                const response = await fetch('/api/announcements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-auth': session.token },
                    body: JSON.stringify({ title, description: desc })
                });
                if (!response.ok) throw new Error();
                loadAnnouncements();
                addAnnouncementModal.classList.add('hidden');
                showToast('Announcement posted!', 'success');
            } catch {
                showToast('Failed to post announcement.', 'error');
            }
        });
    }
    async function loadAnnouncements() {
        if (!announceList) return;
        try {
            const response = await fetch('/api/announcements');
            if (!response.ok) throw new Error();
            const announcements = await response.json();
            announceList.innerHTML = '';
            if (announcements.length === 0) {
                announceList.innerHTML = `<div class="announce-card" style="text-align:center;color:#a5b4fc;font-size:1.1rem;">No announcements yet.</div>`;
                return;
            }
            announcements.slice().reverse().forEach(a => {
                const card = document.createElement('div');
                card.className = 'announce-card glass';
                card.innerHTML = `<h2 class="announce-title gradient-text">${escapeHtml(a.title)}</h2><p class="announce-body">${escapeHtml(a.description)}</p>`;
                announceList.appendChild(card);
            });
        } catch {
            announceList.innerHTML = '<div class="announce-card" style="text-align:center;color:#f87171;">Failed to load announcements.</div>';
        }
    }
    if (announceList) loadAnnouncements();
    showAddAnnouncementBtn();
});
