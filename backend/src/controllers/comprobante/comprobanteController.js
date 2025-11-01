// backend/src/controllers/comprobante/comprobanteController.js
const comprobanteSql = require('./comprobanteSql');
const path = require('path');
const FileType = (() => {
  try { return require('file-type'); } catch { return null; }
})();

async function createComprobante(req, res) {
  try {
    console.log('🎯 CREATE COMPROBANTE ENDPOINT HIT');
    console.log('📦 Body:', req.body);
    console.log('📁 File received:', req.file ? `Yes - ${req.file.originalname} (${req.file.size} bytes)` : 'No file');
    
    const { id_pedido, id_usuario } = req.body;
    
    if (!id_pedido || !id_usuario || !req.file) {
      console.log('❌ Missing data:', { 
        id_pedido: id_pedido || 'undefined', 
        id_usuario: id_usuario || 'undefined', 
        hasFile: !!req.file 
      });
      return res.status(400).json({ 
        error: 'Datos incompletos',
        details: { 
          id_pedido: id_pedido || 'missing', 
          id_usuario: id_usuario || 'missing', 
          file: req.file ? 'present' : 'missing' 
        }
      });
    }

    console.log('✅ Datos completos, procesando comprobante...');
    
    const buffer = req.file.buffer;
    const mime = req.file.mimetype;
    const originalName = req.file.originalname;

    console.log(`📊 Procesando archivo: ${originalName}, Tipo: ${mime}, Tamaño: ${buffer.length} bytes`);

    const result = await comprobanteSql.createComprobante(id_pedido, id_usuario, buffer, mime, originalName);

    // Actualizar el estado del pedido a 'confirmado' después de subir el comprobante
    console.log(`🔄 Actualizando estado del pedido ${id_pedido} a 'confirmado'`);
    const connect = require('../../database/sqlConnection');
    const connection = await connect();
    await connection.execute('UPDATE Pedidos SET estado = ? WHERE id_pedido = ?', ['confirmado', id_pedido]);
    await connection.end();

    console.log(`✅ Comprobante creado exitosamente. ID: ${result.insertId}, Pedido: ${id_pedido}`);
    
    return res.status(201).json({ 
      message: 'Comprobante creado y pedido confirmado', 
      id: result.insertId,
      id_pedido: parseInt(id_pedido)
    });
  } catch (err) {
    console.error('💥 Error al crear comprobante:', err);
    if (err.code === 'PENDING_PEDIDO_NOT_FOUND') {
      return res.status(400).json({ error: 'Pedido no existe' });
    }
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

async function getComprobanteFile(req, res) {
  try {
    const { id_confirmacion } = req.params;
    console.log(`📥 Solicitando comprobante file: ${id_confirmacion}`);
    
    const row = await comprobanteSql.getComprobanteById(id_confirmacion);
    if (!row) {
      console.log(`❌ Comprobante no encontrado: ${id_confirmacion}`);
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }

    // soporte: 1) blob almacenado en comprobante_blob 2) blob almacenado en comprobante_foto 3) ruta guardada en comprobante_foto
    const blob = row.comprobante_blob || row.comprobante_foto;

    console.log(`📊 Tipo de dato del comprobante: ${typeof blob}, ¿Es buffer?: ${Buffer.isBuffer(blob)}`);

    // si es buffer (BLOB)
    if (Buffer.isBuffer(blob)) {
      let mime = 'application/octet-stream';
      if (FileType && FileType.fromBuffer) {
        const ft = await FileType.fromBuffer(blob);
        if (ft && ft.mime) mime = ft.mime;
      } else if (row.comprobante_mime) {
        mime = row.comprobante_mime;
      }
      
      console.log(`📁 Enviando archivo como buffer. MIME: ${mime}, Tamaño: ${blob.length} bytes`);
      
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `inline; filename="${(row.comprobante_nombre || 'comprobante')}"`);
      return res.send(blob);
    }

    // si es string -> ruta relativa (ej: 'comprobantes/archivo.jpg')
    if (typeof blob === 'string') {
      const filePath = path.join(__dirname, '../../uploads', blob);
      console.log(`📁 Enviando archivo por ruta: ${filePath}`);
      
      return res.sendFile(filePath, err => {
        if (err) {
          console.error('Error al enviar archivo por ruta:', err);
          return res.status(404).json({ error: 'Archivo no encontrado' });
        }
      });
    }

    console.log('❌ Formato de comprobante no soportado');
    return res.status(400).json({ error: 'Formato de comprobante no soportado' });
  } catch (err) {
    console.error('💥 Error al enviar comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getComprobante(req, res) {
  try {
    const { id_confirmacion } = req.params;
    console.log(`📥 Solicitando comprobante metadata: ${id_confirmacion}`);
    
    const row = await comprobanteSql.getComprobanteById(id_confirmacion);
    if (!row) {
      console.log(`❌ Comprobante no encontrado: ${id_confirmacion}`);
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }

    // construimos respuesta con metadatos y URL para la ruta que sirve el archivo
    const url = `${req.protocol}://${req.get('host')}/api/getComprobanteFile/${row.id_confirmacion}`;
    
    console.log(`✅ Comprobante encontrado: ${row.id_confirmacion}`);
    
    // no asumes la columna fecha_confirmacion: devuelve lo que exista
    return res.json({ 
      ...row, 
      url,
      download_url: url
    });
  } catch (err) {
    console.error('💥 Error al obtener comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createComprobante,
  getComprobante,
  getComprobanteFile,
};