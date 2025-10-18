import 'package:flutter/material.dart';
import 'package:flutter_cafeteria_1/pages/orders_page.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'cart_model.dart';

// Clase base para todas las páginas de categoría
class CategoryPage extends StatefulWidget {
  final Map<String, dynamic> category;

  const CategoryPage({super.key, required this.category});

  @override
  State<CategoryPage> createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  void _addToCart(Map<String, dynamic> product, BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    // Crear un CartItem a partir del producto - CORREGIDO
    final cartItem = CartItem(
      name: product['name'],
      price: product['price'].toDouble(),
      icon: _getIconData(product['icon']), // ¡MÉTODO CORREGIDO!
      quantity: 1,
    );

    // Agregar al carrito usando el Provider
    cartProvider.addToCart(cartItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF6D4C41),
        content: Text('${product['name']} agregado al carrito'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // Método auxiliar para convertir el icono a IconData
  IconData _getIconData(dynamic icon) {
    if (icon is IconData) {
      return icon;
    } else if (icon is String) {
      // Si el icono viene como string (ej: "Icons.coffee")
      return _getIconFromString(icon);
    } else if (icon is int) {
      // Si el icono viene como codePoint
      return IconData(icon, fontFamily: 'MaterialIcons');
    } else {
      // Icono por defecto si no se puede determinar
      return Icons.error;
    }
  }

  // Método para convertir string a IconData
  IconData _getIconFromString(String iconName) {
    switch (iconName) {
      case 'Icons.coffee':
        return Icons.coffee;
      case 'Icons.local_dining':
        return Icons.local_dining;
      case 'Icons.local_cafe':
        return Icons.local_cafe;
      case 'Icons.icecream':
        return Icons.icecream;
      case 'Icons.cake':
        return Icons.cake;
      case 'Icons.lunch_dining':
        return Icons.lunch_dining;
      case 'Icons.local_drink':
        return Icons.local_drink;
      case 'Icons.fastfood':
        return Icons.fastfood;
      case 'Icons.bakery_dining':
        return Icons.bakery_dining;
      case 'Icons.local_pizza':
        return Icons.local_pizza;
      case 'Icons.set_meal':
        return Icons.set_meal;
      default:
        return Icons.restaurant_menu;
    }
  }

  void _navigateToCartPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const OrdersPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final products = widget.category['products'] as List<Map<String, dynamic>>;
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: Text(
          widget.category['name'],
          style: const TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
        actions: [
          Stack(
            children: [
              IconButton(
                onPressed: () => _navigateToCartPage(context),
                icon: const Icon(Icons.shopping_cart),
                color: const Color(0xFF8D6E63),
              ),
              if (cartProvider.totalItems > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Color(0xFFD32F2F),
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      cartProvider.totalItems.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.8,
          ),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return _buildProductCard(product, context);
          },
        ),
      ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product, BuildContext context) {
    return Card(
      elevation: 3,
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE6D7C9),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _getIconData(product['icon']), // ¡USAR MÉTODO CORREGIDO!
                    color: const Color(0xFF6D4C41),
                    size: 30,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                product['name'],
                style: const TextStyle(
                  color: Color(0xFF5D4037),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                '\$${product['price'].toString()}',
                style: const TextStyle(
                  color: Color(0xFF8D6E63),
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    _addToCart(product, context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6D4C41),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                  child: const Text('Agregar', style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
