const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//MIDLEWARES
app.use(cors());
app.use(express.json());


//ROUTES


//Create product
app.post("/grovar/api/products", async(req, res) => {
	try{
		const {title, video, description, glbmodel, rate, number_of_reviews} = req.body;
		const newProduct = await pool.query(
			"INSERT INTO products (title, video, description, glbmodel, rate, number_of_reviews) VALUES ($1,$2,$3,$4,$5,$6)",
			[title, video, description, glbmodel, rate, number_of_reviews]
		);

		res.json(newProduct.rows[0]);
	} catch(err){
		console.error(err.message);
	}
});

//GET ALL products
app.get("/grovar/api/products", async(req, res) => {
	try{
		const allProducts = await pool.query(
			"SELECT product_id, title, video, description FROM products"
		);

		res.json(allProducts.rows);
	} catch(err){
		console.error(err.message);
	}
});

//GET SIGNLE products
app.get("/grovar/api/products/:id", async(req, res) => {
	try{
		const {id} = req.params;
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
		)

		const productSpecs = await pool.query(
			`SELECT
			width, height, length, weight			
			FROM productSpecs WHERE product_id = $1`,
			[id]
		)

		const productGallery = await pool.query(
			`SELECT
			img			
			FROM productImages WHERE product_id = $1`,
			[id]
		)

		const productColors = await pool.query(
			`SELECT
			img, title		
			FROM productColors WHERE product_id = $1`,
			[id]
		)

		const productMaterials = await pool.query(
			`SELECT
			title			
			FROM productMaterials WHERE product_id = $1`,
			[id]
		)

		const productStock = await pool.query(
			`SELECT
			stock_count, product_price, product_discount_rate, discount_from, discount_till			
			FROM productStock WHERE product_id = $1`,
			[id]
		)

		
		product.rows[0].product_stock = productStock.rows;
		product.rows[0].products_specs = productSpecs.rows;
		product.rows[0].products_gallery = productGallery.rows;
		product.rows[0].product_materials = productMaterials.rows;
		product.rows[0].products_colors = productColors.rows;

		let  galleryList = product.rows;

		i = 0,
		j = galleryList.length - 1,
		current = "";

		for (;i < galleryList.length; i++) {
		  current = galleryList[i];
		  for (;j > i; j--) {
		    if (current.gallery === galleryList[j].gallery) {
		       if (Array.isArray(current.gallery)) {
		         current.gallery = current.gallery.concat([galleryList[j].gallery]);
		       } else {
		         	current.galleryList = [].concat([galleryList[j].gallery, current.gallery]);
		       }
		       galleryList.splice(j, 0);
		    }

		  }
		} 
		
		res.json(product.rows);

		console.log(galleryList);

	} catch(err){
		console.error(err.message);
	}
});

// app.get("/grovar/api/products/:id", async(req, res) => {
// 	try{
// 		const {id} = req.params;
// 		const product = await pool.query(
// 			"SELECT * FROM products WHERE products.product_id = $1", [id]
// 		)
// 		res.json(product.rows[0]);
// 	} catch(err){
// 		console.error(err.message);
// 	}
// });

app.get("/grovar/api/productImages/:id", async(req, res) => {
	try{
		const {id} = req.params;
		const productImages = await pool.query(
			"SELECT * FROM productImages WHERE productImages.product_id = $1", [id]
		)
		res.json(productImages.rows);
	} catch(err){
		console.error(err.message);
	}
});

app.get("/grovar/api/productcolors/:id", async(req, res) => {
	try{
		const {id} = req.params;
		const productcolors = await pool.query(
			"SELECT * FROM productcolors WHERE productcolors.product_id = $1", [id]
		)
		res.json(productcolors.rows);
	} catch(err){
		console.error(err.message);
	}
});

app.get("/grovar/api/productMaterials/:id", async(req, res) => {
	try{
		const {id} = req.params;
		const productMaterials = await pool.query(
			"SELECT * FROM productMaterials WHERE productMaterials.product_id = $1", [id]
		)
		res.json(productMaterials.rows);
	} catch(err){
		console.error(err.message);
	}
});

app.listen(5001, () => {
	console.log('Server has started on port 5001');
});