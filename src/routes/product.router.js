import { Router } from"express";
import ProductManager from "../managers/ProductManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });

    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.pid);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });

    }
});

router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.thumbnail = req.file.filename;
        }
        const product = await productManager.insertOne(data);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params.pid, req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });

    }
});

router.delete("/:pid", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.pid);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });

    }
});

export default router;