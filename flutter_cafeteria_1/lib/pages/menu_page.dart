import 'package:flutter/material.dart';
import 'category_pages.dart';

class MenuPage extends StatefulWidget {
  const MenuPage({super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  final List<Map<String, dynamic>> _categories = [
    {
      'name': 'ALMUERZOS',
      'icon': Icons.restaurant,
      'color': const Color(0xFF8D6E63),
      'products': [
        {'name': 'TOSTADO', 'price': 4500, 'icon': Icons.restaurant},
        {
          'name': 'BANDEJAS TIQUETERA',
          'price': 9500,
          'icon': Icons.lunch_dining,
        },
        {
          'name': 'ALMUERZO TIQUETERA',
          'price': 10500,
          'icon': Icons.restaurant_menu,
        },
        {
          'name': 'ALMUERZO COMPLETO',
          'price': 11000,
          'icon': Icons.dinner_dining,
        },
        {
          'name': 'ALMUERSO CON SALCHICHA',
          'price': 10000,
          'icon': Icons.set_meal,
        },
        {'name': 'ALMUERZO CON HUEVO', 'price': 9500, 'icon': Icons.egg},
        {'name': 'PORCION DE ARROZ', 'price': 2000, 'icon': Icons.rice_bowl},
        {'name': 'BANDEJA ALMZO', 'price': 10000, 'icon': Icons.rice_bowl},
        {'name': 'PORCION ENSALADA', 'price': 2000, 'icon': Icons.grass},
        {
          'name': 'COMBO CARNE Y PAPAS',
          'price': 8500,
          'icon': Icons.emoji_food_beverage,
        },
      ],
    },
    {
      'name': 'BEBIDAS',
      'icon': Icons.local_drink,
      'color': const Color(0xFF6D4C41),
      'products': [
        {'name': 'TINTO', 'price': 2500, 'icon': Icons.coffee},
        {'name': 'GASEOSA MINI', 'price': 1300, 'icon': Icons.local_drink},
        {'name': 'CIELO 600 ML', 'price': 1500, 'icon': Icons.water_drop},
        {'name': 'MALTEADA DRACULA', 'price': 4500, 'icon': Icons.icecream},
        {'name': 'LIMONADA', 'price': 3000, 'icon': Icons.local_cafe},
        {'name': 'GATORADE', 'price': 4000, 'icon': Icons.sports_bar},
        {'name': 'CAPUCCINO', 'price': 4500, 'icon': Icons.coffee_maker},
        {'name': 'CAPUCCINO GRANDE', 'price': 5500, 'icon': Icons.coffee_maker},
        {'name': 'TAMPICO', 'price': 1400, 'icon': Icons.local_drink},
        {'name': 'GRIEGO', 'price': 5600, 'icon': Icons.local_cafe},
      ],
    },
    {
      'name': 'BEBIDAS PROPIAS',
      'icon': Icons.coffee,
      'color': const Color(0xFF5D4037),
      'products': [
        {'name': 'CAFE HELADO', 'price': 5500, 'icon': Icons.coffee},
        {'name': 'MALTEADA', 'price': 6500, 'icon': Icons.icecream},
        {'name': 'CHOCOLATE', 'price': 2800, 'icon': Icons.coffee},
        {'name': 'CAFE GRANDE', 'price': 2600, 'icon': Icons.coffee},
        {'name': 'JUGOS NATURALES', 'price': 3500, 'icon': Icons.local_drink},
        {
          'name': 'FRUTA CON HELADO/YOGURT CON FRUTA',
          'price': 5500,
          'icon': Icons.icecream,
        },
      ],
    },
    {
      'name': 'COMIDA RÁPIDA',
      'icon': Icons.fastfood,
      'color': const Color(0xFF8D6E63),
      'products': [
        {'name': 'COMBO SAND. POLLO', 'price': 7500, 'icon': Icons.fastfood},
        {
          'name': 'PORCION CARNE',
          'price': 5000,
          'icon': Icons.emoji_food_beverage,
        },
        {'name': 'TORTA CASERA', 'price': 2800, 'icon': Icons.cake},
        {
          'name': 'COMBO SAND. PICANTE',
          'price': 8000,
          'icon': Icons.local_pizza,
        },
        {
          'name': 'COMBO PERRO CALIENTE',
          'price': 8500,
          'icon': Icons.lunch_dining,
        },
        {
          'name': 'EMPANADA DE HORNO',
          'price': 4500,
          'icon': Icons.bakery_dining,
        },
        {'name': 'EMPANADAS', 'price': 2200, 'icon': Icons.bakery_dining},
        {'name': 'PASTEL DE POLLO', 'price': 3500, 'icon': Icons.pie_chart},
        {'name': 'SALPICON', 'price': 4000, 'icon': Icons.lunch_dining},
        {'name': 'PERRO CALIENTE', 'price': 5800, 'icon': Icons.lunch_dining},
      ],
    },
    {
      'name': 'DESAYUNOS',
      'icon': Icons.breakfast_dining,
      'color': const Color(0xFF6D4C41),
      'products': [
        {
          'name': 'DESAYUNO SERV GRALES',
          'price': 3500,
          'icon': Icons.breakfast_dining,
        },
        {
          'name': 'COMPLETO SIN BEBIDA',
          'price': 7500,
          'icon': Icons.breakfast_dining,
        },
        {
          'name': 'DESAYUNO SENC',
          'price': 4000,
          'icon': Icons.breakfast_dining,
        },
        {'name': 'SENCILLO', 'price': 6000, 'icon': Icons.breakfast_dining},
        {'name': 'COMPLETO', 'price': 8500, 'icon': Icons.breakfast_dining},
        {'name': 'PORCION DE HUEVOS', 'price': 1200, 'icon': Icons.egg},
      ],
    },
    {
      'name': 'DULCES',
      'icon': Icons.cake,
      'color': const Color(0xFF5D4037),
      'products': [
        {'name': 'SNICKERS', 'price': 7000, 'icon': Icons.cake},
        {'name': 'NUCITA CHOCOLATINA', 'price': 2200, 'icon': Icons.cake},
        {'name': 'BON A BON', 'price': 1400, 'icon': Icons.cookie},
        {'name': 'GALAK GRANDE', 'price': 9500, 'icon': Icons.icecream},
        {'name': 'JET 30 GRS', 'price': 3700, 'icon': Icons.cookie},
        {'name': 'PONKY', 'price': 2000, 'icon': Icons.cookie},
      ],
    },
    {
      'name': 'HELADERÍA',
      'icon': Icons.icecream,
      'color': const Color(0xFF8D6E63),
      'products': [
        {'name': 'AFOGATO', 'price': 5500, 'icon': Icons.icecream},
        {'name': 'CHOCOCONO', 'price': 3500, 'icon': Icons.icecream},
        {'name': 'JET HELADO', 'price': 5000, 'icon': Icons.icecream},
        {'name': 'BROWNIE', 'price': 6000, 'icon': Icons.cake},
        {
          'name': 'VASO DE HELADO 2 BOLAS',
          'price': 4500,
          'icon': Icons.icecream,
        },
      ],
    },
    {
      'name': 'SANDWICHES',
      'icon': Icons.lunch_dining,
      'color': const Color(0xFF6D4C41),
      'products': [
        {
          'name': 'COMBO SAND. POLLO ESPECIAL',
          'price': 8500,
          'icon': Icons.lunch_dining,
        },
        {'name': 'HAMBURGUESA', 'price': 6500, 'icon': Icons.lunch_dining},
        {'name': 'CUBANO', 'price': 4200, 'icon': Icons.lunch_dining},
        {'name': 'SAND. POLLO', 'price': 4800, 'icon': Icons.lunch_dining},
        {
          'name': 'COMBO HAMBURGUESA',
          'price': 9000,
          'icon': Icons.lunch_dining,
        },
      ],
    },
    {
      'name': 'PAPAS',
      'icon': Icons.fastfood,
      'color': const Color(0xFF5D4037),
      'products': [
        {'name': 'RANCHERO', 'price': 7000, 'icon': Icons.fastfood},
        {'name': 'PAPAS CON MANI', 'price': 5000, 'icon': Icons.fastfood},
        {'name': 'SALCHIPAPA', 'price': 6000, 'icon': Icons.fastfood},
        {'name': 'SALCHIRANCHERA', 'price': 6500, 'icon': Icons.fastfood},
        {'name': 'FRANCESA CON SALSAS', 'price': 6300, 'icon': Icons.fastfood},
      ],
    },
    {
      'name': 'LÁCTEOS',
      'icon': Icons.local_drink,
      'color': const Color(0xFF8D6E63),
      'products': [
        {'name': 'YOGURTH EN BOLSA', 'price': 1500, 'icon': Icons.local_drink},
        {'name': 'KUMIS ALPINA', 'price': 3000, 'icon': Icons.local_drink},
        {'name': 'ALPIN', 'price': 2800, 'icon': Icons.local_drink},
        {'name': 'BON YURT', 'price': 4200, 'icon': Icons.local_drink},
        {
          'name': 'YOGURTCON GRANOLA Y FRUTA',
          'price': 5500,
          'icon': Icons.local_drink,
        },
      ],
    },
    {
      'name': 'GASEOSAS',
      'icon': Icons.local_drink,
      'color': const Color(0xFF6D4C41),
      'products': [
        {
          'name': 'VASO GASEOSA X 7 OZ',
          'price': 1200,
          'icon': Icons.local_drink,
        },
        {'name': 'AGUA LITRO', 'price': 2500, 'icon': Icons.water_drop},
        {'name': 'COCA LATA', 'price': 3800, 'icon': Icons.local_drink},
        {
          'name': 'COCA COLA X 1.5 LITROS',
          'price': 7000,
          'icon': Icons.local_drink,
        },
        {'name': 'POSTOBON 2.5 LT', 'price': 6000, 'icon': Icons.local_drink},
      ],
    },
    {
      'name': 'PAQUETES',
      'icon': Icons.shopping_bag,
      'color': const Color(0xFF5D4037),
      'products': [
        {'name': 'PEKITAS', 'price': 2200, 'icon': Icons.shopping_bag},
        {'name': 'PISTACHO', 'price': 14000, 'icon': Icons.shopping_bag},
        {'name': 'ORE O', 'price': 1500, 'icon': Icons.shopping_bag},
        {'name': 'TAKIS', 'price': 3700, 'icon': Icons.shopping_bag},
        {
          'name': 'DORITOS MEGA QUESO 43 GRS',
          'price': 2700,
          'icon': Icons.shopping_bag,
        },
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
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
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.2,
          ),
          itemCount: _categories.length,
          itemBuilder: (context, index) {
            final category = _categories[index];
            return _buildCategoryCard(category, context);
          },
        ),
      ),
    );
  }

  Widget _buildCategoryCard(
    Map<String, dynamic> category,
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
                category['color'] as Color,
                (category['color'] as Color).withOpacity(0.8),
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
              Icon(category['icon'] as IconData, color: Colors.white, size: 40),
              const SizedBox(height: 12),
              Text(
                category['name'],
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${(category['products'] as List).length} productos',
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
    Map<String, dynamic> category,
  ) {
    // Usar CategoryPage directamente en lugar de las páginas específicas
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CategoryPage(category: category),
      ),
    );
  }
}
