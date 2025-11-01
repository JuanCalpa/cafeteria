# TODO - Implementación de Creación de Pedidos desde Flutter con Subida de Comprobante de Pago

## ✅ Completado

### Backend
- [x] Agregar función `crearPedidoDesdeApp` en `pedidosController.js` para crear pedidos desde la app Flutter
- [x] Agregar ruta `POST /api/crearPedidoDesdeApp` en `pedidosRouter.js`
- [x] Modificar `createComprobante` en `comprobanteController.js` para actualizar estado del pedido a 'confirmado' al subir comprobante
- [x] Servidor backend corriendo en http://localhost:3000

### Flutter
- [x] Agregar método `crearPedidoDesdeApp` en `ApiService` para crear pedidos
- [x] Agregar método `subirComprobante` en `ApiService` para subir comprobante de pago
- [x] Modificar `_processPayment` en `payment_page.dart` para llamar APIs reales en lugar de simulación

## 📋 Funcionalidad Implementada

### Creación de Pedidos
- Los pedidos se crean con estado 'pendiente' inicialmente
- Se insertan productos seleccionados en tabla `Producto_Pedido`
- Requiere `id_usuario` y lista de productos con cantidades

### Subida de Comprobante de Pago
- Se sube imagen del comprobante a tabla `confirmaciones_pago`
- Al subir comprobante, el estado del pedido cambia a 'confirmado'
- Soporte para imágenes (máximo 5MB)

### Integración Flutter
- Página de pago permite seleccionar método (Nequi, Bancolombia, Daviplata)
- Permite seleccionar imagen del comprobante desde galería
- Llama APIs reales para crear pedido y subir comprobante
- Muestra diálogo de éxito y limpia carrito al completar

## 🔄 Flujo de la Aplicación
1. Usuario selecciona productos en carrito
2. Va a página de pago y selecciona método de pago
3. Selecciona imagen del comprobante
4. Presiona "Pagar" → Crea pedido en BD con estado 'pendiente'
5. Sube comprobante → Estado cambia a 'confirmado'
6. Muestra confirmación y regresa al inicio

## 🧪 Testing Recomendado
- Probar creación de pedido con productos seleccionados
- Verificar subida de imagen de comprobante
- Confirmar cambio de estado del pedido
- Probar manejo de errores (sin imagen, pedido fallido, etc.)
