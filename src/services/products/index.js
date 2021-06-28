import express from 'express'
import uniqid from 'uniqid'
import createError from 'http-errors'
import multer from 'multer'
import { extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const productsRouter = express.Router()

const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)),  'products.json')

const getProducts = ()=>{
    const content = fs.readFileSync(productsJSONPath)
    return JSON.parse(content)
}

const writeProducts = (content) => fs.writeFileSync(productsJSONPath, JSON.stringify(content))

productsRouter.get("/", (req, res)=>{
    const products = getProducts()
    res.send(products)

})
productsRouter.get("/:id", (req, res)=>{
    const products = getProducts()
    const product = products.find(u => u._id === req.params.id)
    res.send(product)
})

productsRouter.post("/", (req, res)=>{
     const { name, description, brand, imageUrl, price, category} = req.body
     const newProduct = {
         _id: uniqid(),
         name,
         description,
          brand, 
          imageUrl, 
          price, 
          category, 
          createdAt: new Date(),
          updatedAt: new Date()  }
    const products = getProducts()
    products.push(newProduct)
    writeProducts(products)
    res.status(201).send()
})
productsRouter.put("/:id", (req, res)=>{
    let products = getProducts()
    const productIndex = products.findIndex(pro => pro._id === req.params.id)
    if(!productIndex == -1){
        res.status(404).send({message: `Product with ${req.params.id} is not found! sayonara ;) `})
    } 
    const prevProductData = products[productIndex]
    const changedProduct = {...prevProductData, ...req.body, updatedAt: new Date(), _id: req.params.id}
    products[productIndex] = changedProduct
    writeProducts(products)
    res.send(changedProduct)


})
productsRouter.delete("/:id", (req, res)=>{
    const products = getProducts()
    const remainingProducts = products.filter(pro => pro._id !== req.params.id)
    writeProducts(remainingProducts)
    res.status(204).send()
})


export default productsRouter