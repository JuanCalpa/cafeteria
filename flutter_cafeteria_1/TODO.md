# TODO: Implementar Página de Historial de Pedidos

## Tareas Pendientes

- [x] Agregar método `consultarPedidos` en `ApiService` para obtener pedidos del usuario autenticado
- [x] Crear nueva página `HistoryPage` en `lib/pages/history_page.dart` con UI bonita
- [x] Actualizar `home_page.dart` para navegar a `HistoryPage` desde el menú de Historial
- [x] Diseñar cajas de pedidos mostrando estado, fecha y productos
- [x] Probar navegación y funcionalidad sin romper código existente

## Notas
- Asegurarse de que el método en ApiService no dañe funcionalidades existentes
- Usar colores y estilos consistentes con el diseño de la app
- Manejar estados de carga y errores en la UI

## Estado Actual
- ✅ Método `consultarPedidos` agregado en ApiService
- ✅ Página `HistoryPage` creada con UI bonita y cajas de pedidos
- ✅ Navegación actualizada en `home_page.dart`
- ✅ Backend endpoint `/consultarPedidos` agregado
- ✅ Servidor backend corriendo en localhost:3000
- ✅ Error de tipo String/int solucionado en HistoryPage
- ✅ Flutter app ejecutándose correctamente
- ✅ Historial de pedidos funcionando completamente
- ✅ Estado inicial de pedidos al crear comprobante cambiado a 'pendiente'
- ✅ Agregado título grande "Cafetería U. Mariana" con imagen hero centrada en la página principal
- ✅ Cambiada imagen hero por la foto Cappuccino.jpg de assets
- ✅ Quitado texto superpuesto y agrandada imagen hero a 280px de altura
- ✅ Agregado nombre del usuario en el mensaje de bienvenida
- ✅ Agregados iconos decorativos a las páginas de login y registro
- ✅ Quitada la sección de promociones del día de la página principal
- ✅ Agregados mensajes emergentes específicos para errores de login y registro
- ✅ Cambiados mensajes emergentes a ventanas modales (AlertDialog) para mejor visibilidad
