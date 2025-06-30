const express = require("express");
const router = express.Router();
const { getESClient } = require("../src/elasticsearch");

router.get("/", async (req, res) => {
  try {
    const client = await getESClient();
    const result = await client.search({
      index: "products_1.0", 
      body: {
            "_source": {
              "includes": ["name","category","subcategory","manufacturers"]
            },
            "query": {
              match_all: {}
            },
            "size": 100,
            "from": 80
          }
    });

     console.log("Result is :",result);
    //  const hits = result.body.hits.hits.map(hit => ({
    //  name: hit._source.name,
    //  category: hit._source.category,
    //  subcategory: hit._source.subcategory,
    //  manufacturers: hit._source.manufacturers,
    //  }));

    const hits = result.body.hits.hits.map(hits=>hits._source);
    
      
    console.log("Hits are :",hits);

    res.status(200).json(hits);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;













