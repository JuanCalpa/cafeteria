const request = require("supertest");
const express = require("express");
const loginRouter = require("../../src/routes/loginRouter");

jest.mock("../../src/controllers/login/loginController", () => ({
  registro: (req, res) => res.status(201).json({ mensaje: "Usuario registrado exitosamente", id: 5 }),
  login: (req, res) => res.status(200).json({ mensaje: "Inicio de sesión exitoso", usuario: { id_usuario: 1, nombre: "Ana", rol: "estudiante" }, tipo: "usuario" }),
  logout: (req, res) => res.status(200).json({ mensaje: "Sesión cerrada exitosamente" })
}));

describe("loginRouter", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api", loginRouter);
  });

  test("POST /api/registro registra usuario", async () => {
    const res = await request(app)
      .post("/api/registro")
      .send({ correo: "a@b.com", contrasena: "123", nombre: "Ana", rol: "estudiante", fecha_registro: "2025-09-19 21:55:00" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ mensaje: "Usuario registrado exitosamente", id: 5 });
  });

  test("GET /api/login inicia sesión", async () => {
    const res = await request(app)
      .get("/api/login")
      .send({ correo: "a@b.com", contrasena: "123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      mensaje: "Inicio de sesión exitoso",
      usuario: { id_usuario: 1, nombre: "Ana", rol: "estudiante" },
      tipo: "usuario"
    });
  });

  test("POST /api/logout cierra sesión", async () => {
    const res = await request(app)
      .post("/api/logout")
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ mensaje: "Sesión cerrada exitosamente" });
  });
});