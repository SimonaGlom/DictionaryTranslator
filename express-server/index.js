const express = require('express')
const cors = require('cors')
const elasticsearch = require('elasticsearch');
const app = express()
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

const port = 8000
app.use(cors())

const languages = ['en', 'sk', 'de']

app.get('/search', async (req, res) => {
    const response = await client.search({
        index: 'dictionary_' + req.query.lang,
        type: '_doc',
        body: {
            query: {
                match: {
                    value: req.query.query
                }
            }
        }
    });
  
    const transObj = {}
    languages.forEach((lang) => {
        if(lang !== req.query.lang) {
            transObj[lang] = []
        }
    })

    console.log(response.hits.hits)
    if(response.hits.total) {
        response.hits.hits.forEach(document => {
            document._source.translations.forEach((translation) => {
                transObj[translation.lang].push(translation.value)
            })     
        });
    }

    res.send(transObj)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})