const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//MIDLEWARES
app.use(cors());
app.use(express.json());

//ROUTES

//Create product
app.post("/api/products", async (req, res) => {
  try {
    const {
      title,
      main_img,
      slide_img,
      video,
      description,
      glbmodel,
      podcast,
      rate,
      number_of_reviews,
    } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (title, main_img, slide_img, video, description, glbmodel, podcast, rate, number_of_reviews) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        title,
        main_img,
        slide_img,
        video,
        description,
        glbmodel,
        podcast,
        rate,
        number_of_reviews,
      ]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//GET ALL products
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT product_id, main_img, slide_img, title, video, description, rate, number_of_reviews FROM products"
    );

    const productStock = await pool.query(
      `SELECT
			  stock_count, product_price, product_discount_rate, discount_from, discount_till	, product_id		
			  FROM productStock`
    );

    allProducts.rows[0].product_stock = productStock.rows;

    const response = allProducts.rows.map((row) => {
      row.product_stock = productStock.rows.find(
        (stock) => stock.product_id === row.product_id
      );
      return row;
    });

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

//MAIN SLIDER HOMEPAGE
app.get("/api/homeslider", async (req, res) => {
  try {
    const allProducts = await pool.query(
      `SELECT
        product_id, 
        main_img as product_main_img,
        slide_img as product_slide_img,
        title as product_title,
        rate, 
        number_of_reviews,
        is_homepage
        FROM products
        WHERE is_homepage = true`
    );

    const productStock = await pool.query(
      `SELECT
		stock_count, product_price, product_discount_rate, discount_from, discount_till, product_id		
		FROM productStock`
    );

    allProducts.rows[0].product_stock = productStock.rows;

    const response = allProducts.rows.map((row) => {
      row.product_stock = productStock.rows.find(
        (stock) => stock.product_id === row.product_id
      );
      return row;
    });

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

//Featured products
app.get("/api/featuredproducts", async (req, res) => {
  try {
    const allProducts = await pool.query(
      `SELECT
		  product_id, 
      main_img as product_main_img,
      slide_img as product_slide_img,
      title as product_title,
      rate,
      number_of_reviews,
      is_featured
		  FROM products
		  WHERE is_featured = true`
    );

    const productStock = await pool.query(
      `SELECT
		  stock_count, product_price, product_discount_rate, discount_from, discount_till, product_id		
		  FROM productStock`
    );

    allProducts.rows[0].product_stock = productStock.rows;

    const response = allProducts.rows.map((row) => {
      row.product_stock = productStock.rows.find(
        (stock) => stock.product_id === row.product_id
      );
      return row;
    });

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

//GET SIGNLE products
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      `SELECT
			products.product_id,
			products.main_img as product_main_img,
			products.slide_img as product_slide_img,
			products.title as product_title,
			products.description as product_description,
			products.video as product_video,
      products.glbmodel as product_3D,
      products.podcast,
      products.rate,
      products.number_of_reviews,
      products.is_homepage,
      products.is_featured
			FROM products
			WHERE products.product_id = $1`,
      [id]
    );

    const productSpecs = await pool.query(
      `SELECT
			width, height, length, weight			
			FROM productSpecs WHERE product_id = $1`,
      [id]
    );

    const productGallery = await pool.query(
      `SELECT
			img			
			FROM productImages WHERE product_id = $1`,
      [id]
    );

    const productColors = await pool.query(
      `SELECT
			img, title		
			FROM productColors WHERE product_id = $1`,
      [id]
    );

    const productMaterials = await pool.query(
      `SELECT
			title			
			FROM productMaterials WHERE product_id = $1`,
      [id]
    );

    const productStock = await pool.query(
      `SELECT
			stock_count, product_price, product_discount_rate, discount_from, discount_till			
			FROM productStock WHERE product_id = $1`,
      [id]
    );

    product.rows[0].product_stock = productStock.rows;
    product.rows[0].products_specs = productSpecs.rows;
    product.rows[0].products_gallery = productGallery.rows;
    product.rows[0].product_materials = productMaterials.rows;
    product.rows[0].products_colors = productColors.rows;

    res.json(product.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/productImages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productImages = await pool.query(
      "SELECT * FROM productImages WHERE productImages.product_id = $1",
      [id]
    );
    res.json(productImages.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/productcolors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productcolors = await pool.query(
      "SELECT * FROM productcolors WHERE productcolors.product_id = $1",
      [id]
    );
    res.json(productcolors.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/Materials", async (req, res) => {
  try {
    const productMaterials = await pool.query("SELECT * FROM productMaterials");
    res.json(productMaterials.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/Materials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productMaterials = await pool.query(
      "SELECT * FROM productMaterials WHERE productMaterials.product_id = $1",
      [id]
    );
    res.json(productMaterials.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
