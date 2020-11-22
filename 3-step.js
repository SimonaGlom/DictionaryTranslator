
var elasticsearch = require('elasticsearch');
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const INDEX_NAME = 'dictionary_de'

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});


//migrate data
async function migrate(data) {
    for (let i = 0; i < data.words.length; i+=1000) {
        const dataset = data.words.slice(i, i + 1000)
        const body = dataset.flatMap(doc => [{ index: { _index: INDEX_NAME, _type: "_doc" } }, doc])

        await client.bulk({ body })
    }
}


const bar1 = new cliProgress.SingleBar({ format: '{bar} {percentage}% | ETA: {eta_formatted} | {value}/{total} | duration: {duration_formatted}' }, cliProgress.Presets.shades_classic);
fs.readdirAsync('./data/2-step/DE').then(async function (directories) {
    bar1.start(directories.length, 0);

    for (let j = 0; j < directories.length; j++) {
        const data = fs.readFileSync('./data/2-step/DE/' + directories[j], 'utf8')
        await migrate(JSON.parse(data))
        bar1.increment();
    }
    
});

bar1.stop();


module.exports = client;