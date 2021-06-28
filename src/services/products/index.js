import express from "express";
import uniqid from 'uniqid'
import createError from 'http-errors'
import multer from "multer";
import { extname } from "path"
import { validationResult } from 'express-validator'
import { getProducts, writeProducts, writeProductsPicture } from "../../lib/fs-tools.js";
import { checkSearchSchema, checkReviewSchema, checkValidationResult } from "./validation.js";

const productsRouter = express.Router()

/* *********************PRODUCTS************************* */

/* GET all products */
productsRouter.get("/", async (req, res, next)=>{
    try {
        const products = await getProducts()
        res.send(products)
    } catch (error) {
        next(error)
    }
    
})

/* GET single product */
productsRouter.get("/:id", async(req, res, next)=>{
    try {
        const products = await getProducts()
        const product = products.find(u => u._id === req.params.id)
        if(product){
            res.send(product)
        }
        else{
            next(createError(404, `Product with id: ${req.params.id} not found`))
        }        
    } catch (error) {   
        next(error)
    }
})

/* POST a product */
productsRouter.post("/", async(req, res, next)=>{
    try {
        const errors = validationResult(req)
        if(errors.isEmpty()){

            const newProduct = {
                ...req.body,
                _id: uniqid(),
                reviews:[],
                createdAt: new Date()
            }            
            const products = await getProducts()
            products.push(newProduct)
            await writeProducts(products)
            res.status(201).send({_id:newProduct._id})
        }
        else{
            next(createError(400, {errorsList: errors}))
        }
    } catch (error) {
        next(error)
    }
 })

/* PUT a product */
productsRouter.put("/:id", async (req, res, next)=>{
    try {
        let products = await getProducts()
         const productIndex = products.findIndex(pro => pro._id === req.params.id)
         if(productIndex !== -1){
             let product = products[productIndex]
              product={
                  ...product,
                  ...req.body,
                  _id: req.params.id,
                  updatedAt: new Date()
              }
              products[productIndex] = product
              await writeProducts(products)
              res.send(product)            
         }
         else{
            next(createError(400, {errorsList: "error"}))
         }
        
    } catch (error) {
        next(error)
    }       
     })

/* DELETE a product */
productsRouter.delete("/:id", async(req, res, next)=>{
    try {
        const products = await getProducts()
        const remainingProducts = products.filter(pro => pro._id !== req.params.id)
        await writeProducts(remainingProducts)
        res.status(200).send(`product with id: ${req.params.id} Deleted successfully`)        
        
    } catch (error) {
        next(error)
    }
    })

/* *********************Search product************************* */

productsRouter.get("/search",checkSearchSchema, async (req, res, next) => {
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
productsRouter.get("/:id/reviews", async (req, res, next) => {
    try {
        const products = await getProducts()
        const product = products.find(product=> product._id === req.params.id)
        if(product){
            const productReview = product.reviews
            res.send(productReview)
        }
        else{
            next(createError(404, `Product with id: ${req.params.id} not found`))
        }

    } catch (error) {
        next(error)
    }
})

/* GET single review */
productsRouter.get("/:id/reviews/:revId", async (req, res, next) => {
    try {
        const products = await getProducts()
        const product = products.find(product => product._id === req.params.id)
        if(product){
            const productReviews = product.reviews
            if(productReviews){
                const singleReview = productReviews.find(review => review._id === req.params.revId)
                res.send(singleReview)
            }
        }
        else{
            next(createError(404, `Product with id: ${req.params.id} or review with id: ${req.params.revId} not found`))
        }
    } catch (error) {
        next(error)
    }
})

/* POST a review */

productsRouter.post("/:id/reviews",checkReviewSchema,checkValidationResult, async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            const products = await getProducts()
            const product = products.find(product => product._id === req.params.id)
            if(product){
                const productReviews = product.reviews
                const newReview = {
                    ...req.body,
                    _id: uniqid(),
                    createdAt: new Date()
                }
                productReviews.push(newReview)
                await writeProducts(products)
                res.status(201).send({_id: newReview._id})
            }
        }
        else{
            next(createError(400, {errorList:errors}))
        }

    } catch (error) {
        next(error)
    }
})

/* PUT a review */
productsRouter.put('/:id/reviews/:revId',checkReviewSchema,checkValidationResult,async (req,res, next)=>{
    
    try {
            const products = await getProducts()
            const productIndex = products.findIndex(product=> product._id === req.params.id)
            console.log("index", productIndex);
            if(productIndex !== -1){
                let product = products[productIndex]
                let productReviews = product.reviews
                console.log('productReviews',productReviews);
                let ProductReviewIndex = productReviews.findIndex(review => review._id === req.params.revId)
                console.log('ProductReviewIndex', ProductReviewIndex);
                let editReview = productReviews[ProductReviewIndex]
                console.log('editReview', editReview);
                console.log('Reviewbody', req.body);
                editReview ={
                    ...editReview,
                    ...req.body,
                    _id:req.params.revId,
                    updatedAt: new Date()
                }
                console.log('editReview', editReview);
                
                productReviews[ProductReviewIndex] = editReview
                await writeProducts(products)
                res.send(product) 
            }
            else{
                next(createError(400, {errorsList: "error"}))
            }        
    }catch (error) {
        next(error)
    }
})

/* DELETE a review */
productsRouter.delete('/:id/reviews/:revId',async (req,res, next)=>{

    try {
        const products = await getProducts()
        const product = products.find(product => product._id === req.params.id)
        if(product){
            const productReviews = product.reviews
            const deleteReview = productReviews.findIndex(review => review._id === req.params.revId)
            res.send(productReviews[deleteReview])
            productReviews.splice(deleteReview,1)
            await writeProducts(products)
            res.status(200)      
        }
    } catch (error) {
        next(error)
    }
})


export default productsRouter