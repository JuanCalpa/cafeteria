// backend/src/controllers/comprobante/comprobanteController.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { fileTypeFromBuffer } = require('file-type');
const comprobanteSql = require('./comprobanteSql');

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
    let mimeType = req.file.mimetype;
    let originalName = req.file.originalname;

    // 🧠 Detección del tipo MIME más precisa
    if (!mimeType || mimeType === 'application/octet-stream') {
      const detected = await fileTypeFromBuffer(buffer);
      if (detected?.mime) {
        mimeType = detected.mime;
        console.log(`🔍 MIME detectado con file-type: ${mimeType}`);
      } else {
        mimeType = mime.lookup(originalName) || 'application/octet-stream';
        console.log(`⚙️ MIME inferido por extensión: ${mimeType}`);
      }
    }

    // 📄 Asegurar extensión correcta
    if (!path.extname(originalName)) {
      const ext = mime.extension(mimeType);
      if (ext) originalName += `.${ext}`;
    }

    console.log(`📊 Archivo final: ${originalName}, MIME: ${mimeType}, Tamaño: ${buffer.length} bytes`);

    // 💾 Guardar en base de datos
    const result = await comprobanteSql.createComprobante(
      id_pedido,
      id_usuario,
      buffer,
      mimeType,
      originalName
    );

    // 🔄 Actualizar el estado del pedido a 'pendiente' (el pedido se mantiene pendiente hasta que el admin lo confirme)
    console.log(`🔄 Actualizando estado del pedido ${id_pedido} a 'pendiente'`);
    const connect = require('../../database/sqlConnection');
    const connection = await connect();
    await connection.execute('UPDATE Pedidos SET estado = ? WHERE id_pedido = ?', ['pendiente', id_pedido]);
    await connection.end();

    console.log(`✅ Comprobante creado exitosamente. ID: ${result.insertId}, Pedido: ${id_pedido}`);
    
    return res.status(201).json({
      message: 'Comprobante creado y pedido pendiente de confirmación',
      id: result.insertId,
      id_pedido: parseInt(id_pedido)
    });
  } catch (err) {
    console.error('💥 Error al crear comprobante:', err);
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

    let blob = row.comprobante_blob;
    if (!blob) {
      console.log('❌ No hay dato de comprobante en la fila');
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }

    // 🧩 Normalización de blob (por si MySQL devuelve objeto tipo {data: [...]})
    if (typeof blob === 'object' && blob.data) {
      blob = Buffer.from(blob.data);
      console.log('🔁 Normalizado objeto Buffer-like a Buffer');
    }

    // ✅ Detección del tipo MIME
    let mimeType = row.comprobante_mime || 'application/octet-stream';
    if (!mimeType || mimeType === 'application/octet-stream') {
      try {
        const detected = await fileTypeFromBuffer(blob);
        if (detected?.mime) {
          mimeType = detected.mime;
          console.log(`🔍 MIME detectado: ${mimeType}`);
        }
      } catch {
        console.warn('⚠️ file-type no pudo detectar MIME');
      }
    }

    // 🧱 Generar extensión correcta
    let extension = path.extname(row.comprobante_nombre || '') || '';
    if (!extension) {
      const ext = (await fileTypeFromBuffer(blob))?.ext || '';
      if (ext) extension = '.' + ext;
    }

    // 📄 Nombre de archivo final
    let filename = (row.comprobante_nombre || 'comprobante').trim();
    if (!path.extname(filename)) filename += extension;

    console.log(`📦 Enviando archivo: ${filename}, MIME: ${mimeType}, Tamaño: ${blob.length} bytes`);

    // 🎯 Configurar cabeceras según tipo
    res.setHeader('Content-Type', mimeType);
    
    // Mostrar imágenes y PDFs en el navegador, otros como descarga
    const isInline =
      mimeType.startsWith('image/') || mimeType === 'application/pdf';
    const dispositionType = isInline ? 'inline' : 'attachment';

    res.setHeader(
      'Content-Disposition',
      `${dispositionType}; filename="${filename}"`
    );
    res.setHeader('Content-Length', blob.length);

    // 🧾 Enviar contenido binario
    res.status(200).end(blob);
  } catch (err) {
    console.error('💥 Error al enviar comprobante:', err);
    return res
      .status(500)
      .json({ error: 'Error interno del servidor', details: err.message });
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

    const url = `${req.protocol}://${req.get('host')}/api/getComprobanteFile/${row.id_confirmacion}`;
    console.log(`✅ Comprobante encontrado: ${row.id_confirmacion}`);

    const { comprobante_blob, comprobante_foto, ...meta } = row;

    return res.json({ 
      ...meta,
      url,
      download_url: url
    });
  } catch (err) {
    console.error('💥 Error al obtener comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function welcome(req, res) {
  try {
    console.log(`Request received: ${req.method} ${req.path}`);
    return res.json({ message: 'Welcome to the API' });
  } catch (err) {
    console.error('Error in welcome endpoint:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createComprobante,
  getComprobante,
  getComprobanteFile,
  welcome,
};
