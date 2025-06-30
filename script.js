let userToken = localStorage.getItem('scriptvault_token') || ''
let username = localStorage.getItem('scriptvault_user') || ''
function showAccountModal() {
    document.getElementById('accountModal').classList.remove('hidden')
    document.getElementById('showCreate').classList.add('active')
    document.getElementById('showLogin').classList.remove('active')
    document.getElementById('createForm').classList.remove('hidden')
    document.getElementById('loginForm').classList.add('hidden')
}
function hideAccountModal() {
    document.getElementById('accountModal').classList.add('hidden')
}
function showSettingsModal() {
    document.getElementById('settingsModal').classList.remove('hidden')
}
function hideSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden')
}
function setWelcomeUser(u) {
    const el = document.getElementById('welcomeUser')
    if (u) {
        el.textContent = 'Welcome, ' + u
    } else {
        el.textContent = ''
    }
}
document.addEventListener('DOMContentLoaded', function() {
    setWelcomeUser(username)
    const accountBtn = document.getElementById('accountBtn')
    if (accountBtn) accountBtn.onclick = showAccountModal
    const closeAccount = document.getElementById('closeAccount')
    if (closeAccount) closeAccount.onclick = hideAccountModal
    const showCreate = document.getElementById('showCreate')
    const showLogin = document.getElementById('showLogin')
    if (showCreate && showLogin) {
        showCreate.onclick = () => {
            showCreate.classList.add('active')
            showLogin.classList.remove('active')
            document.getElementById('createForm').classList.remove('hidden')
            document.getElementById('loginForm').classList.add('hidden')
        }
        showLogin.onclick = () => {
            showLogin.classList.add('active')
            showCreate.classList.remove('active')
            document.getElementById('loginForm').classList.remove('hidden')
            document.getElementById('createForm').classList.add('hidden')
        }
    }
    const saveAccount = document.getElementById('saveAccount')
    if (saveAccount) saveAccount.onclick = async function() {
        const username = document.getElementById('newUsername').value.trim()
        const password = document.getElementById('newPassword').value
        const email = document.getElementById('newEmail').value.trim()
        if (!username || !password || !email) {
            alert('All fields required')
            return
        }
        const resp = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        })
        const data = await resp.json()
        if (resp.ok) {
            localStorage.setItem('scriptvault_token', data.token)
            localStorage.setItem('scriptvault_user', username)
            setWelcomeUser(username)
            hideAccountModal()
            location.reload()
        } else {
            alert(data.error || 'Could not create account')
        }
    }
    const loginBtn = document.getElementById('loginBtn')
    if (loginBtn) loginBtn.onclick = async function() {
        const username = document.getElementById('loginUsername').value.trim()
        const password = document.getElementById('loginPassword').value
        if (!username || !password) {
            alert('All fields required')
            return
        }
        const resp = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await resp.json()
        if (resp.ok) {
            localStorage.setItem('scriptvault_token', data.token)
            localStorage.setItem('scriptvault_user', username)
            setWelcomeUser(username)
            hideAccountModal()
            location.reload()
        } else {
            alert(data.error || 'Could not login')
        }
    }
    const closeSettings = document.getElementById('closeSettings')
    if (closeSettings) closeSettings.onclick = hideSettingsModal
    const settingsBtn = document.getElementById('settingsBtn')
    if (settingsBtn) settingsBtn.onclick = showSettingsModal
    const saveSettings = document.getElementById('saveSettings')
    if (saveSettings) saveSettings.onclick = function() {
        const theme = document.getElementById('theme').value
        document.body.classList.toggle('light', theme === 'light')
        document.body.classList.toggle('dark', theme === 'dark')
        hideSettingsModal()
    }
    if (window.location.pathname.endsWith('announcements.html')) {
        loadAnnouncements()
    }
    if (window.location.pathname.endsWith('announcements.html')) {
        const addBtn = document.getElementById('addAnnouncementBtn')
        const newArea = document.getElementById('newAnnouncementArea')
        if (userToken) {
            if (newArea) newArea.classList.remove('hidden')
        }
        if (addBtn) {
            addBtn.onclick = async function() {
                const title = document.getElementById('newAnnouncementTitle').value.trim()
                const description = document.getElementById('newAnnouncementDesc').value.trim()
                if (!title || !description) { alert('All fields required'); return }
                const resp = await fetch('/api/announcements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-auth': userToken },
                    body: JSON.stringify({ title, description })
                })
                const data = await resp.json()
                if (resp.ok) {
                    document.getElementById('newAnnouncementTitle').value = ''
                    document.getElementById('newAnnouncementDesc').value = ''
                    loadAnnouncements()
                } else {
                    alert(data.error || 'Could not add announcement')
                }
            }
        }
    }
})
function loadAnnouncements() {
    fetch('/api/announcements').then(r=>r.json()).then(list=>{
        const el = document.getElementById('announcementsList')
        el.innerHTML = ''
        list.slice().reverse().forEach(a=>{
            const wrap = document.createElement('div')
            wrap.className = 'announcement'
            const title = document.createElement('div')
            title.className = 'announcement-title'
            title.textContent = a.title
            const desc = document.createElement('div')
            desc.className = 'announcement-desc'
            desc.textContent = a.description
            wrap.appendChild(title)
            wrap.appendChild(desc)
            el.appendChild(wrap)
        })
    })
}
