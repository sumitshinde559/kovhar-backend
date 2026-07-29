require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");
const authRoutes = require("./routes/auth.routes");

const app = express();

initializeDatabase();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

/* =========================================================================
   PRODUCTS
   ========================================================================= */

// 1. Create a Product

const newProduct = {
  name: "Vintage Black Kolhapuri Chappal",
  slug: "vintage-black-kolhapuri-chappal",
  brand: "KOVHAR",
  category: "Men",
  subCategory: "Premium",
  description:
    "Handcrafted premium black leather Kolhapuri chappal featuring intricate stitching and a cushioned footbed for superior comfort.",
  price: 2999,
  discountPrice: 2499,
  rating: 4.9,
  sizes: [
    {
      size: 7,
      stock: 8,
    },
    {
      size: 8,
      stock: 12,
    },
    {
      size: 9,
      stock: 15,
    },
    {
      size: 10,
      stock: 10,
    },
    {
      size: 11,
      stock: 6,
    },
  ],
  color: "Black",
  material: "Full Grain Leather",
  images: [
    "/images/products/vintage-black/front.jpg",
    "/images/products/vintage-black/side.jpg",
    "/images/products/vintage-black/top.jpg",
    "/images/products/vintage-black/sole.jpg",
    "/images/products/vintage-black/lifestyle.jpg",
  ],
  tags: ["men", "black", "premium", "traditional", "leather", "new-arrival"],
};
async function createNewProduct(productData) {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log(savedProduct);
    return savedProduct;
  } catch (error) {
    console.log("Failed to create product.", error);
  }
}

// createNewProduct(newProduct);
app.post("/products", async (req, res) => {
  try {
    const savedProduct = await createNewProduct(req.body);

    if (savedProduct) {
      res.status(201).json({
        message: "Product created successfully.",
        product: savedProduct,
      });
    } else {
      res.status(400).json({
        error: "Unable to create product.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to create product.",
    });
  }
});

// 2. Get All Products

async function readAllProducts() {
  try {
    const products = await Product.find();
    console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

//readAllProducts();

app.get("/products", async (req, res) => {
  try {
    const products = await readAllProducts();

    if (products.length !== 0) {
      res.status(200).json({
        message: "Products retrieved successfully.",
        products,
      });
    } else {
      res.status(404).json({
        error: "No products found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to load products.",
    });
  }
});

// 3. Get Product By Slug

async function getProductBySlug(productSlug) {
  try {
    const product = await Product.findOne({
      slug: productSlug,
    });
    console.log(product);
    return product;
  } catch (error) {
    console.log(error);
  }
}

//getProductBySlug("kovhar-maharaja-heritage-kolhapuri");

app.get("/products/slug/:productSlug", async (req, res) => {
  try {
    const product = await getProductBySlug(req.params.productSlug);

    if (product) {
      res.status(200).json({
        message: "Product found.",
        product,
      });
    } else {
      res.status(404).json({
        error: "Product not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to load product.",
    });
  }
});

// 4. Get Product By ID

async function getProductById(productId) {
  try {
    const product = await Product.findById(productId);
    console.log(product);
    return product;
  } catch (error) {
    console.log(error);
  }
}

//getProductById("6a50d43505ae6e1fc1ce7867");

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);

    if (product) {
      res.status(200).json({
        message: "Product found.",
        product,
      });
    } else {
      res.status(404).json({
        error: "Product not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to load product.",
    });
  }
});

// 5. Get Products By Category

async function getProductsByCategory(categoryName) {
  try {
    const products = await Product.find({
      category: categoryName,
    });
    console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

//getProductsByCategory("Men");

app.get("/products/category/:categoryName", async (req, res) => {
  try {
    const products = await getProductsByCategory(req.params.categoryName);

    if (products.length !== 0) {
      res.status(200).json({
        message: "Products retrieved successfully.",
        products,
      });
    } else {
      res.status(404).json({
        error: "No products found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to load products.",
    });
  }
});

// 6. Get Products By Minimum Rating

async function getProductsByMinRating(minRating) {
  try {
    const products = await Product.find({
      rating: {
        $gte: minRating,
      },
    });
    console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

//getProductsByMinRating(4.0);

app.get("/products/rating/:minRating", async (req, res) => {
  try {
    const products = await getProductsByMinRating(Number(req.params.minRating));

    if (products.length !== 0) {
      res.status(200).json({
        message: "Products retrieved successfully.",
        products,
      });
    } else {
      res.status(404).json({
        error: "No products found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to load products.",
    });
  }
});

// 7. Sort Products By Price

async function getProductsSortedByPrice(order) {
  try {
    const sortDirection = order === "high-to-low" ? -1 : 1;

    const products = await Product.find().sort({
      price: sortDirection,
    });
    console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

//getProductsSortedByPrice("high-to-low");

app.get("/products/sort/:order", async (req, res) => {
  try {
    const products = await getProductsSortedByPrice(req.params.order);

    if (products.length !== 0) {
      res.status(200).json({
        message: "Products sorted successfully.",
        products,
      });
    } else {
      res.status(404).json({
        error: "No products found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to sort products.",
    });
  }
});

// 8. Update Product By ID

async function updateProductById(productId, dataToUpdate) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      dataToUpdate,
      {
        new: true,
      },
    );
    console.log(updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.log(error);
  }
}

app.patch("/products/:productId", async (req, res) => {
  try {
    const updatedProduct = await updateProductById(
      req.params.productId,
      req.body,
    );

    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully.",
        updatedProduct,
      });
    } else {
      res.status(404).json({
        error: "Product not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to update product.",
    });
  }
});

// 9. Update Product By Slug

async function updateProductBySlug(productSlug, dataToUpdate) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        slug: productSlug,
      },
      dataToUpdate,
      {
        new: true,
      },
    );

    return updatedProduct;
  } catch (error) {
    console.log(error);
  }
}

app.patch("/products/slug/:productSlug", async (req, res) => {
  try {
    const updatedProduct = await updateProductBySlug(
      req.params.productSlug,
      req.body,
    );

    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully.",
        updatedProduct,
      });
    } else {
      res.status(404).json({
        error: "Product not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to update product.",
    });
  }
});

// Bulk update all products
app.put("/products", async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided.",
      });
    }

    const result = await Product.updateMany(
      {}, // Update all products
      {
        $set: updates,
      },
    );

    res.status(200).json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/products/update-images", async (req, res) => {
  const products = await Product.find();

  for (const product of products) {
    product.images = [
      `/images/products/${product.slug}/top.png`,
      `/images/products/${product.slug}/side.png`,
      `/images/products/${product.slug}/front.png`,
    ];

    await product.save();
  }

  res.json({ success: true });
});

// 10. Delete Product

async function deleteProductById(productId) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    return deletedProduct;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/products/:productId", async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.productId);

    if (deletedProduct) {
      res.status(200).json({
        message: "Product deleted successfully.",
        deletedProduct,
      });
    } else {
      res.status(404).json({
        error: "Product not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete product.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
