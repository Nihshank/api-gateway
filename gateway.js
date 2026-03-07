
const express = require('express')
const app = express()
const routes = require('./routes')
const PORT = 3000

// parse JSON request body to JS obj
app.use(express.json())

app.get('/', (req, res) => {
    res.send("On the home page. \n")
})

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

