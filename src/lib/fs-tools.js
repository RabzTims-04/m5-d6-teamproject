import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile } = fs

const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../services/products/products.json")
const productsPublicFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/products")

export const getProducts = ()=> readJSON(productsJSONPath)
export const writeProducts = content => writeJSON(productsJSONPath, content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

export const writeProductsPicture = (fileName, content) => writeFile(join(productsPublicFolderPath, fileName), content)


