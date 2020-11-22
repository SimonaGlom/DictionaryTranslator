
var elasticsearch = require('elasticsearch');
var INDEX_NAME = 'dictionary_de_2' 

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

client.indices.delete({
    index: INDEX_NAME
})

/**
 * standard - Unicode Text Segmentation algorithm -> The [ The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone ]
 * filter - lowercase
 */
client.indices.create({
    index: INDEX_NAME,
    body: {
        "settings": {
            "analysis": {
                "analyzer": {
                    "my_custom_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": [
                            "lowercase",
                            "asciifolding"
                        ]
                    }
                }
            }
        },
        "mappings": {
            "_doc": {
                "properties": {
                    "id": { "type": "text" },
                    "lang": { "type": "text" },
                    "value": { "type": "text", "analyzer": "my_custom_analyzer", },
                    "translations": {
                        "type": "nested", "properties": {
                            "id": { "type": "text" },
                            "lang": { "type": "text" },
                            "value": { "type": "text" },
                        }
                    }
                }
            }

        }
    }
}, function (err, resp, respcode) {
    console.log(err, resp, respcode);
});
