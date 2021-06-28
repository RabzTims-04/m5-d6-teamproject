import express from "express";
import uniqid from 'uniqid'
import createError from 'http-errors'
import multer from "multer";
import { extname } from "path"
import { getProducts, writeProducts, writeProductsPicture } from "../../lib/fs-tools.js";
import { checkSearchSchema, checkValidationResult } from "./validation.js";

const productsRouter = express.Router()

/* *********************PRODUCTS************************* */

/* GET all products */

/* GET single product */

/* POST a product */

/* PUT a product */

/* DELETE a product */

/* *********************Search product************************* */

productsRouter.get("/search",checkSearchSchema,checkValidationResult, async (req, res, next) => {
    try {
        const {category} = req.query
        const products = await getProducts()
        const filtered = products.filter(product => product.category.toLowerCase().includes(category.toLowerCase()))
        res.send(filtered)
        
    } catch (error) {
        next(error)
    }
})

/* *********************POST Image of product************************* */

/* POST an Image to a specific product */
productsRouter.post('/:id/upload',multer().single("image"),async (req,res, next)=>{

    try { 
        console.log(req.body);
        const fileName = req.file.originalname.slice(-4)
        const newFileName = req.params.id.concat(fileName)
        const url = `http://localhost:3002/img/products/${req.params.id}${extname(req.file.originalname)}`
        console.log(newFileName);
        await writeProductsPicture(newFileName, req.file.buffer)
        console.log(url);
        const products = await getProducts()
        const product = products.find(product => product._id === req.params.id)
        if(product){
            product.image = url
            await writeProducts(products)
        }
        res.send(product.image)      
        
    } catch (error) {
        next(error)
    }
})

/* *********************REVIEWS************************* */

/* GET all reviews */

/* GET single review */

/* POST a review */

/* PUT a review */

/* DELETE a review */

export default productsRouter