-- psql -U postgres
-- 123

CREATE DATABASE grovar;

CREATE TABLE products (
    product_id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    video VARCHAR(50),
    description VARCHAR(250) NOT NULL,
    glbmodel VARCHAR(250),
    price int NOT NULL,
    discount int,
)

CREATE TABLE productImages (
	gallery_id SERIAL NOT NULL PRIMARY KEY,
	img VARCHAR(255) NOT NULL,
	product_id int
)

CREATE TABLE productcolors (
	color_id SERIAL NOT NULL PRIMARY KEY,
	img VARCHAR(255) NOT NULL,
	title VARCHAR(50),
	product_id int
)

CREATE TABLE productMaterials (
	material_id SERIAL NOT NULL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	product_id int
)


CREATE TABLE productSpecs (
	specs_id SERIAL NOT NULL PRIMARY KEY,
    width int,
    height int,
    length int,
    weight int,
	product_id int
)

CREATE TABLE productStock (
	stock_id SERIAL NOT NULL PRIMARY KEY,
    stock_count int,
    product_price int,
    product_discount_rate int,
    discount_from date,
	discount_till date,
	product_id int
)


-- QUERIES STARTS HERE
CREATE OR REPLACE function getAllProducts()
AS $$
BEGIN
	SELECT
	    p.product_id,
	    p.title,
	    p.video,
	    p.description,
	    p.Price,
	    p.discount,
	    p.width,
	    p.height,
	    p.length,
	    p.weight,
	    p.glbmodel,
	    g.img,
	    pc.color_id,
	    pc.product_id,
	    pm.material_id,
	    pm.product_id,
	    pc.title AS "color",
	    pc.img,
	    pm.title as "material"
	FROM products p
	    LEFT JOIN productImages g ON g.product_id = p.product_id
	    LEFT JOIN productColors pc ON pc.product_id = p.product_id
	    LEFT JOIN productMaterials pm ON pm.product_id = p.product_id;
END;
$$ LANGUAGE sql;


INSERT INTO products (title, main_img, slide_img, video, glbmodel, podcast,	 description, price, discount, width, height, length, weight)
VALUES ('Jewlery box', './assets/products/P0-A2/images/main.png', './assets/products/P0-A2/images/slide.jpg', './mp4/jewlery_box.mp4', './models/jewlery_box.glb', '/assets/products/P0-A2/Audio/adudio.mp3', 'Lorem ipsum dolor set amet', '80000', '25', '112', '70', '33', '150');

INSERT INTO productcolors (img, title, product_id)
VALUES ('./Colors/MogFraque2575.jpg', 'Mogono & Fraque', '1');

INSERT INTO productMaterials (title, product_id)
VALUES ('Wood', '1');

INSERT INTO productSpecs (width, height, length, weight,  product_id)
VALUES ('215', '220', '15', '350', '2');

INSERT INTO productStock (stock_count, product_price, product_discount_rate, discount_from, discount_till, product_id)
VALUES ('2', '30.25', '10', '2021-02-21', '2021-03-21');


UPDATE productcolors
SET img = './Colors/FraqueMog2575.jpg' , title = 'Fraque & Mogono'
WHERE color_id = 1;

UPDATE products
SET main_img = './assets/products/P0-A2/images/main.png', slide_img = './assets/products/P0-A2/images/slide.jpg', podcast = '/assets/products/P0-A2/Audio/adudio.mp3'
WHERE product_id = 2;

UPDATE products
SET rate = 4.3, number_of_reviews = 16
WHERE product_id = 2;
