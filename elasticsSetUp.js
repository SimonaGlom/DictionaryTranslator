
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

client.indices.delete({
    index: "dictionary"
})

/**
 * standard - Unicode Text Segmentation algorithm -> The [ The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone ]
 * filter - lowercase
 */
client.indices.create({
    index: "dictionary",
    body: {
        "settings": {
            "analysis": {
                "analyzer": {
                    "my_custom_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": [
                            "lowercase"
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
                    "value": { "type": "text" },
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
