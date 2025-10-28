# Corrección de Conexión Backend - Flutter App

## Problema Identificado
- El servidor backend está corriendo en `http://0.0.0.0:3000`
- La aplicación Flutter intenta conectarse a `http://127.0.0.1:3000` (localhost)
- En emulador Android, `127.0.0.1` no es accesible; se debe usar `10.0.2.2`

## Pasos a Realizar
- [ ] Cambiar URL en `lib/providers/menu_provider.dart` de `http://127.0.0.1:3000` a `http://10.0.2.2:3000`
- [ ] Cambiar URL en `lib/services/api_service.dart` de `http://localhost:3000` a `http://10.0.2.2:3000`
- [ ] Probar la aplicación Flutter nuevamente

## Notas
- El servidor backend ya está configurado correctamente para escuchar en `0.0.0.0:3000`
- Una vez realizados los cambios, reiniciar la aplicación Flutter para que tome los cambios
