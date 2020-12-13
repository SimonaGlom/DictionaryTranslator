
var elasticsearch = require('elasticsearch');
var INDEX_NAME = 'dictionary' 

var client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'],
    apiVersion: "6.8"
});

client.indices.delete({
    index: INDEX_NAME
})

/**
 * Vytvorí index s mappingom do elasticsearch
 * 
 * standard - Unicode Text Segmentation algorithm -> The [ The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone ]
 * filter - lowercase, asciifolding
 * tokenizer - standard, ngram_tokenizer
 */
client.indices.create({
    index: INDEX_NAME,
    body: {
        "settings": {
            "analysis": {
                "analyzer": {
                    "vinf_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": [
                            "lowercase",
                            "asciifolding"
                        ]
                    },
                    "ngram_analyzer": {
                        "type": "custom",
                        "tokenizer": "ngram_tokenizer"
                    },
                },
                "tokenizer": {
                    "ngram_tokenizer": {
                        "type": "ngram",
                        "min_gram": 3,
                        "max_gram": 5,
                        "token_chars": [
                            "letter",
                            "digit"
                        ]
                    }
                }
            }
        },
        "mappings": {
            "_doc": {
                "properties": {
                    "translations": {
                        "type": "nested", "properties": {
                            "id": { "type": "keyword" },
                            "lang": { "type": "keyword" },
                            "value": { "type": "text", 
                            "analyzer": "vinf_analyzer",
                            "fields": {
                                "autocomplete": {
                                    "type": "text",
                                    "analyzer": "ngram_analyzer"
                                }
                            }
                        }
                        }
                    }
                }
            }

        }
    }
}, function (err, resp, respcode) {
    console.log(err, resp, respcode);
});
