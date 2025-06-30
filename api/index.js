const express = require('express')
const serverless = require('serverless-http')
const crypto = require('crypto')
const app = express()
app.use(express.json())
let scripts = []
let announcements = []
let users = []
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
    return false
}
function getUserByEmail(e) {
    return users.find(u => u.email && u.email.toLowerCase() === e.toLowerCase())
}
function getUser(n) {
    return users.find(u => u.username && u.username.toLowerCase() === n.toLowerCase())
}
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
    res.status(403).json({ error: 'No owner is set to post announcements.' })
})
app.put('/api/announcements/:id', (req, res) => {
    res.status(403).json({ error: 'No owner is set to edit announcements.' })
})
app.delete('/api/announcements/:id', (req, res) => {
    res.status(403).json({ error: 'No owner is set to delete announcements.' })
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
        users = users.filter(user => !(user.username && user.username.toLowerCase() === username.toLowerCase()))
    }
    if (users.some(user => user.email && user.email.toLowerCase() === email.toLowerCase())) {
        users = users.filter(user => !(user.email && user.email.toLowerCase() === email.toLowerCase()))
    }
    const passHash = hashPassword(password)
    const token = genToken()
    const user = { id: Date.now(), username, passHash, token, email }
    users.push(user)
    res.status(201).json({ message: 'User created successfully', token })
})
app.post('/api/login', (req, res) => {
    const { username, password } = req.body
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
app.get('/api/ping', (req, res) => {
    res.json({ pong: true })
})
module.exports = app
module.exports.handler = serverless(app)
