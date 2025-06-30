const express = require("express");
const router = express.Router();
const { getESClient } = require("../src/elasticsearch");
const fs = require('fs');

router.get("/", async (req, res) => {
  try {
    const client = await getESClient();
    const result = await client.search({
      index: "products_1.0", 
      body: {
        _source: {
          includes: ["category.slug"]
        },
        query: {
          exists: {
            field: "category.slug"
          }
        },
        size: 10000, 
        from: 0
      }
    });

    const hits = result.body.hits.hits.map(hit => hit._source);

    const uniqueSlugsMap = new Map();

    hits.forEach(item => {
      const slug = item?.category?.slug;
      if (slug && !uniqueSlugsMap.has(slug)) {
        uniqueSlugsMap.set(slug, item);
      }
    });
    const arr = Array.from(uniqueSlugsMap.values());
    const arr1 = Array.from(uniqueSlugsMap.keys()).map(
      slug => `http://localhost:3001/${slug}`
    );

    console.log("Slug URLs:", arr1);



    // Create XML structure
       const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${arr1
         .map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`)
         .join('\n')}
       </urlset>`;

     // Write to XML file
     fs.writeFileSync('sitemap.xml', xmlContent);
     
     console.log('sitemap.xml generated successfully!');
     
         res.status(200).json(arr);
       } catch (err) {
         console.error("Error fetching products:", err);
         res.status(500).json({ error: "Failed to fetch products" });
       }
     });

module.exports = router;

