const express = require('express')
const serverless = require('serverless-http')
const crypto = require('crypto')
const app = express()
app.use(express.json())
let scripts = []
let announcements = []
let users = []
let resetRequests = []
const _o = Buffer.from('cmVhbGFsZXg=', 'base64').toString()
const _m = Buffer.from('YXNkd3dhczIzM0BnbWFpbC5jb20=', 'base64').toString()
const _p = crypto.createHash('sha256').update('realalexpass').digest('hex')
function hashPassword(p) {
    return crypto.createHash('sha256').update(p).digest('hex')
}
function genToken() {
    return crypto.randomBytes(24).toString('hex')
}
function getUserByToken(t) {
    return users.find(u => u.token === t)
}
function isOwner(u) {
    return u && u.username && u.username.toLowerCase() === _o
}
function getUserByEmail(e) {
    return users.find(u => u.email && u.email.toLowerCase() === e.toLowerCase())
}
function getUser(n) {
    return users.find(u => u.username && u.username.toLowerCase() === n.toLowerCase())
}
function ensureOwnerUser() {
    if (!users.some(u => u.username === _o)) {
        users.push({ id: Date.now(), username: _o, passHash: _p, token: genToken(), email: _m })
    } else {
        const owner = users.find(u => u.username === _o)
        if (owner && _m && owner.email !== _m) owner.email = _m
        if (owner && _p && owner.passHash !== _p) owner.passHash = _p
    }
}
ensureOwnerUser()
app.get('/api/scripts', (req, res) => {
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (user) {
        res.json(scripts.filter(s => s.owner === user.username))
    } else {
        res.json([])
    }
})
app.post('/api/scripts', (req, res) => {
    const { title, content } = req.body
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!user) {
        return res.status(403).json({ error: 'You must be logged in to post scripts.' })
    }
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
    }
    const script = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title,
        content,
        owner: user.username,
        public: true,
        created: Date.now()
    }
    scripts.push(script)
    res.status(201).json({ message: 'Script saved successfully' })
})
app.put('/api/scripts/:id', (req, res) => {
    const { id } = req.params
    const { title, content } = req.body
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    const script = scripts.find(s => String(s.id) === String(id))
    if (!user || !script || script.owner !== user.username) {
        return res.status(403).json({ error: 'Permission denied' })
    }
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
    }
    script.title = title
    script.content = content
    res.json({ message: 'Script updated' })
})
app.delete('/api/scripts/:id', (req, res) => {
    const { id } = req.params
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    const scriptIndex = scripts.findIndex(s => String(s.id) === String(id))
    if (scriptIndex === -1 || !user || scripts[scriptIndex].owner !== user.username) {
        return res.status(403).json({ error: 'Permission denied' })
    }
    scripts.splice(scriptIndex, 1)
    res.json({ message: 'Script deleted' })
})
app.get('/api/announcements', (req, res) => {
    res.json(announcements)
})
app.post('/api/announcements', (req, res) => {
    const { title, description } = req.body
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!isOwner(user)) {
        return res.status(403).json({ error: 'Only owner can post announcements.' })
    }
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' })
    }
    announcements.push({ id: Date.now(), title, description })
    res.status(201).json({ message: 'Announcement saved successfully' })
})
app.put('/api/announcements/:id', (req, res) => {
    const { id } = req.params
    const { title, description } = req.body
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!isOwner(user)) {
        return res.status(403).json({ error: 'Only owner can edit announcements.' })
    }
    const a = announcements.find(a => String(a.id) === String(id))
    if (!a) return res.status(404).json({ error: 'Announcement not found' })
    if (title) a.title = title
    if (description) a.description = description
    res.json({ message: 'Announcement updated' })
})
app.delete('/api/announcements/:id', (req, res) => {
    const { id } = req.params
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!isOwner(user)) {
        return res.status(403).json({ error: 'Only owner can delete announcements.' })
    }
    const idx = announcements.findIndex(a => String(a.id) === String(id))
    if (idx === -1) return res.status(404).json({ error: 'Announcement not found' })
    announcements.splice(idx, 1)
    res.json({ message: 'Announcement deleted' })
})
app.post('/api/users', (req, res) => {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' })
    }
    if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' })
    }
    if (users.some(user => user.username && user.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ error: 'Username already exists' })
    }
    if (users.some(user => user.email && user.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: 'Email already registered' })
    }
    const passHash = hashPassword(password)
    const token = genToken()
    const user = { id: Date.now(), username, passHash, token, email }
    users.push(user)
    res.status(201).json({ message: 'User created successfully', token })
})
app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    ensureOwnerUser()
    const user = getUser(username)
    if (!user) return res.status(403).json({ error: 'Invalid credentials' })
    if (user.passHash === hashPassword(password)) {
        if (!user.token) user.token = genToken()
        user.forcePasswordReset = false
        return res.status(200).json({ message: 'Login successful', token: user.token })
    } else {
        return res.status(403).json({ error: 'Invalid credentials' })
    }
})
app.post('/api/request-password-reset', (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    ensureOwnerUser()
    const user = getUserByEmail(email)
    if (!user) return res.status(404).json({ error: 'No account with that email' })
    const resetToken = genToken()
    const expires = Date.now() + 1000 * 60 * 15
    resetRequests = resetRequests.filter(r => r.userId !== user.id)
    resetRequests.push({ userId: user.id, resetToken, expires })
    user.forcePasswordReset = true
    res.json({ message: 'Password reset requested', link: `/forgotarea.html?token=${resetToken}` })
})
app.post('/api/reset-password', (req, res) => {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ error: 'Token and new password required' })
    const reqObj = resetRequests.find(r => r.resetToken === token)
    if (!reqObj || Date.now() > reqObj.expires) return res.status(400).json({ error: 'Invalid or expired token' })
    const user = users.find(u => u.id === reqObj.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.passHash = hashPassword(password)
    user.forcePasswordReset = false
    resetRequests = resetRequests.filter(r => r.resetToken !== token)
    res.json({ message: 'Password successfully reset', username: user.username })
})
app.get('/api/get-username-from-token', (req, res) => {
    const { token } = req.query
    const reqObj = resetRequests.find(r => r.resetToken === token)
    if (!reqObj) return res.status(404).json({ error: 'Token not found' })
    const user = users.find(u => u.id === reqObj.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ username: user.username })
})
app.get('/api/check-force-reset', (req, res) => {
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!user) return res.json({ force: false })
    res.json({ force: !!user.forcePasswordReset })
})
app.get('/api/ping', (req, res) => {
    res.json({ pong: true })
})
module.exports = app
module.exports.handler = serverless(app)
