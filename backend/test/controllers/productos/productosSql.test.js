jest.mock("../../../src/database/sqlConnection");

const productosSql = require("../../../src/controllers/productos/productosSql");
const connect = require("../../../src/database/sqlConnection");

describe("productosSql", () => {
  let fakeConnection;

  beforeEach(() => {
    fakeConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    connect.mockResolvedValue(fakeConnection);
  });

  test("getProductos debe devolver filas", async () => {
    fakeConnection.execute.mockResolvedValue([[{ id_producto: 1, nombre: "Café" }]]);
    const result = await productosSql.getProductos();
    expect(result).toEqual([{ id_producto: 1, nombre: "Café" }]);
  });

  test("getProductoById debe devolver un producto", async () => {
    fakeConnection.execute.mockResolvedValue([[{ id_producto: 2, nombre: "Té" }]]);
    const result = await productosSql.getProductoById(2);
    expect(result).toEqual({ id_producto: 2, nombre: "Té" });
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "SELECT * FROM Productos WHERE id_producto = ?", [2]
    );
  });

  test("createProducto debe devolver insertId", async () => {
    fakeConnection.execute.mockResolvedValue([{ insertId: 10 }]);
    const result = await productosSql.createProducto("Pan", "Integral", 5.5, 100, "Alimentos");
    expect(result.insertId).toBe(10);
  });

  test("updateProducto debe devolver affectedRows", async () => {
    fakeConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);
    const result = await productosSql.updateProducto(1, "Pan", "Integral", 6, 90, "Alimentos");
    expect(result.affectedRows).toBe(1);
  });

  test("deleteProducto debe devolver affectedRows", async () => {
    fakeConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);
    const result = await productosSql.deleteProducto(1);
    expect(result.affectedRows).toBe(1);
  });
});
