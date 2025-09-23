const productosController = require("../../../src/controllers/productos/productosController");
const productosSql = require("../../../src/controllers/productos/productosSql");

jest.mock("../../../src/controllers/productos/productosSql");

describe("productosController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("getProductos responde con lista", async () => {
    productosSql.getProductos.mockResolvedValue([{ id_producto: 1 }]);
    await productosController.getProductos(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id_producto: 1 }]);
  });

  test("getProductoById sin id devuelve 400", async () => {
    req.query = {};
    await productosController.getProductoById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createProducto devuelve 201 con insertId", async () => {
    req.body = { nombre: "Café", descripcion: "desc", precio: 10, stock: 5, categoria: "Bebida" };
    productosSql.createProducto.mockResolvedValue({ insertId: 99 });
    await productosController.createProducto(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto creado", id: 99 });
  });

  test("updateProducto devuelve 200", async () => {
    req.params = { id_producto: 1 };
    req.body = { nombre: "Té", descripcion: "desc", precio: 12, stock: 3, categoria: "Bebida" };
    productosSql.updateProducto.mockResolvedValue({ affectedRows: 1 });
    await productosController.updateProducto(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto actualizado", affectedRows: 1 });
  });

  test("deleteProducto devuelve 200", async () => {
    req.params = { id_producto: 1 };
    productosSql.deleteProducto.mockResolvedValue({ affectedRows: 1 });
    await productosController.deleteProducto(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto eliminado", affectedRows: 1 });
  });
});
