const Promise = require('bluebird');
const fs = require('fs');

/** 
* Skript spája wikipédie zo súboru ./data/2-step-with-comments/ podľa rovnakých id. Spojené wikipédie sa ukladajú do ./data/3-step/with-comments
*
* Všetky prípady:
* Id je vo viacerých wikipédiách, pripáda sa len jeden záznam
* Id sa nachádza len v jednej wikipédii, pridá sa záznam
* 
* skript funguje na základe zjednodenia 
*/

let file_name_iterator = 0
let result = {words: []}
fs.readdir('./data/2-step-with-comments/EN', function (err, directories) {
    for (let j = 5985; j < directories.length; j++) {
        const data = require('./data/2-step-with-comments/EN/' + directories[j], 'utf8')

        let dataSK = {};
        try {
            dataSK = require('./data/2-step-with-comments/SK/result-' + j, 'utf8')
        } catch (e) {

        }

        let dataDE = {};
        try {
            dataDE = require('./data/2-step-with-comments/DE/result-' + j, 'utf8')
        } catch (e) {

        }

        if(data) {
            Object.values(data).forEach(item => {
                result.words.push({"translations": item})
            });
        }

        if(Object.keys(dataSK).length) {
            Object.entries(dataSK).forEach((item) => {
                if (!data[item[0]]) {
                    result.words.push({ "translations": item[1] })
                }
            })
        }

        if(dataDE) {
            Object.entries(dataDE).forEach((item) => {
                if (!data[item[0]] || !data[item[0]]) {
                    result.words.push({ "translations": item[1] })
                }
            })
        }
       
        if(j % 4 === 0) {
            fs.writeFileSync('./data/3-step/with-comments/result' + '-' + file_name_iterator + '.json', JSON.stringify(result, null, ' '), function (err) {
                if (err) return console.log(err);
            })
            file_name_iterator++;
            result = { words: [] };
        }

    }
     
});