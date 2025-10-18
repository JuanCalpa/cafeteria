import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'payment_page.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: const Text(
          'Mi Carrito',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
      ),
      body: cartProvider.isCartEmpty
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
                    'Tu carrito está vacío',
                    style: TextStyle(
                      color: Color(0xFF8D6E63),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: cartProvider.cartItems.length,
                    itemBuilder: (context, index) {
                      final item = cartProvider.cartItems[index];
                      return ListTile(
                        leading: Icon(item.icon),
                        title: Text(item.name),
                        subtitle: Text('\$${item.price}'),
                        trailing: Text('Cantidad: ${item.quantity}'),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PaymentPage(),
                        ),
                      );
                    },
                    child: const Text('Pagar'),
                  ),
                ),
              ],
            ),
    );
  }
}
