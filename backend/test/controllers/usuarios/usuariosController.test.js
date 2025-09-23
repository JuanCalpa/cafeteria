const usuariosController = require("../../../src/controllers/usuarios/usuariosController");
const pedidosSql = require("../../../src/controllers/usuarios/usuariosSql");

jest.mock("../../../src/controllers/usuarios/usuariosSql");

describe("usuariosController", () => {
  let req, res;

 beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  req = { body: {} };
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
});

  test("crearPedido responde con éxito", async () => {
    req.body = { id_usuario: 1, productos: [{ id_producto: 2, cantidad: 1 }] };
    pedidosSql.crearPedido.mockResolvedValue({ success: true, id_pedido: 10 });
    await usuariosController.crearPedido(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Pedido creado exitosamente",
      result: { success: true, id_pedido: 10 }
    });
  });

  test("consultarPedidos responde con pedidos", async () => {
    req.body = { id_usuario: 1 };
    pedidosSql.consultarPedidos.mockResolvedValue([{ id_pedido: 10 }]);
    await usuariosController.consultarPedidos(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ pedidos: [{ id_pedido: 10 }] });
  });

  test("actualizarPedido responde con resultado", async () => {
    req.body = { id_usuario: 1, id_pedido: 10, productos: [] };
    pedidosSql.actualizarPedido.mockResolvedValue({ success: true });
    await usuariosController.actualizarPedido(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("cancelarPedido responde con resultado", async () => {
    req.body = { id_usuario: 1, id_pedido: 10 };
    pedidosSql.eliminarPedido.mockResolvedValue({ success: true });
    await usuariosController.cancelarPedido(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("crearPedido responde con error", async () => {
    req.body = { id_usuario: 1, productos: [] };
    pedidosSql.crearPedido.mockRejectedValue(new Error("fail"));
    await usuariosController.crearPedido(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Error del servidor",
      error: expect.any(Error)
    });
  });
});