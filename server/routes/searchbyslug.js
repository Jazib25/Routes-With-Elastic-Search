const express = require('express');
const router = express.Router();
const { getESClient } = require('../src/elasticsearch');

router.get('/', async (req, res) => {
  const slug = req.query.categorySlug;
  //const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
  const limit = parseInt(req.query.limit,10)|| 100;
  const page = parseInt(req.query.page,10)|| 15;

  console.log("Category slug is:", slug);
  console.log("Limit is:", limit);
  console.log("Page is:", page);
  if (!slug) 
    {
     return res.status(400).json({ error: 'Missing category slug in query' });
    }

  try {
    const client = await getESClient();

    const result = await client.search({
      index: 'products_1.0',
      body: {
        query: {
          term: {
            "category.slug": slug  
            
          }
        },
        size:limit,
        from:page   
      }
    });

    const hits = result.body.hits.hits.map(hit => hit._source);
    //console.log("Hits:", hits);

    if (hits.length === 0) 
    {
      return res.status(404).json({ error: 'No products found for this category' });
    }
    
    const arr= {
            slug: slug,
            pageno:page,
            limit:limit,
            data:hits
    }
    //console.log("Category name is :", arr);
    res.status(200).json(arr);
  } catch (err) {
    console.error('Elasticsearch error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



