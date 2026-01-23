# TODO - Configuración para múltiples redes

## ✅ Completado
- [x] Instalar Railway CLI
- [x] Actualizar baseUrl en api_service.dart para usar Railway

## 🔄 Pendiente
- [ ] Hacer login en Railway: `railway login`
- [ ] Desplegar backend a Railway desde flutter_cafeteria_1/lib/Back/
- [ ] Obtener la URL real de Railway
- [ ] Actualizar baseUrl con la URL real de Railway
- [ ] Probar la app desde diferentes redes

## 📋 Pasos para desplegar a Railway

1. Abrir terminal en `flutter_cafeteria_1/lib/Back/`
2. Ejecutar: `railway login`
3. Ejecutar: `railway up`
4. Copiar la URL generada por Railway
5. Reemplazar 'https://tu-backend.railway.app' en api_service.dart con la URL real
