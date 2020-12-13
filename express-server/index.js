const express = require('express')
const cors = require('cors')
const elasticsearch = require('elasticsearch');
const app = express()
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

const port = 8000
app.use(cors())

const languages = ['en', 'sk', 'de']

//endpoint pre hľadanie
app.get('/search', async (req, res) => {
        const response = await client.search({
            index: 'dictionary',
            type: '_doc',
            body: {
                query: {
                    bool: {
                        must: {
                            nested: {
                                path: "translations",
                                query: {
                                    match: {
                                        'translations.value': req.query.query
                                    },
                                }
                            }

                        },
                        filter: {
                            nested: {
                                path: "translations",
                                query: {
                                    term: {
                                        'translations.lang': req.query.lang
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const transObj = {}
        languages.forEach((lang) => {
            if (lang !== req.query.lang) {
                transObj[lang] = []
            }
        })

        // z hits vyberie a vyskladá odpoveď pre zvyšné 2 jazyky (napr ak sme hľadali pre sk)
        // [ "en": ['Dog']
        //   "de": ['Hund']
        //]
        if (response.hits.total) {
            response.hits.hits.forEach(document => {
                document._source.translations.forEach((translation) => {
                    if (translation.lang !== req.query.lang) {
                        transObj[translation.lang].push(translation.value)
                    }
                })
            });
        }

        res.send(transObj)
})

// endpoint pre autocomplete
app.get('/autocomplete', async (req, res) => {
        const response = await client.search({
            index: 'dictionary',
            type: '_doc',
            body: {
                query: {
                    bool: {
                        must: {
                            nested: {
                                path: "translations",
                                query: {
                                    match: {
                                        'translations.value.autocomplete': req.query.query
                                    },
                                }
                            }

                        },
                        filter: {
                            nested: {
                                path: "translations",
                                query: {
                                    term: {
                                        'translations.lang': req.query.lang
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        // z hits vyberie a vyskladá odpoveď pre jazyk, v ktorom hľadáme (napr. ak sme hľadali pre sk)
        // [ 'Biely pes', 'Bernský salašnícky']
        let transArr = []
        if (response.hits.total) {
            response.hits.hits.forEach(document => {
                document._source.translations.forEach((translation) => {
                    if (translation.lang === req.query.lang) {
                        transArr.push(translation.value)
                    }
                })
            });
        }

        res.send(transArr.slice(0, 5))

})

  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

