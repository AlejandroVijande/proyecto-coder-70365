import express from "express";
import paths from "./utils/paths.js";

import routerProducts from "./routes/product.router.js";
import routerCarts from "./routes/cart.router.js";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/public", express.static(paths.public));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});