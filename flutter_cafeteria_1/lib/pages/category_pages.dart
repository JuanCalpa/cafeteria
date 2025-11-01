import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'cart_model.dart';
import '../models/category_model.dart';
import '../providers/menu_provider.dart';

class CategoryPage extends StatefulWidget {
  final Category category;

  const CategoryPage({super.key, required this.category});

  @override
  State<CategoryPage> createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  @override
  Widget build(BuildContext context) {
    final menuProvider = Provider.of<MenuProvider>(context);
    final products = menuProvider.getProductsByCategory(widget.category.name);
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: Text(
          widget.category.name,
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
      body: products.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.fastfood,
                    color: Color(0xFF8D6E63),
                    size: 64,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No hay productos disponibles\nen esta categoría',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF8D6E63),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : Padding(
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

  Widget _buildProductCard(Product product, BuildContext context) {
    IconData _getIconFromString(String? iconName) {
      switch (iconName) {
        case 'coffee':
          return Icons.coffee;
        case 'restaurant':
          return Icons.restaurant;
        case 'local_dining':
          return Icons.local_dining;
        case 'local_cafe':
          return Icons.local_cafe;
        case 'icecream':
          return Icons.icecream;
        case 'cake':
          return Icons.cake;
        case 'lunch_dining':
          return Icons.lunch_dining;
        case 'local_drink':
          return Icons.local_drink;
        case 'fastfood':
          return Icons.fastfood;
        case 'bakery_dining':
          return Icons.bakery_dining;
        case 'local_pizza':
          return Icons.local_pizza;
        case 'set_meal':
          return Icons.set_meal;
        case 'breakfast_dining':
          return Icons.breakfast_dining;
        case 'shopping_bag':
          return Icons.shopping_bag;
        case 'egg':
          return Icons.egg;
        case 'rice_bowl':
          return Icons.rice_bowl;
        case 'grass':
          return Icons.grass;
        case 'emoji_food_beverage':
          return Icons.emoji_food_beverage;
        case 'coffee_maker':
          return Icons.coffee_maker;
        case 'sports_bar':
          return Icons.sports_bar;
        case 'water_drop':
          return Icons.water_drop;
        case 'pie_chart':
          return Icons.pie_chart;
        case 'cookie':
          return Icons.cookie;
        case 'category':
          return Icons.category;
        case 'medication':
          return Icons.medication;
        default:
          return Icons.restaurant_menu;
      }
    }

    void _addToCart(Product product, BuildContext context) {
      final cartProvider = Provider.of<CartProvider>(context, listen: false);

      final cartItem = CartItem(
        id: product.id,
        name: product.name,
        price: product.price,
        icon: _getIconFromString(product.icon),
        quantity: 1,
      );

      cartProvider.addToCart(cartItem);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF6D4C41),
          content: Text('${product.name} agregado al carrito'),
          duration: const Duration(seconds: 2),
        ),
      );
    }

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
                    _getIconFromString(product.icon),
                    color: const Color(0xFF6D4C41),
                    size: 30,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                product.name,
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
                '\$${product.price.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: Color(0xFF8D6E63),
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
              if (product.description != null &&
                  product.description!.isNotEmpty)
                Column(
                  children: [
                    const SizedBox(height: 4),
                    Text(
                      product.description!,
                      style: const TextStyle(
                        color: Color(0xFF8D6E63),
                        fontSize: 10,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
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
                    padding: const EdgeInsets.symmetric(
                        vertical: 6), // Reducido de 8 a 6
                  ),
                  child: const Text('Agregar',
                      style: TextStyle(fontSize: 11)), // Reducido de 12 a 11
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToCartPage(BuildContext context) {
    Navigator.pushNamed(context, '/orders');
  }
}
