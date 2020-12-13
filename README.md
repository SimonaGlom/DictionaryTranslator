# DictionaryTranslator

### Enviroment
Node 14.13.0
Elasticsearch 6.8

### How to run

#### Spustenie predspracovania dát
V roote projektu spustiť príkaz:

$ npm install

Následne pomocou príkazu spustiť jednotlivé skripty podľa potreby:

$ node <názov_súboru>

Poradie spúšťania, aby sme sa dostali od sql súborou až po dáta v elasticsearch.

1-step.js | 2-step.js | 2a-merge.js | 2b-elasticsSetUp.js | 3-step.js 

Je nutnosť mať zdroje dát v ./data/enwiki-latest-langlinks.sql a  ./data/enwiki-latest-page.sql.

#### Spustenie klienta

v root/dictionary_app spustiť príkaz $ npm install && npm start

#### Spustenie severu

v root/express-server spustiť príkaz $ npm install && node index.js
