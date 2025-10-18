import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../pages/cart_provider.dart';

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  File? _comprobanteImage;
  String? _selectedPaymentMethod;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _comprobanteImage = File(image.path);
      });
    }
  }

  void _removeImage() {
    setState(() {
      _comprobanteImage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: const Text(
          'Método de Pago',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: SingleChildScrollView(
          // SOLUCIÓN: Envolver en SingleChildScrollView
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Resumen del pedido
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.brown.withOpacity(0.1),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Resumen de Compra',
                      style: TextStyle(
                        color: Color(0xFF5D4037),
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...cartProvider.cartItems.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${item.name} x${item.quantity}',
                                style: const TextStyle(
                                  color: Color(0xFF6D4C41),
                                ),
                              ),
                              Text(
                                '\$${(item.price * item.quantity).toStringAsFixed(2)}',
                                style: const TextStyle(
                                  color: Color(0xFF5D4037),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        )),
                    const Divider(color: Color(0xFF8D6E63)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total:',
                          style: TextStyle(
                            color: Color(0xFF5D4037),
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          '\$${cartProvider.totalPrice.toStringAsFixed(2)}',
                          style: const TextStyle(
                            color: Color(0xFF5D4037),
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              const Text(
                'Selecciona método de pago:',
                style: TextStyle(
                  color: Color(0xFF5D4037),
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),

              const SizedBox(height: 16),

              // Métodos de pago
              _buildPaymentMethod(
                context,
                'Nequi',
                Icons.phone_android,
                const Color(0xFF4CAF50),
                '320 684 6632',
              ),
              _buildPaymentMethod(
                context,
                'Bancolombia',
                Icons.account_balance,
                const Color(0xFF2196F3),
                'Transferencia Bancolombia',
              ),
              _buildPaymentMethod(
                context,
                'Daviplata',
                Icons.phone_iphone,
                const Color(0xFF9C27B0),
                '320 684 6632',
              ),

              const SizedBox(height: 24),

              // Espacio para subir comprobante
              if (_selectedPaymentMethod != null &&
                  _selectedPaymentMethod != 'Efectivo')
                _buildComprobanteSection(),

              const SizedBox(height: 24), // Cambiado de Spacer() a SizedBox

              // Botón de enviar
              if (_selectedPaymentMethod != null)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _comprobanteImage != null ||
                            _selectedPaymentMethod == 'Efectivo'
                        ? () =>
                            _processPayment(context, _selectedPaymentMethod!)
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6D4C41),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Enviar Pedido',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 16), // Espacio adicional al final
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentMethod(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    String description,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      color: _selectedPaymentMethod == title
          ? color.withOpacity(0.1)
          : Colors.white,
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          description,
          style: const TextStyle(color: Color(0xFF8D6E63)),
        ),
        trailing: _selectedPaymentMethod == title
            ? const Icon(Icons.check_circle, color: Color(0xFF4CAF50))
            : const Icon(Icons.arrow_forward_ios,
                size: 16, color: Color(0xFF8D6E63)),
        onTap: () {
          setState(() {
            _selectedPaymentMethod = title;
            _comprobanteImage = null;
          });
          if (title != 'Efectivo') {
            _showPaymentDetails(context, title, description);
          }
        },
      ),
    );
  }

  Widget _buildComprobanteSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.brown.withOpacity(0.1),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Comprobante de Pago',
            style: TextStyle(
              color: Color(0xFF5D4037),
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Sube una captura de pantalla del comprobante de transferencia:',
            style: TextStyle(
              color: Color(0xFF6D4C41),
            ),
          ),
          const SizedBox(height: 16),
          _comprobanteImage == null
              ? Container(
                  width: double.infinity,
                  height: 150,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF8D6E63),
                      width: 1,
                    ),
                  ),
                  child: TextButton(
                    onPressed: _pickImage,
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF8D6E63),
                    ),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.cloud_upload, size: 40),
                        SizedBox(height: 8),
                        Text(
                          'Subir Comprobante',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Formatos: JPG, PNG',
                          style: TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                )
              : Stack(
                  children: [
                    Container(
                      width: double.infinity,
                      height: 200,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: const Color(0xFF8D6E63),
                          width: 1,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(11),
                        child: Image.file(
                          _comprobanteImage!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon:
                              const Icon(Icons.close, color: Color(0xFF5D4037)),
                          onPressed: _removeImage,
                        ),
                      ),
                    ),
                  ],
                ),
        ],
      ),
    );
  }

  void _showPaymentDetails(
      BuildContext context, String paymentMethod, String accountInfo) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    // Información específica para cada método de pago
    String qrImagePath = '';
    String additionalInfo = '';
    String accountNumber = '';

    switch (paymentMethod) {
      case 'Nequi':
        qrImagePath = 'assets/Nequi_Qr.jpeg'; // Ruta corregida
        additionalInfo =
            'Escanea el código QR o realiza la transferencia al número:';
        accountNumber = '320 684 6632';
        break;
      case 'Bancolombia':
        qrImagePath = 'assets/BancolombiaQr.jpeg'; // Ruta corregida
        additionalInfo = 'Escanea el código QR o realiza la transferencia a:';
        accountNumber = 'Carola\nBarcelona';
        break;
      case 'Daviplata':
        qrImagePath = 'assets/DAVIplataIma.jpeg'; // Ruta corregida
        additionalInfo =
            'Escanea el código QR o realiza la transferencia al número:';
        accountNumber = '320 684 6632';
        break;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: const Color(0xFFFDF5E6),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Pago con $paymentMethod',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF5D4037),
                  ),
                ),
                const SizedBox(height: 16),

                // Código QR
                Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border:
                        Border.all(color: const Color(0xFF8D6E63), width: 1),
                  ),
                  child: Image.asset(
                    qrImagePath,
                    fit: BoxFit
                        .contain, // Cambiado a contain para mejor visualización
                    errorBuilder: (context, error, stackTrace) {
                      return const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.qr_code,
                            size: 80,
                            color: Color(0xFF8D6E63),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Código QR no disponible',
                            style: TextStyle(
                              color: Color(0xFF8D6E63),
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Verifique la ruta de la imagen',
                            style: TextStyle(
                              color: Color(0xFF8D6E63),
                              fontSize: 12,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      );
                    },
                  ),
                ),

                const SizedBox(height: 16),

                // Información de pago
                Text(
                  additionalInfo,
                  style: const TextStyle(
                    color: Color(0xFF6D4C41),
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 8),

                // Número de cuenta
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF8D6E63)),
                  ),
                  child: Column(
                    children: [
                      Text(
                        accountNumber,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF5D4037),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      if (paymentMethod == 'Bancolombia')
                        const SizedBox(height: 4),
                      if (paymentMethod == 'Bancolombia')
                        const Text(
                          'Titular: Carola Barcelona',
                          style: TextStyle(
                            color: Color(0xFF6D4C41),
                            fontSize: 14,
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                Text(
                  'Total a pagar: \$${cartProvider.totalPrice.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF5D4037),
                  ),
                ),

                const SizedBox(height: 20),

                Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF8D6E63),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Cerrar'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _processPayment(BuildContext context, String paymentMethod) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFFFDF5E6),
          title: const Text(
            'Enviando Pedido',
            style: TextStyle(
              color: Color(0xFF5D4037),
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(
                color: Color(0xFF6D4C41),
              ),
              const SizedBox(height: 16),
              Text(
                'Procesando pedido con $paymentMethod...',
                style: const TextStyle(color: Color(0xFF6D4C41)),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      },
    );

    // Simular envío del pedido
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pop(); // Cerrar diálogo de procesamiento

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: const Color(0xFFFDF5E6),
            title: const Text(
              '¡Pedido Enviado!',
              style: TextStyle(
                color: Color(0xFF388E3C),
                fontWeight: FontWeight.bold,
              ),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.check_circle,
                  color: Color(0xFF388E3C),
                  size: 64,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Tu pedido está en espera de confirmación.',
                  style: TextStyle(color: Color(0xFF6D4C41)),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Total: \$${cartProvider.totalPrice.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Color(0xFF5D4037),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Método: $paymentMethod',
                  style: const TextStyle(
                    color: Color(0xFF6D4C41),
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  cartProvider.clearCart();
                  // Navegar al home_page.dart
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFF6D4C41),
                ),
                child: const Text(
                  'Volver al Inicio',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          );
        },
      );
    });
  }
}
