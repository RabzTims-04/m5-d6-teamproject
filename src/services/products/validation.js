import { checkSchema, validationResult } from "express-validator";



const searchSchema = {
    category:{
        in:["query"],
        isString:{
            errorMessage:"category must be a string"
        }
    }
}

export const checkSearchSchema = checkSchema(searchSchema)

export const checkValidationResult = (req, res, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error("Product vlidation is failed")
        error.status = 400
        next(error)
    }
    next()
}