const express = require('express');
const router = express.Router();
const { getESClient } = require('../src/elasticsearch');

router.get('/', async (req, res) => {
  const productName = req.query.name;
  console.log("Product name is :", productName," req param is :", req.query.name);
  if (!productName) {
    return res.status(400).json({ error: 'Missing product name in query' });
  }

  try {
    const client = await getESClient();

    const result = await client.search({
      index: 'products_1.0',
      body: {
        query: {
          wildcard: {
            "name": {
              //value: `*${productName}*`, 
              //case_insensitive: true     
               value: productName
            }
          }
        },
        size: 1
      }
    });

    const hits = result.body.hits.hits.map(hit => hit._source);
    console.log("Hit is ", hits[0]);

    if (hits.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(hits);
  } catch (err) {
    console.error('Elasticsearch error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

