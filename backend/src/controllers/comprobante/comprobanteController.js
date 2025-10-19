const comprobanteSql = require('./comprobanteSql');
const path = require('path');
const FileType = (() => {
  try { return require('file-type'); } catch { return null; }
})();

async function createComprobante(req, res) {
  try {
    const { id_pedido, id_usuario } = req.body;
    if (!id_pedido || !id_usuario || !req.file) {
      return res.status(400).json({ error: 'id_pedido, id_usuario y comprobante (file) son requeridos' });
    }

    const buffer = req.file.buffer; // multer memoryStorage
    const mime = req.file.mimetype;
    const originalName = req.file.originalname;

    const result = await comprobanteSql.createComprobante(id_pedido, id_usuario, buffer, mime, originalName);
    return res.status(201).json({ message: 'Comprobante creado', id: result.insertId });
  } catch (err) {
    console.error('Error al crear comprobante:', err);
    if (err.code === 'PENDING_PEDIDO_NOT_FOUND') return res.status(400).json({ error: 'Pedido no existe' });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getComprobanteFile(req, res) {
  try {
    const { id_confirmacion } = req.params;
    const row = await comprobanteSql.getComprobanteById(id_confirmacion);
    if (!row) return res.status(404).json({ error: 'Comprobante no encontrado' });

    const blob = row.comprobante_blob || row.comprobante_foto;
    if (Buffer.isBuffer(blob)) {
      let mime = 'application/octet-stream';
      if (FileType && FileType.fromBuffer) {
        const ft = await FileType.fromBuffer(blob);
        if (ft && ft.mime) mime = ft.mime;
      } else if (row.comprobante_mime) {
        mime = row.comprobante_mime;
      }
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `inline; filename="${(row.comprobante_nombre || 'comprobante')}"`);
      return res.send(blob);
    }

    if (typeof blob === 'string') {
      const filePath = path.join(__dirname, '../../uploads', blob);
      return res.sendFile(filePath);
    }

    return res.status(400).json({ error: 'Formato de comprobante no soportado' });
  } catch (err) {
    console.error('Error al enviar comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getComprobanteFile(req, res) {
  try {
    const { id_confirmacion } = req.params;
    const row = await comprobanteSql.getComprobanteById(id_confirmacion);
    if (!row) return res.status(404).json({ error: 'Comprobante no encontrado' });

    // soporte: 1) blob almacenado en comprobante_blob 2) blob almacenado en comprobante_foto 3) ruta guardada en comprobante_foto
    const blob = row.comprobante_blob || row.comprobante_foto;

    // si es buffer (BLOB)
    if (Buffer.isBuffer(blob)) {
      let mime = 'application/octet-stream';
      if (FileType && FileType.fromBuffer) {
        const ft = await FileType.fromBuffer(blob);
        if (ft && ft.mime) mime = ft.mime;
      } else if (row.comprobante_mime) {
        mime = row.comprobante_mime;
      }
      res.setHeader('Content-Type', mime);
      // inline para mostrar en navegador, o cambiar a attachment para forzar descarga
      res.setHeader('Content-Disposition', `inline; filename="${(row.comprobante_nombre || 'comprobante')}"`);
      return res.send(blob);
    }

    // si es string -> ruta relativa (ej: 'comprobantes/archivo.jpg')
    if (typeof blob === 'string') {
      const filePath = path.join(__dirname, '../../uploads', blob);
      return res.sendFile(filePath, err => {
        if (err) {
          console.error('Error al enviar archivo por ruta:', err);
          return res.status(404).json({ error: 'Archivo no encontrado' });
        }
      });
    }

    return res.status(400).json({ error: 'Formato de comprobante no soportado' });
  } catch (err) {
    console.error('Error al enviar comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getComprobante(req, res) {
  try {
    const { id_confirmacion } = req.params;
    const row = await comprobanteSql.getComprobanteById(id_confirmacion);
    if (!row) return res.status(404).json({ error: 'Comprobante no encontrado' });

    // construimos respuesta con metadatos y URL para la ruta que sirve el archivo
    const url = `${req.protocol}://${req.get('host')}/api/getComprobanteFile/${row.id_confirmacion}`;
    // no asumes la columna fecha_confirmacion: devuelve lo que exista
    return res.json({ ...row, url });
  } catch (err) {
    console.error('Error al obtener comprobante:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createComprobante,
  getComprobante,
  getComprobanteFile,
};