import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'category_pages.dart';
import '../providers/menu_provider.dart';
import '../models/category_model.dart';

class MenuPage extends StatefulWidget {
  const MenuPage({super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  @override
  void initState() {
    super.initState();
    // Cargar datos cuando la página se inicialice
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final menuProvider = Provider.of<MenuProvider>(context, listen: false);
      menuProvider.loadMenuData();
    });
  }

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

  Color _getColorFromString(String? colorHex) {
    if (colorHex == null || colorHex.isEmpty) {
      return const Color(0xFF8D6E63);
    }
    try {
      return Color(int.parse(colorHex.replaceFirst('#', '0xFF')));
    } catch (e) {
      return const Color(0xFF8D6E63);
    }
  }

  @override
  Widget build(BuildContext context) {
    final menuProvider = Provider.of<MenuProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6),
      appBar: AppBar(
        title: const Text(
          'Menú Cafetería',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
        actions: [
          if (menuProvider.isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF8D6E63)),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              menuProvider.loadMenuData();
            },
            tooltip: 'Recargar menú',
          ),
        ],
      ),
      body: menuProvider.isLoading
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Color(0xFF8D6E63)),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Cargando menú...',
                    style: TextStyle(
                      color: Color(0xFF8D6E63),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : menuProvider.error.isNotEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 64,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Error: ${menuProvider.error}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.red,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => menuProvider.loadMenuData(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6D4C41),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Reintentar'),
                      ),
                    ],
                  ),
                )
              : menuProvider.categories.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.restaurant_menu,
                            color: Color(0xFF8D6E63),
                            size: 64,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No hay categorías disponibles',
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
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: 1.2,
                        ),
                        itemCount: menuProvider.categories.length,
                        itemBuilder: (context, index) {
                          final category = menuProvider.categories[index];
                          final categoryProducts =
                              menuProvider.getProductsByCategory(category.name);

                          return _buildCategoryCard(
                              category, categoryProducts.length, context);
                        },
                      ),
                    ),
    );
  }

  Widget _buildCategoryCard(
    Category category,
    int productCount,
    BuildContext context,
  ) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () {
          _navigateToCategoryPage(context, category);
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                _getColorFromString(category.color),
                _getColorFromString(category.color).withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.brown.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _getIconFromString(category.icon),
                color: Colors.white,
                size: 40,
              ),
              const SizedBox(height: 12),
              Text(
                category.name,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '$productCount productos',
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToCategoryPage(
    BuildContext context,
    Category category,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CategoryPage(category: category),
      ),
    );
  }
}
