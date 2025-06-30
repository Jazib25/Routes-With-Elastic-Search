const express = require('express');
const router = express.Router();
const { getESClient } = require('../src/elasticsearch');


router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const client = await getESClient();

    const result = await client.search({
      index: 'products_1.0',
      body: {
        "query": {
          "term": {
            "_id": productId
          }
        }
      }
    });

const hits = result.body.hits.hits.map(hit => hit._source);
console.log("Hit is ", hits[0]);

    if (hits.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // res.json(hits[0]); 
     res.status(200).json(hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;