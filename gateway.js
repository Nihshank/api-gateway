const express = require('express')
const app = express()
const routes = require('./routes')
const fs = require('fs')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const PORT = process.env.GATEWAY_PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

app.use(helmet())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("On the home page. \n")
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    console.log('username is: ', username)
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' })
    }

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
})

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

app.use('/', authenticate)

app.post('/register', (req, res) => {
    const { name, url, port, health, methods } = req.body

    if (!name || !url || !port || !health || !methods){
        return res.status(400).json({ error: 'Missing required fields to register service' })
    }

    const registry = JSON.parse(fs.readFileSync('./routes/registry.json'))
    
    if (!registry.services[name]) {
        registry.services[name] = []
    }

    const alreadyExists = registry.services[name].some(instance => instance.url === url)
    
    if (!alreadyExists) {
        registry.services[name].push({ url, port, health, methods, enabled: true})
    }

    fs.writeFileSync('./routes/registry.json', JSON.stringify(registry, null, 2))
    res.status(201).json({ message: `Service '${name}' registered successfully` })
})

app.post('/unregister', (req, res) => {
    const { name, url } = req.body

    if (!name || !url) {
        return res.status(400).json({ error: 'Missing required fields to unregister service' })
    }

    const registry = JSON.parse(fs.readFileSync('./routes/registry.json'))

    if (!registry.services[name]) {
        return res.status(404).json({ error: `Service '${name}' not found` })
    }

    registry.services[name] = registry.services[name].filter(instance => instance.url !== url)

    if (registry.services[name].length === 0) {
        delete registry.services[name]
    }

    fs.writeFileSync('./routes/registry.json', JSON.stringify(registry, null, 2))
    res.status(200).json({ message: `Service '${name}' unregistered successfully` })
})

app.post('/enable/:apiName', (req, res) => {
    const { apiName } = req.params
    const { url, enabled } = req.body

    if (!url || enabled === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    const registry = JSON.parse(fs.readFileSync('./routes/registry.json'))

    if (!registry.services[apiName]) {
        return res.status(404).json({ error: `Service '${apiName}' not found` })
    }

    const instance = registry.services[apiName].find(instance => instance.url === url)

    if (!instance) {
        return res.status(404).json({ error: `Instance '${url}' not found` })
    }

    instance.enabled = enabled

    fs.writeFileSync('./routes/registry.json', JSON.stringify(registry, null, 2))
    res.status(200).json({ message: `Service '${apiName}' ${enabled ? 'enabled' : 'disabled'} successfully` })
})

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
