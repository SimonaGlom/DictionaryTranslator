
var elasticsearch = require('elasticsearch');
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const INDEX_NAME = 'dictionary'

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

/**
 * Importuje dáta do vytvoreného indexu v elasticsearch v bulkoch pričom veľkosť bulku je 10000.
 */


//migrate data
async function migrate(data) {
    for (let i = 0; i < data.words.length; i+=10000) {
        const dataset = data.words.slice(i, i + 10000)
        const body = dataset.flatMap(doc => [{ index: { _index: INDEX_NAME, _type: "_doc" } }, doc])

        await client.bulk({ body })
        const bulkResponse = await client.bulk({ refresh: true, body })
        if (bulkResponse.errors) {
            const erroredDocuments = []
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    })
                }
            })
            console.log(erroredDocuments)
        }
    }
}


const bar1 = new cliProgress.SingleBar({ format: '{bar} {percentage}% | ETA: {eta_formatted} | {value}/{total} | duration: {duration_formatted}' }, cliProgress.Presets.shades_classic);
fs.readdirAsync('./data/3-step/with-comments/').then(async function (directories) {
    for (let j = 0; j < directories.length; j++) {
        const data = fs.readFileSync('./data/3-step/with-comments/' + directories[j], 'utf8')
        await migrate(JSON.parse(data))
        bar1.increment();
    }
     
}).then(() => bar1.stop(;)


module.exports = client;