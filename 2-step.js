const dataENFromSK = require('./data/1-step-with-comments/dataSKfromENlinks.json')
const dataDEFromSK = require('./data/1-step-with-comments/dataDEfromENlinks.json')

const fs = require('fs')
const split2 = require('split2')
const { removeDescription, removeCategory, removeUnderline } = require("./utils.js");
 
/** 
 * Input: (648546,0,'Pes',' ',1,1,0.14416983927,'20200530084510','20200408190135',7013769,32,'wikitext',NULL)
 * Output: {
   "id": "670",
   "lang": "en",
   "value": "Dog",
   "translations": [
    {
     "id": "670",
     "lang": "sk",
     "value": "Pes"
    },
    {
     "id": "670",
     "lang": "de",
     "value": "Hund"
    }
   ]
  },
* parseLangLinks('en', './data/resultFromEN.json', './data/enwiki-latest-page.sql')
*/
async function parseLangLinks(lang, pathToWrite, pathToRead) {
    const readable = fs.createReadStream(pathToRead, { encoding: 'utf8' });

    const regex = new RegExp(`\\(([0-9]+),(.*?),(.*?),(.*?)\\)`, 'g');
    let m;
    let samples_count = 0
    let file_name_iterator = 0 

    let id = 0
    let lastId = 10000
    let result = {}
    readable
        .pipe(split2())
        .on('data', function (chunk) {
            //each chunk now is a separate line
            while ((m = regex.exec(chunk)) !== null) {
                let trans = []
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                if (dataENFromSK[+m[1]]) {
                    trans.push(dataENFromSK[+m[1]])
                }

                if (dataDEFromSK[+m[1]]) {
                    trans.push(dataDEFromSK[+m[1]])
                }

                trans.push({
                    'id': m[1],
                    'lang': lang,
                    'value': removeDescription(removeCategory(removeUnderline(m[3])))
                })

                result[m[1]] = trans
                id = m[1]

                if (+id > lastId) {
                    const file = fs.createWriteStream(pathToWrite + '-' + file_name_iterator + '.json')
                    file.write(JSON.stringify(result, null, ' '))
                    file.end();
                    result = {}
                    samples_count = 0
                    file_name_iterator++
                    operator = false
                    lastId += 10000
                }
            }            
        })
        .on('end', () => {
            const file = fs.createWriteStream(pathToWrite + '-' + file_name_iterator + '.json')
            file.write(JSON.stringify(result, null, ' '))
            file.end();
            samples_count = 0
            file_name_iterator++
        });
}

//parseLangLinks('sk', './data/2-step-with-comments/SK/result', './data/skwiki-latest-page.sql')
//parseLangLinks('de', './data/2-step-with-comments/DE/result', './data/dewiki-latest-page.sql')
parseLangLinks('en', './data/2-step-with-comments/EN/result', './data/enwiki-latest-page.sql')