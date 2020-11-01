const express = require('express')
const cors = require('cors')
const elasticsearch = require('elasticsearch');
const app = express()
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

const port = 8000
app.use(cors())

app.get('/search', async (req, res) => {
    const response = await client.search({
        index: 'dictionary',
        type: '_doc',
        body: {
            query: {
                match: {
                    value: req.query.value
                }
            }
        }
    });

    res.send(response.hits)
    for (const tweet of response.hits.hits) {
        console.log('tweet:', tweet);
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})