
var elasticsearch = require('elasticsearch');
const data = require('./data/resultFromSK.json')

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

client.indices.create({
    index: "dictionary",
    body: {
        "mappings": {
            "_doc": {
                "properties": {
                    "id": { "type": "text" },
                    "lang": { "type": "text" },
                    "value": { "type": "text" },
                    "translations": {
                        "type": "nested", "properties": {
                            "id": { "type": "text" },
                            "lang": { "type": "text" },
                            "value": { "type": "text" },
                        }
                    }
                }
            }
               
        }
    }
}, function (err, resp, respcode) {
    console.log(err, resp, respcode);
});

async function migrate() {
    for(let i = 0; i < data.words.length; i++) {
        console.log(data.words[i])
        console.log(
        await client.create({
            index: 'dictionary',
            type: '_doc',
            id: i,
            body: data.words[i]
        }))
    }
}

migrate().then(() => console.log('done')).catch((err) => console.log(err))





module.exports = client;