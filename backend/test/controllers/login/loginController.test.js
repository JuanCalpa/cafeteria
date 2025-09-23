const loginController = require("../../../src/controllers/login/loginController");
const loginSql = require("../../../src/controllers/login/loginSql");

jest.mock("../../../src/controllers/login/loginSql");

describe("loginController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, session: {}, };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), clearCookie: jest.fn() };
  });

  test("registro responde con éxito", async () => {
    req.body = { correo: "a@b.com", contrasena: "123", nombre: "Ana", rol: "estudiante", fecha_registro: "2025-09-19 21:55:00" };
    loginSql.registrarUsuario.mockResolvedValue({ affectedRows: 1, insertId: 5 });
    await loginController.registro(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario registrado exitosamente", id: 5 });
  });

  test("registro responde con error de inserción", async () => {
    req.body = { correo: "a@b.com", contrasena: "123", nombre: "Ana", rol: "estudiante", fecha_registro: "2025-09-19 21:55:00" };
    loginSql.registrarUsuario.mockResolvedValue({ affectedRows: 0 });
    await loginController.registro(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "No se pudo registrar el usuario" });
  });

  test("registro responde con error de servidor", async () => {
    req.body = { correo: "a@b.com", contrasena: "123", nombre: "Ana", rol: "estudiante", fecha_registro: "2025-09-19 21:55:00" };
    loginSql.registrarUsuario.mockRejectedValue(new Error("fail"));
    await loginController.registro(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Error del servidor", error: expect.any(Error) });
  });

  test("login responde con éxito", async () => {
    req.body = { correo: "a@b.com", contrasena: "123" };
    loginSql.autenticarUsuario.mockResolvedValue({ id_usuario: 1, nombre: "Ana", rol: "estudiante" });
    await loginController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Inicio de sesión exitoso",
      usuario: { id_usuario: 1, nombre: "Ana", rol: "estudiante" },
      tipo: "usuario"
    });
    expect(req.session.usuario).toEqual({ id: 1, nombre: "Ana", rol: "estudiante" });
  });

  test("login responde con credenciales inválidas", async () => {
    req.body = { correo: "a@b.com", contrasena: "wrong" };
    loginSql.autenticarUsuario.mockResolvedValue(null);
    await loginController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Credenciales inválidas" });
  });

  test("login responde con error de servidor", async () => {
    req.body = { correo: "a@b.com", contrasena: "123" };
    loginSql.autenticarUsuario.mockRejectedValue(new Error("fail"));
    await loginController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Error del servidor", error: expect.any(Error) });
  });

  test("logout responde con éxito", async () => {
    req.session.destroy = jest.fn(cb => cb(null));
    await loginController.logout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Sesión cerrada exitosamente" });
  });

  test("logout responde con error", async () => {
    req.session.destroy = jest.fn(cb => cb(new Error("fail")));
    await loginController.logout(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al cerrar sesión" });
  });
});