jest.mock("../../../src/database/sqlConnection");

const loginSql = require("../../../src/controllers/login/loginSql");
const connect = require("../../../src/database/sqlConnection");

describe("loginSql", () => {
  let fakeConnection;

  beforeEach(() => {
    fakeConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    connect.mockResolvedValue(fakeConnection);
  });

  test("autenticarUsuario devuelve usuario si existe", async () => {
    fakeConnection.execute.mockResolvedValue([[{ id_usuario: 1, nombre: "Ana" }]]);
    const result = await loginSql.autenticarUsuario("a@b.com", "123");
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "SELECT * FROM Usuarios WHERE correo = ? AND contraseña = ?",
      ["a@b.com", "123"]
    );
    expect(result).toEqual({ id_usuario: 1, nombre: "Ana" });
  });

  test("autenticarUsuario devuelve null si no existe", async () => {
    fakeConnection.execute.mockResolvedValue([[]]);
    const result = await loginSql.autenticarUsuario("a@b.com", "123");
    expect(result).toBeNull();
  });

  test("registrarUsuario inserta usuario y devuelve resultado", async () => {
    fakeConnection.execute.mockResolvedValue([{ affectedRows: 1, insertId: 5 }]);
    const result = await loginSql.registrarUsuario("a@b.com", "123", "Ana", "estudiante", "2025-09-19 21:55:00");
    expect(fakeConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO Usuarios (correo, contraseña, nombre, rol, fecha_registro) VALUES (?, ?, ?, ?, ?)",
      ["a@b.com", "123", "Ana", "estudiante", "2025-09-19 21:55:00"]
    );
    expect(result).toEqual({ affectedRows: 1, insertId: 5 });
  });
});