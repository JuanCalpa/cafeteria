import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'cart_model.dart'; // ¡AGREGA ESTA IMPORTACIÓN!
import 'payment_page.dart';

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: const Text(
          'Mi Pedido',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
      ),
      body: Column(
        children: [
          // Resumen del pedido
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(16),
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
                  'Resumen del Pedido',
                  style: TextStyle(
                    color: Color(0xFF5D4037),
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${cartProvider.totalItems} productos',
                      style: const TextStyle(color: Color(0xFF8D6E63)),
                    ),
                    Text(
                      'Total: \$${cartProvider.totalPrice.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Color(0xFF5D4037),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Lista de productos
          Expanded(
            child: cartProvider.cartItems
                    .isEmpty // Cambié isCartEmpty por cartItems.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.shopping_cart_outlined,
                          size: 64,
                          color: Color(0xFF8D6E63),
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No hay productos en el pedido',
                          style: TextStyle(
                            color: Color(0xFF8D6E63),
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: ListView.builder(
                      itemCount: cartProvider.cartItems.length,
                      itemBuilder: (context, index) {
                        final item = cartProvider.cartItems[index];
                        return _buildOrderItem(item, index, context);
                      },
                    ),
                  ),
          ),

          // Botón de confirmar pedido
          if (cartProvider.cartItems
              .isNotEmpty) // Cambié isCartEmpty por cartItems.isNotEmpty
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.brown.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _confirmOrder(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6D4C41),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Confirmar Pedido',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildOrderItem(CartItem item, int index, BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    return Card(
      elevation: 3,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
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
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Icono del producto
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: Color(0xFFE6D7C9),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  item.icon,
                  color: const Color(0xFF6D4C41),
                  size: 24,
                ),
              ),

              const SizedBox(width: 12),

              // Información del producto
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
                      style: const TextStyle(
                        color: Color(0xFF5D4037),
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '\$${item.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Color(0xFF8D6E63),
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    if (item.quantity > 1)
                      Text(
                        'Cantidad: ${item.quantity}',
                        style: const TextStyle(
                          color: Color(0xFF8D6E63),
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),

              // Contador de cantidad
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      if (item.quantity > 1) {
                        cartProvider.updateQuantity(index, item.quantity - 1);
                      } else {
                        cartProvider.removeFromCart(index);
                      }
                    },
                    icon: const Icon(Icons.remove, size: 18),
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFFE6D7C9),
                      padding: const EdgeInsets.all(4),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      '${item.quantity}',
                      style: const TextStyle(
                        color: Color(0xFF5D4037),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      cartProvider.updateQuantity(index, item.quantity + 1);
                    },
                    icon: const Icon(Icons.add, size: 18),
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFFE6D7C9),
                      padding: const EdgeInsets.all(4),
                    ),
                  ),
                ],
              ),

              const SizedBox(width: 8),

              // Botón eliminar
              IconButton(
                onPressed: () => cartProvider.removeFromCart(index),
                icon: const Icon(
                  Icons.delete_outline,
                  color: Color(0xFFD32F2F),
                ),
                tooltip: 'Eliminar producto',
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _confirmOrder(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    if (cartProvider.cartItems.isEmpty) {
      // Cambié isCartEmpty por cartItems.isEmpty
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFD32F2F),
          content: Text('El pedido está vacío'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFFFDF5E6),
          title: const Text(
            'Confirmar Pedido',
            style: TextStyle(
              color: Color(0xFF5D4037),
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '¿Estás seguro de que quieres confirmar este pedido?',
                style: TextStyle(color: Color(0xFF6D4C41)),
              ),
              const SizedBox(height: 16),
              Text(
                'Total: \$${cartProvider.totalPrice.toStringAsFixed(2)}',
                style: const TextStyle(
                  color: Color(0xFF5D4037),
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text(
                'Cancelar',
                style: TextStyle(color: Color(0xFF8D6E63)),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _navigateToPaymentPage(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6D4C41),
                foregroundColor: Colors.white,
              ),
              child: const Text('Confirmar'),
            ),
          ],
        );
      },
    );
  }

  void _navigateToPaymentPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const PaymentPage(),
      ),
    );
  }
}
