const {connectElasticDB} = require("./src/elasticsearch");
const elasticrouter = require("./routes/elastic");
const condition = require("./routes/condition");
const search = require("./routes/searchbyparam");
const searchbyid = require("./routes/searchbyID");
const urlslug = require ("./routes/slugs");
const sluglist = require("./routes/sluglist");
const slugproduct = require("./routes/searchbyslug");
const express = require("express");
const app = express();
const PORT = 3003;

(async () => {
  try {
    await connectElasticDB();

  } 
  catch (err) {
    console.error("Elasticsearch connection failed:", err);
  }
})();



app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/products", elasticrouter);
app.use("/condition", condition);
app.use("/search", search);
app.use("/searchbyid", searchbyid);
app.use("/slug",urlslug);
app.use("/sluglist",sluglist);
app.use("/slugproduct",slugproduct);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});














