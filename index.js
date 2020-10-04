const fs = require('fs')
const dataEN = require('./data/dataENfromSKlinks.json')
const dataDE = require('./data/dataDEfromSKlinks.json')


async function parseIntoSeparateFiles(lang, pathToWrite, pathToRead) {
    const readable = fs.createReadStream(pathToRead, { encoding: 'utf8' });
    const file = fs.createWriteStream(pathToWrite)
    
    const regex = new RegExp(`(([0-9]+),'(${lang})','(.*?)')`, 'g')
    let dictionary = {}

    for await (const chunk of readable) {
        let m;
        while ((m = regex.exec(chunk)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let value = {
                'id': m[2],
                'lang': m[3],
                'value': m[4]
            }

            dictionary[m[2]] = value
        }
    }

    file.write(JSON.stringify(dictionary, null, ' '))
    file.end();
}

//parseIntoSeparateFiles('en', './data/dataENfromSklinks.json', './data/skwiki-latest-langlinks.sql');
//parseIntoSeparateFiles('de', './data/dataDEfromSklinks.json', './data/skwiki-latest-langlinks.sql');

async function parseLangLinks(lang, pathToWrite, pathToRead) {
    const readable = fs.createReadStream(pathToRead, { encoding: 'utf8' });
    const file = fs.createWriteStream(pathToWrite)
    let  result = {'words': []} 
    //{{}{}{}}

    const regex = new RegExp(`\\(([0-9]+),(.*?),(.*?),(.*?)\\)`, 'g');
    let regexIntoLangLinks = new RegExp(`\(id,\'(sk|en|de)\',\'(.*?)\'\)`, 'g');

    for await (const chunk of readable) {
        let m;
        while ((m = regex.exec(chunk)) !== null) {
            let objects = []
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            objects.push({
                'id': m[1],
                'lang': lang,
                'value': m[3]
            })

            if (dataEN[+m[1]]) {
                objects.push(dataEN[+m[1]])
            }

            if (dataDE[+m[1]]) {
                objects.push(dataDE[+m[1]])
            }

            result.words = [...result.words, ...objects]

            break;
        }
        break;
    }
 
    file.write(JSON.stringify(result, null, ' '))
    file.end(); 
}

parseLangLinks('sk', './data/resultFromSK.json', './data/skwiki-latest-page.sql')
