const express = require('express');
const router =express.Router();
const {getESClient} = require('../src/elasticsearch');

router.get('/', async (req, res) => {
    try{

        const client =await getESClient();
        const result = await client.search({
            index: 'products_1.0',
            body:{
                "query": {
                       "bool": {
                         "must": [
                           { "term": { "is_deleted": false } },
                           { "term": { "online": true } }
                         ]
                       }
                     },
                     "size": 100,
                      "from": 0
                   
            }
           });

                const hits =result.body.hits.hits.map(hits =>hits._source);

                res.status(200).json(hits);
            }
     catch(err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

module.exports= router;