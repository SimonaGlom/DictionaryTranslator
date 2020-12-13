var elasticsearch = require('elasticsearch');
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const bar1 = new cliProgress.SingleBar({ format: '{bar} {percentage}% | ETA: {eta_formatted} | {value}/{total} | duration: {duration_formatted}' }, cliProgress.Presets.shades_classic);

let SkEnDeCount = 0
let SkEnCount = 0
let SkDeCount = 0
let EnDeCount = 0
let SkCount = 0
let DeCount = 0
let EnCount = 0

/**
* Štatistiky dát
*/

fs.readdirAsync('./data/3-step/with-comments/').then(async function (directories) {
    for (let j = 0; j < directories.length; j++) {
        const data = JSON.parse(fs.readFileSync('./data/3-step/with-comments/' + directories[j], 'utf8'))
        for (let i = 0; i < data.words.length; i++) {
            const trans = data.words[i].translations
            let languages = []

            for(let z = 0; z < trans.length; z++) {
                languages[trans[z].lang] = true
            }

            if (languages['en'] && languages['de'] && languages['sk']) {
                SkEnDeCount++;
            } else if (languages['en'] && languages['de']) {
                EnDeCount++;
            } else if (languages['en'] && languages['sk']) {
                SkEnCount++;
            } else if (languages['de'] && languages['sk']) {
                SkDeCount++;
            } else if (languages['en']) {
                EnCount++;
            } else if (languages['de']) {
                DeCount++;
            } else if (languages['sk']) {
                SkCount++;
            }

        }
        bar1.increment();
    }

}).then(() => {
    console.log('SkEnDeCount', SkEnDeCount, 'SkEnCount', SkEnCount, 'SkDeCount', SkDeCount, 'EnDeCount', SkDeCount, 'SkCount', SkCount, 'DeCount', DeCount, 'EnCount', EnCount)
    let result = {
        'SkEnDeCount': SkEnDeCount, 
        'SkEnCount': SkEnCount, 
        'SkDeCount': SkDeCount, 
        'EnDeCount': SkDeCount, 
        'SkCount': SkCount, 
        'DeCount': DeCount, 
        'EnCount': EnCount
    }
    fs.writeFileSync('./data/statistics.json', JSON.stringify(result, null, ' '), function (err) {
        if (err) return console.log(err);
    })
}
)

bar1.stop();
