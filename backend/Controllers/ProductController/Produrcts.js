const express = require("express");
const ProductModel = require("../../Model/ProductModel");
const sendProductNotification = require("../../Utils/sendProductNotification");
const ProductCategoryModel = require("../../Model/productCategoryModel")
async function allProduct(req, res) {
    try {
        const data = await ProductModel.find().populate({ path: "category" }).sort({ createdAt: -1 });

        const Productdata = await ProductModel.find().sort({ updatedAt: -1 });
        if (!data) {
            return res.status(400).json({
                message: "No products found"
            });
        }
        res.status(200).json({
            message: "Banners fetched successfully",
            data
        })

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}






async function addProduct(req, res) {
    try {
        const { name, description, price, stock, discount } = req.body;

        // Check uploaded images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Product image is required"
            });
        }
        // Convert file paths to URLs
        const imagePaths = req.files.map(file =>
             `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`
        );

       // console.log("Category from request:", req.body.category);

        const category = await ProductCategoryModel.findOne({
            _id: req.body.category.trim()
        });



        if (!category) {
            return res.status(400).json({
                message: "Category not found"
            });
        }
        
        // Create a single product instance
        const newProduct = await ProductModel.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            discount: Number(discount),
            category: category._id,
            image: imagePaths
        });

        // If the "send updates" checkbox is checked, trigger the notification email
        if (req.body.sendUpdates === "on") {
            sendProductNotification(newProduct);
        }

        // Populate the category details for the response
        const populatedProduct = await ProductModel.findById(newProduct._id)
            .populate("category", "name");

        return res.status(200).json({
            message: "Product added successfully",
            data: populatedProduct
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}





async function updateProduct(req, res) {
    try {
        const id = req.params.id;
            const ProductData = { ...req.body };
    ProductData.existingPhotos = JSON.parse(
            req.body.existingPhotos || "[]"
        );

        let imagePaths = [];

        if (req.files?.length > 0) {
        imagePaths = req.files.map(
            (file) =>
            `${req.protocol}://${req.get("host")}/${file.path.replace(
                /\\/g,
                "/"
            )}`
        );
        }

        ProductData.image = [
        ...ProductData.existingPhotos,
        ...imagePaths,
        ];
     

        if (req.files?.length > 0) {
            imagePaths = req.files.map(
                file =>`${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`
                    
            );
        }

        ProductData.image = [
            ...ProductData.existingPhotos,
            ...imagePaths,
        ];

        if (ProductData.price && ProductData.discount) {
            const discountAmount =
                (Number(ProductData.price) * Number(ProductData.discount)) / 100;

            ProductData.finalPrice =
                Number(ProductData.price) - discountAmount;
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            ProductData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    }

    catch (err) {
        console.log(err.message);
        
        return res.status(500).json({
            success: false,
            message: err.message
        }); 
    }
}




async function deleteProduct(req, res) {

    try {
        let id = req.params.id
        let data = await ProductModel.findByIdAndDelete(id)
        if (!data) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product successful delete",
        })
    }
    catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }

}

async function getTotalProducts(req, res) {
    try {
        const count = await ProductModel.countDocuments();
        res.status(200).json({ totalProducts: count });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getProductsByCategory(req, res) {
    try {
        const groupedProducts = await ProductModel.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "productcategories", // The collection name for ProductCategoryModel
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $group: {
                    _id: "$categoryDetails.name",
                    products: { $push: "$$ROOT" }
                }
            }
        ]);

        return res.status(200).json({
            message: "Products fetched successfully",
            data: groupedProducts
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = { addProduct, updateProduct, deleteProduct, allProduct, getTotalProducts, getProductsByCategory };