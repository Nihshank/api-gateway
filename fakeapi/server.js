const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())
app.get('/fakeapi', (req, res) => {
    res.send("At fake api server\n")
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
