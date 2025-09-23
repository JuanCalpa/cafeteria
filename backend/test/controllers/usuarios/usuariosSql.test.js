jest.mock("../../../src/database/sqlConnection");

const usuariosSql = require("../../../src/controllers/usuarios/usuariosSql");
const connect = require("../../../src/database/sqlConnection");

describe("usuariosSql", () => {
  let fakeConnection;

  beforeEach(() => {
    fakeConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    connect.mockResolvedValue(fakeConnection);
  });

  test("crearPedido debe crear pedido y productos", async () => {
    fakeConnection.execute
      .mockResolvedValueOnce([{ insertId: 5 }]) // Pedido
      .mockResolvedValueOnce([{}]) // Producto 1
      .mockResolvedValueOnce([{}]); // Producto 2

    const productos = [
      { id_producto: 1, cantidad: 2, especificaciones: "sin azúcar" }
    ];
    const result = await usuariosSql.crearPedido(1, productos);

    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO Pedidos (id_usuario, estado, fecha_pedido) VALUES (?, ?, NOW())",
      [1, "pendiente"]
    );
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO Producto_Pedido (id_pedido, id_producto, cantidad, especificaciones) VALUES (?, ?, ?, ?)",
      [5, 1, 2, "sin azúcar"]
    );
    expect(result).toEqual({ success: true, id_pedido: 5 });
  });

  test("consultarPedidos debe devolver pedidos", async () => {
    fakeConnection.execute.mockResolvedValue([
      [{ id_pedido: 1, id_producto: 2, cantidad: 1 }]
    ]);
    const result = await usuariosSql.consultarPedidos(1);
    expect(result).toEqual([{ id_pedido: 1, id_producto: 2, cantidad: 1 }]);
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining("SELECT p.*, d.id_producto"),
      [1]
    );
  });

  test("actualizarPedido debe actualizar si pendiente", async () => {
    fakeConnection.execute
      .mockResolvedValueOnce([[{ estado: "pendiente" }]]) // Estado
      .mockResolvedValueOnce([{}]) // Delete productos
      .mockResolvedValueOnce([{}]); // Insert producto

    const productos = [{ id_producto: 2, cantidad: 1 }];
    const result = await usuariosSql.actualizarPedido(1, 10, productos);

    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "SELECT estado FROM Pedidos WHERE id_pedido = ? AND id_usuario = ?",
      [10, 1]
    );
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "DELETE FROM Producto_Pedido WHERE id_pedido = ?",
      [10]
    );
    expect(result).toEqual({ success: true });
  });

  test("actualizarPedido no actualiza si no pendiente", async () => {
    fakeConnection.execute.mockResolvedValueOnce([[{ estado: "completado" }]]);
    const result = await usuariosSql.actualizarPedido(1, 10, []);
    expect(result).toEqual({ success: false, message: "No se puede actualizar" });
  });

  test("eliminarPedido elimina si pendiente", async () => {
    fakeConnection.execute
      .mockResolvedValueOnce([[{ estado: "pendiente" }]]) // Estado
      .mockResolvedValueOnce([{}]) // Delete productos
      .mockResolvedValueOnce([{}]); // Delete pedido

    const result = await usuariosSql.eliminarPedido(1, 10);

    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "SELECT estado FROM Pedidos WHERE id_pedido = ? AND id_usuario = ?",
      [10, 1]
    );
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "DELETE FROM Producto_Pedido WHERE id_pedido = ?",
      [10]
    );
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "DELETE FROM Pedidos WHERE id_pedido = ?",
      [10]
    );
    expect(result).toEqual({ success: true });
  });

  test("eliminarPedido no elimina si no pendiente", async () => {
    fakeConnection.execute.mockResolvedValueOnce([[{ estado: "completado" }]]);
    const result = await usuariosSql.eliminarPedido(1, 10);
    expect(result).toEqual({ success: false, message: "No se puede eliminar" });
  });
});