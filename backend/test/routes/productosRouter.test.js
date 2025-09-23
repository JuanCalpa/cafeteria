const request = require("supertest");
const express = require("express");
const productosRouter = require("../../src/routes/productosRouter");


jest.mock("../../src/controllers/productos/productosController", () => ({
    getProductos: (req, res) => res.json([{ id_producto: 1, nombre: "Café" }]),
    getProductoById: (req, res) => res.json({ id_producto: req.query.id_producto, nombre: "Té" }),
    createProducto: (req, res) => res.status(201).json({ message: "Producto creado", id: 99 }),
    updateProducto: (req, res) => res.json({ message: "Producto actualizado", affectedRows: 1 }),
    deleteProducto: (req, res) => res.json({ message: "Producto eliminado", affectedRows: 1 })
}));

describe("productosRouter", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/productos", productosRouter);
    });

    test("GET /productos/productos devuelve lista de productos", async () => {
        const res = await request(app).get("/productos/productos");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ id_producto: 1, nombre: "Café" }]);
    });

    test("GET /productos/productoById?id_producto=2 devuelve un producto", async () => {
        const res = await request(app).get("/productos/productoById?id_producto=2");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id_producto: "2", nombre: "Té" });
    });

    test("POST /productos/createProducto crea un producto", async () => {
        const res = await request(app)
            .post("/productos/createProducto")
            .send({ nombre: "Pan", descripcion: "Integral", precio: 5, stock: 10, categoria: "Alimentos" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: "Producto creado", id: 99 });
    });

    test("PUT /productos/updateProducto/2 actualiza un producto", async () => {
        const res = await request(app)
            .put("/productos/updateProducto/2")
            .send({ nombre: "Pan", descripcion: "Integral", precio: 6, stock: 8, categoria: "Alimentos" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Producto actualizado", affectedRows: 1 });
    });

    test("DELETE /productos/deleteProducto/1 elimina un producto", async () => {
        const res = await request(app).delete("/productos/deleteProducto/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Producto eliminado", affectedRows: 1 });
    });
});
