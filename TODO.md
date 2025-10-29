# TODO: Integrar funcionalidad del servidor Flutter en el backend principal

## Información Recopilada
- El servidor en `flutter_cafeteria_1/lib/Back/server.js` maneja rutas de productos y categorías con formateo avanzado (iconos, colores).
- El backend principal en `backend/src/index.js` maneja login, usuarios, pedidos, etc.
- Ambos usan la misma DB de Railway, pero el servidor Flutter tiene lógica adicional para formateo de respuestas.
- Conflicto de puertos: Ambos intentan usar el puerto 3000.

## Plan de Integración
1. **Actualizar productosSql.js**: Agregar método para búsqueda de productos.
2. **Actualizar productosController.js**: Incorporar formateo de iconos y colores como en server.js, y agregar controlador para búsqueda.
3. **Actualizar productosRouter.js**: Agregar ruta para búsqueda de productos (/api/products/search).
4. **Cambiar puerto en server.js**: Cambiar de 3000 a 3001 para evitar conflictos.
5. **Probar integración**: Verificar que el backend principal maneje todas las rutas correctamente.

## Dependencias
- `backend/src/controllers/productos/productosSql.js`
- `backend/src/controllers/productos/productosController.js`
- `backend/src/routes/productosRouter.js`
- `flutter_cafeteria_1/lib/Back/server.js`

## Pasos de Seguimiento
- Ejecutar el backend principal y verificar rutas.
- Ejecutar el servidor Flutter en puerto 3001 si es necesario.
- Actualizar ApiService en Flutter si cambia el puerto.
