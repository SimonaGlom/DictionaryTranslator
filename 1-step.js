const fs = require('fs')
const split2 = require('split2')
const { removeUnderline, removeCategory, removeConnector} = require('./utils')

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


    let m;
    let i = 0;

    readable
        .pipe(split2())
        .on('data', function (chunk) {
            //each chunk now is a separate line
            while ((m = regex.exec(chunk)) !== null) {
                
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                let value = {
                    'id': m[2],
                    'lang': m[3],
                    'value': removeConnector(removeUnderline(removeCategory(m[4])))
                }

                dictionary[m[2]] = value
            }
        })
        .on('end', () => {
            file.write(JSON.stringify(dictionary, null, ' '))
            file.end();
        });
    
}



// data de, sk from en
//parseIntoSeparateFiles('de', './data/1-step/dataDEfromENlinks.json', './data/enwiki-latest-langlinks.sql');
//parseIntoSeparateFiles('sk', './data/1-step/dataSKfromENlinks.json', './data/enwiki-latest-langlinks.sql');

//data en, sk from de
//parseIntoSeparateFiles('sk', './data/1-step/dataSKfromDElinks.json', './data/dewiki-latest-langlinks.sql');
//parseIntoSeparateFiles('de', './data/1-step/dataENfromDElinks.json', './data/dewiki-latest-langlinks.sql');



//data en, de from sk
//parseIntoSeparateFiles('en', './data/1-step/dataENfromSKlinks.json', './data/skwiki-latest-langlinks.sql');
//parseIntoSeparateFiles('de', './data/1-step/dataDEfromSKlinks.json', './data/skwiki-latest-langlinks.sql');


// data with comments de, sk from en
parseIntoSeparateFiles('de', './data/1-step-with-comments/dataDEfromENlinks.json', './data/enwiki-latest-langlinks.sql');
//parseIntoSeparateFiles('sk', './data/1-step-with-comments/dataSKfromENlinks.json', './data/enwiki-latest-langlinks.sql');

//data en, sk from de
//parseIntoSeparateFiles('sk', './data/1-step-with-comments/dataSKfromDElinks.json', './data/dewiki-latest-langlinks.sql');
//parseIntoSeparateFiles('de', './data/1-step-with-comments/dataENfromDElinks.json', './data/dewiki-latest-langlinks.sql');



//data en, de from sk
//parseIntoSeparateFiles('en', './data/1-step-with-comments/dataENfromSKlinks.json', './data/skwiki-latest-langlinks.sql');
//parseIntoSeparateFiles('de', './data/1-step-with-comments/dataDEfromSKlinks.json', './data/skwiki-latest-langlinks.sql');