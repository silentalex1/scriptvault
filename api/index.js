const express = require('express')
const serverless = require('serverless-http')
const app = express()
app.use(express.json())
let scripts = []
let announcements = []
let users = []
const ownerUsername = 'realalex'
const ownerPassword = 'realalexpass'
function ensureOwnerUser() {
    if (!users.some(u => u.username === ownerUsername)) {
        const token = Math.random().toString(36).slice(2) + Date.now()
        users.push({ id: Date.now(), username: ownerUsername, password: ownerPassword, token })
    }
}
ensureOwnerUser()
function getUserByToken(token) {
    return users.find(u => u.token === token)
}
function isOwner(user) {
    return user && user.username && user.username.toLowerCase() === ownerUsername
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
    const { title, description } = req.body
    const token = req.headers['x-auth']
    const user = getUserByToken(token)
    if (!isOwner(user)) {
        return res.status(403).json({ error: 'Only realalex can post announcements.' })
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
        return res.status(403).json({ error: 'Only realalex can edit announcements.' })
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
        return res.status(403).json({ error: 'Only realalex can delete announcements.' })
    }
    const idx = announcements.findIndex(a => String(a.id) === String(id))
    if (idx === -1) return res.status(404).json({ error: 'Announcement not found' })
    announcements.splice(idx, 1)
    res.json({ message: 'Announcement deleted' })
})
app.post('/api/users', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ error: 'Username already exists' })
    }
    const token = Math.random().toString(36).slice(2) + Date.now()
    const user = { id: Date.now(), username, password, token }
    users.push(user)
    res.status(201).json({ message: 'User created successfully', token })
})
app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    ensureOwnerUser()
    if (username === ownerUsername && password === ownerPassword) {
        const user = users.find(u => u.username === ownerUsername)
        if (!user.token) user.token = Math.random().toString(36).slice(2) + Date.now()
        return res.status(200).json({ message: 'Login successful', token: user.token })
    }
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
        return res.status(200).json({ message: 'Logged in as guest', token: 'guest-token' })
    }
    if (!user.token) user.token = Math.random().toString(36).slice(2) + Date.now()
    res.status(200).json({ message: 'Login successful', token: user.token })
})
module.exports = app
module.exports.handler = serverless(app)