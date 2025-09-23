const request = require("supertest");
const express = require("express");
const usuariosRouter = require("../../src/routes/usuariosRouter");
const { cancelarPedido } = require("../../src/controllers/usuarios/usuariosController");

jest.mock("../../src/controllers/usuarios/usuariosController", () => ({
    crearPedido: (req, res) => res.status(201).json({ mensaje: "Pedido creado exitosamente", result: { success: true, id_pedido: 10 } }),
    consultarPedidos: (req, res) => res.status(200).json({ pedidos: [{ id_pedido: 10 }] }),
    actualizarPedido: (req, res) => res.status(200).json({ success: true }),
    cancelarPedido: (req, res) => res.status(200).json({ success: true })
}));

describe("usuariosRouter", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/api", usuariosRouter);
    });

    test("POST /api/crearPedido crea un pedido", async () => {
        const res = await request(app)
            .post("/api/crearPedido")
            .send({ id_usuario: 1, productos: [{ id_producto: 2, cantidad: 1 }] });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            mensaje: "Pedido creado exitosamente",
            result: { success: true, id_pedido: 10 }
        });
    });

    test("GET /api/consultarPedidos consulta pedidos", async () => {
        const res = await request(app)
            .get("/api/consultarPedidos")
            .send({ id_usuario: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ pedidos: [{ id_pedido: 10 }] });
    });

    test("PUT /api/actualizarPedido actualiza un pedido", async () => {
        const res = await request(app)
            .put("/api/actualizarPedido")
            .send({ id_usuario: 1, id_pedido: 10, productos: [] });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true });
    });

    test("POST /api/cancelarPedido elimina un pedido", async () => {
        const res = await request(app)
            .post("/api/cancelarPedido")
            .send({ id_usuario: 1, id_pedido: 10 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true });
    });
});