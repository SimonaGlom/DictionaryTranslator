/**
 *  Input: (648546,'en','Dog')
 *  Output: "648546": {
                "id": "648546",
                "lang": "en",
                "value": "dog"
                },

 * parseIntoSeparateFiles('de', './data/dataDEfromENlinks.json', './data/enwiki-latest-langlinks.sql');
 * */
function parseIntoSeparateFiles(lang, pathToWrite, pathToRead) {
    const readable = fs.createReadStream(pathToRead, { encoding: 'utf8' });
    const file = fs.createWriteStream(pathToWrite)

    const regex = new RegExp(`(([0-9]+),'(${lang})','(.*?)')`, 'g')
    let dictionary = {}

    for (const chunk of readable) {
        let m;
        while ((m = regex.exec(chunk)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let value = {
                'id': m[2],
                'lang': m[3],
                'value': removeDescription(removeCategory(m[4]))
            }

            dictionary[m[2]] = value
        }
    }

    file.write(JSON.stringify(dictionary, null, ' '))
    file.end();
}

// Edit titles

// Wikipedia:Dog -> Dog
function removeCategory(title) {
    return title.split(':').length === 1 ? title.split(':')[0] : title.split(':')[1]
}

// Dog (animal) -> Dog
function removeDescription(title) {
    return title.split('(')[0].trim() 
}
