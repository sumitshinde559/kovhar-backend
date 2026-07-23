const fs = require("fs");
const path = require("path");

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");

initializeDatabase();

async function seedProducts() {
  try {
    const jsonPath = path.join(__dirname, "products.json");

    const products = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    //await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`${products.length} products seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
