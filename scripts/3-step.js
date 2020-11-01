
var elasticsearch = require('elasticsearch');
const data = require('./data/resultFromEN.json')

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});


//migrate data
async function migrate() {
    for (let i = 0; i < data.words.length; i++) {
        await client.create({
            index: 'dictionary',
            type: '_doc',
            id: i,
            body: data.words[i]
        })
    }
}

migrate().then(() => console.log('done')).catch((err) => console.log(err))

module.exports = client;