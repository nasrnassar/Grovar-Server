const express = require("express");
const app = express();
const cors = require("cors");

const dataCategories = require("./api/categories.json");
const dataProducts = require("./api/products.json");
const dataHomeSlider = require("./api/hpSlider.json");

//MIDLEWARES
app.use(cors());
app.use(express.json());

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get("/API/products", function (req, res) {
  res.send(dataProducts);
});

app.get("/API/categories", function (req, res) {
  res.send(dataCategories);
});

app.get("/API/homeslider", function (req, res) {
  res.send(dataHomeSlider);
});

app.get("/API/products/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  dataProducts.forEach((product) => {
    if (product.product_id === id) {
      found = true;
      return res.json(product);
    }
  });
  if (!found) {
    res.status(404).json("No such product");
  }
});

app.listen(5002, () => {
  console.log("Server has started on port 5002");
});
