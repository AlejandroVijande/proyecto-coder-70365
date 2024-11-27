import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
    #jsonFilename;
    #products;
    constructor() {
        this.#jsonFilename = "products.json";
    }

    async #findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("Id no encontrado", 404);
        }
        return productFound;
    }

    async getAll() {
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const { title, description, code, price, status, stock, category, thumbnail } = data;

            if (!title || !description || !code || price == null || status == null || stock == null || !category) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            const allProducts = await this.getAll();
            const isCodeUnique = !allProducts.some((product) => product.code === code);

            if (!isCodeUnique) {
                throw new ErrorManager(`El código "${code}" ya está en uso`, 409);
            }

            const product = {
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail: thumbnail || null,
            };

            this.#products.push(product);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(id, data) {
        try {
            const { title, description, code, price, status, stock, category, thumbnail } = data;
            const productFound = await this.#findOneById(id);

            if (code && code !== productFound.code) {
                const allProducts = await this.getAll();
                const isCodeUnique = !allProducts.some((product) => product.code === code && product.id !== id);

                if (!isCodeUnique) {
                    throw new ErrorManager(`El código "${code}" ya está en uso`, 409);
                }
            }

            const product = {
                id: productFound.id,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code ? Number(code) : productFound.code,
                price: price ? Number(price) : productFound.price,
                status: status ? convertToBoolean(status) : productFound.status,
                stock: stock ? Number(stock) : productFound.stock,
                category: category || productFound.category,
                thumbnail: thumbnail || productFound.thumbnail,
            };

            const index = this.#products.findIndex((item) => item.id === Number(id));
            this.#products[index] = product;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            await this.#findOneById(id);

            const index = this.#products.findIndex((item) => item.id === Number(id));
            this.#products.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

}