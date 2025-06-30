// const express = require('express');
// const router = express.Router();
// const { getESClient } = require('../src/elasticsearch');

// router.get('/', async (req, res) => {
//     try{
//         const client = await getESClient();
//         const result = await client.search(
//             {
//                 index: "products_1.0",
//                 body: {
//                     _source: {
//                         includes: ["categories"]
//                     },
//                     query: {
//                         match_all: {}
//                     },
//                     size: 100,
//                     from: 60
//                 }
//             }
//         );

//         const hits = result.body.hits.hits.map(hits=>hits._source);

//         res.status(200).json(hits);

//     } catch (err) {
//         console.log("Error occur while fetch ", err)
//         res.status(500).json({ error: "Failed to fetch products" });
//     }
// });

// module.export = router



// const express = require("express");
// const router = express.Router();
// const { getESClient } = require("../src/elasticsearch");

// router.get("/", async (req, res) => {
//   try {
//     const client = await getESClient();
//     const result = await client.search({
//       index: "products_1.0", 
//       body: {
//             "_source": {
//               "includes": ["category"]
//             },
//             "query": {
//               match_all: {}
//             },
//             "size": 100,
//             "from": 80
//           }
//     });

//      console.log("Result is :",result);

//     const hits = result.body.hits.hits.map(hits=>hits._source);
    
      
//     console.log("Hits are :",hits);

//     res.status(200).json(hits);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const { getESClient } = require("../src/elasticsearch");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-"); 
};

router.get("/", async (req, res) => {
  try {
    const client = await getESClient();
    const result = await client.search({
      index: "products_1.0", 
      body: {
        _source: {
          includes: ["category"]
        },
        query: {
          match_all: {}
        },
        size: 100,
        from: 80
      }
    });

    // const hits = result.body.hits.hits.map(hit => {
    //   const source = hit._source;
    //   return {
    //     ...source,
    //     categorySlug: slugify(source.category)
    //   };
    // });

    const hits = result.body.hits.hits.map(hit => {
    const source = hit._source;

    const categoryName = source?.category?.name;
    const categorySlug = categoryName ? slugify(categoryName) : null;

      return {
         ...source,
         categorySlug
        };
    });

    res.status(200).json(hits);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;














