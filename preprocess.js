const fs = require('fs')
const dataENFromSK = require('./data/dataENfromSKlinks.json')
const dataDEFromSK = require('./data/dataDEfromSKlinks.json')
const dataSKFromEN = require('./data/dataSKfromENlinks.json')
const dataSKFromDE = require('./data/dataDEfromENlinks.json')

/**
 *  Input: (648546,'en','Dog')
 *  Output: "648546": {
                "id": "648546",
                "lang": "en",
                "value": "dog"
                },

 * parseIntoSeparateFiles('de', './data/dataDEfromENlinks.json', './data/enwiki-latest-langlinks.sql');
 * */ 
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
                'value': removeCategory(m[4])            
            }

            dictionary[m[2]] = value
        }
    }

    file.write(JSON.stringify(dictionary, null, ' '))
    file.end();
}

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
    const file = fs.createWriteStream(pathToWrite)
    let  result = {'words': []} 

    const regex = new RegExp(`\\(([0-9]+),(.*?),(.*?),(.*?)\\)`, 'g');

    for await (const chunk of readable) {
        let m;
        let j = 0;
        while ((m = regex.exec(chunk)) !== null) {
            let objects = {}
            let trans = []
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (dataSKFromEN[+m[1]]) {
                trans.push(dataSKFromEN[+m[1]])
            }

            if (dataSKFromDE[+m[1]]) {
                trans.push(dataSKFromDE[+m[1]])
            }

            objects['id']  = m[1]
            objects['lang'] = lang
            objects['value'] = m[3].split("'")[1].split("_").join(' ')
            objects['translations'] = trans
            

            if(trans.length !== 0) {
                result.words = [...result.words, objects]
            }

            j++;
            if(j === 10000) {
                break;
            }
            
        }
        break;
    }
 
    file.write(JSON.stringify(result, null, ' '))
    file.end(); 
}


// Edit titles

//Wikipedia:Dog -> Dog
async function removeCategory(title) {
    return title.split(':').length === 1 ? title.split(':')[0] : title.split(':')[1] 
}