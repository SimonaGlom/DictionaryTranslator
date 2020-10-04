const fs = require('fs')

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

parseIntoSeparateFiles('en', './data/dataENfromSklinks.json', './data/skwiki-latest-langlinks.sql');
parseIntoSeparateFiles('de', './data/dataDEfromSklinks.json', './data/skwiki-latest-langlinks.sql');
