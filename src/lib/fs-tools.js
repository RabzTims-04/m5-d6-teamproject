import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const {readJSON, writeJSON, writeFile} = fs
const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../services/products/products.json")
const productsPublicFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/products")

const getProducts = ()=>{
    const content = fs.readFileSync(productsJSONPath)
    return JSON.parse(content)
}

const writeProducts = (content) => fs.writeFileSync(productsJSONPath, JSON.stringify(content))