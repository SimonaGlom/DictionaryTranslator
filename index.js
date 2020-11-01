var express = require('express')
var app = express()
var elasticsearch = require('elasticsearch')


const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
}) 

/**
 *  const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
  });

 */