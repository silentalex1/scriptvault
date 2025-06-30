const express = require('express')
const serverless = require('serverless-http')
const crypto = require('crypto')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json())
app.use(cookieParser())
let scripts = []
let announcements = []
let users = []
const DISCORD_CLIENT_ID = "1389056934551752884"
const DISCORD_CLIENT_SECRET = "8Pns2zmRy6y6YVhD27mkqI1fT3Z2stgr"
const DISCORD_REDIRECT_URI = "http://localhost:3000/api/oauth/discord/callback"
const GITHUB_CLIENT_ID = "Ov23liGjZ4VIkhYzKDA5"
const GITHUB_CLIENT_SECRET = "b6e4184b2cb4fa985ec20e8e0d178ef1be1e8292"
const GITHUB_REDIRECT_URI = "http://localhost:3000/api/oauth/github/callback"
function genToken() {
    return crypto.randomBytes(24).toString('hex')
}
function getUserByToken(t) {
    return users.find(u => u.token === t)
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
app.get('/api/oauth/discord', (req, res) => {
    const params = [
        `client_id=${DISCORD_CLIENT_ID}`,
        `redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}`,
        "response_type=code",
        "scope=identify"
    ].join('&')
    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
})
app.get('/api/oauth/discord/callback', async (req, res) => {
    const code = req.query.code
    if (!code) return res.redirect('/')
    try {
        const data = new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: DISCORD_REDIRECT_URI,
            scope: 'identify'
        })
        const tokenRes = await axios.post(
            'https://discord.com/api/oauth2/token',
            data,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        const accessToken = tokenRes.data.access_token
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        const username = userRes.data.username + "#" + userRes.data.discriminator
        let user = getUser(username)
        if (!user) {
            user = { id: Date.now(), username, token: genToken(), discord: userRes.data.id }
            users.push(user)
        }
        res.cookie('sv_user', user.username, { httpOnly: false })
        res.cookie('sv_token', user.token, { httpOnly: false })
        res.redirect('/')
    } catch {
        res.redirect('/')
    }
})
app.get('/api/oauth/github', (req, res) => {
    const params = [
        `client_id=${GITHUB_CLIENT_ID}`,
        `redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}`,
        "scope=read:user user:email"
    ].join('&')
    res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})
app.get('/api/oauth/github/callback', async (req, res) => {
    const code = req.query.code
    if (!code) return res.redirect('/')
    try {
        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: GITHUB_REDIRECT_URI
            },
            { headers: { Accept: 'application/json' } }
        )
        const accessToken = tokenRes.data.access_token
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        })
        const username = userRes.data.login
        let user = getUser(username)
        if (!user) {
            user = { id: Date.now(), username, token: genToken(), github: userRes.data.id }
            users.push(user)
        }
        res.cookie('sv_user', user.username, { httpOnly: false })
        res.cookie('sv_token', user.token, { httpOnly: false })
        res.redirect('/')
    } catch {
        res.redirect('/')
    }
})
app.get('/api/oauth/session', (req, res) => {
    const user = req.cookies.sv_user
    const token = req.cookies.sv_token
    if (user && token) {
        res.json({ username: user, token: token })
    } else {
        res.status(401).json({ error: 'Not logged in' })
    }
})
app.get('/api/ping', (req, res) => {
    res.json({ pong: true })
})
module.exports = app
module.exports.handler = serverless(app)
