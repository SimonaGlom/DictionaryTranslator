const express = require('express')
var cors = require('cors')
const app = express()
const port = 8000
app.use(cors())

app.get('/search', (req, res) => {
    res.send('Hello World!')
    console.log(req)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})