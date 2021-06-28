import express from 'express'
import uniqid from 'uniqid'
import createError from 'http-errors'
import multer from 'multer'
import { extname } from "path"
import { getProducts, writeProducts, writeProductsPicture } from "../../lib/fs-tools.js";

const productsRouter = express.Router()


/*           products           */ 





/*           reviews           */ 
// note: contentJSON changed to reviews in posts


// 1. GET ALL 

productsRouter.get("/products/:id/reviews", async (req, res, next) => {
    try {
        const reviews = await getProducts()
        // const reviews = fs.readFileSync(productsJSONPath)
        // const contentJSON = JSON.parse(reviewContent)
        res.send(reviews)

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})

// 2. GET SINGLE
productsRouter.get("/products/:id/reviews/:revId", async (req, res, next) => {
    try {
        const reviews = await getProducts()
        const review = reviews.find(rev => rev._id === req.params.id )
        res.send(review)

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})

// 3. POST
productsRouter.post("/products/:id/reviews", async (req, res, next) => {
    try {
        const newReview = {...req.body, _id: uniqid(), createdAt: new Date()}

        const reviews = await getProducts()

        reviews.push(newReview)

        await writeProducts(reviews)
        
        res.send(newReview)

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})

// 4. UPDATE
productsRouter.put("/products/:id/reviews:revId", async (req, res, next) => {
    try {
        const reviews = await getProducts()

        const remainingReviews = reviews.filter(review => review.id !== req.params.id)
        modifiedReview = {...req.body, _id: req.params.id}

        remainingReviews.push(modifiedReview)

        await writeProducts(remainingReviews)
        
        res.send(modifiedReview)

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})


// 5. DELETE
productsRouter.delete("/products/:id/reviews:revId", async (req, res, next) => {
    try {
        const reviews = await getProducts()

        const remainingReviews = reviews.filter(review => review.id !== req.params.id)

        await writeProducts(remainingReviews)
        
        res.status(204).send()

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})




export default productsRouter