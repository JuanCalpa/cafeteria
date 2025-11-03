import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'menu_page.dart'; // Asegúrate de importar el MenuPage
import 'orders_page.dart'; // Importa la página de pedidos
import 'history_page.dart'; // Importa la página de historial
import '../providers/auth_provider.dart';
import '../pages/login_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6), // Color crema claro
      appBar: AppBar(
        title: const Text(
          'Cafetería Universidad Mariana',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFF8D6E63)),
      ),
      drawer: _buildDrawer(),
      body: _buildBody(),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      backgroundColor: const Color(0xFFFDF5E6),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Color(0xFF6D4C41)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white,
                  radius: 30,
                  child: Icon(Icons.coffee, size: 40, color: Color(0xFF6D4C41)),
                ),
                SizedBox(height: 10),
                Text(
                  'Cafetería U. Mariana',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Bienvenido/a',
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(
              Icons.restaurant_menu,
              color: Color(0xFF8D6E63),
            ),
            title: const Text(
              'Menú',
              style: TextStyle(color: Color(0xFF5D4037)),
            ),
            onTap: () {
              Navigator.pop(context);
              _navigateToMenuPage(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.shopping_bag, color: Color(0xFF8D6E63)),
            title: const Text(
              'Mis Pedidos',
              style: TextStyle(color: Color(0xFF5D4037)),
            ),
            onTap: () {
              Navigator.pop(context);
              _navigateToOrdersPage(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.history, color: Color(0xFF8D6E63)),
            title: const Text(
              'Historial',
              style: TextStyle(color: Color(0xFF5D4037)),
            ),
            onTap: () {
              Navigator.pop(context);
              _navigateToHistoryPage(context);
            },
          ),
          const Divider(color: Color(0xFF8D6E63)),
          ListTile(
            leading: const Icon(Icons.settings, color: Color(0xFF8D6E63)),
            title: const Text(
              'Configuración',
              style: TextStyle(color: Color(0xFF5D4037)),
            ),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.exit_to_app, color: Color(0xFF8D6E63)),
            title: const Text(
              'Cerrar Sesión',
              style: TextStyle(color: Color(0xFF5D4037)),
            ),
            onTap: () async {
              Navigator.pop(context);
              final authProvider =
                  Provider.of<AuthProvider>(context, listen: false);
              await authProvider.logout();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Título principal grande y bonito
          _buildMainTitle(),
          const SizedBox(height: 30),

          // Imagen bonita centrada
          _buildHeroImage(),
          const SizedBox(height: 40),

          // Banner de bienvenida
          _buildWelcomeCard(),
          const SizedBox(height: 25),

          // Sección explicativa
          _buildInfoSection(),
          const SizedBox(height: 25),

          // Acciones rápidas
          _buildQuickActions(),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard() {
    final authProvider = Provider.of<AuthProvider>(context);
    final userName = authProvider.user?.nombre ?? 'Usuario';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF8D6E63), Color(0xFF6D4C41)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.brown.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '¡Bienvenido, $userName!',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Disfruta de nuestros deliciosos productos y servicios exclusivos para la comunidad universitaria',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 15),
          ElevatedButton(
            onPressed: () {
              _navigateToMenuPage(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF6D4C41),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: const Text('Explorar Menú'),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '¿Qué puedes hacer con la app?',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 15),
        _buildFeatureCard(
          icon: Icons.menu_book,
          title: 'Ver Menú Completo',
          description:
              'Explora nuestra variedad de bebidas, snacks y comidas disponibles',
          color: const Color(0xFFD7CCC8),
        ),
        const SizedBox(height: 12),
        _buildFeatureCard(
          icon: Icons.shopping_cart,
          title: 'Realizar Pedidos',
          description: 'Ordena tus productos favoritos y programa la recogida',
          color: const Color(0xFFE6D7C9),
        ),
        const SizedBox(height: 12),
        _buildFeatureCard(
          icon: Icons.access_time,
          title: 'Ahorrar Tiempo',
          description: 'Evita filas ordenando desde tu celular',
          color: const Color(0xFFF0E6D2),
        ),
        const SizedBox(height: 12),
        _buildFeatureCard(
          icon: Icons.local_offer,
          title: 'Promociones Exclusivas',
          description: 'Accede a descuentos especiales para estudiantes',
          color: const Color(0xFFD7CCC8),
        ),
      ],
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF8D6E63).withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: Color(0xFF6D4C41),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFF5D4037),
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    color: Color(0xFF8D6E63),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Acciones Rápidas',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 15),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                icon: Icons.restaurant_menu,
                label: 'Menú',
                onTap: () {
                  _navigateToMenuPage(context);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                icon: Icons.shopping_bag,
                label: 'Pedidos',
                onTap: () {
                  _navigateToOrdersPage(context);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                icon: Icons.history,
                label: 'Historial',
                onTap: () {
                  _navigateToHistoryPage(context);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
          border: Border.all(color: const Color(0xFF8D6E63).withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: const Color(0xFF6D4C41), size: 30),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFF5D4037),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDailyPromotions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Promociones del Día',
          style: TextStyle(
            color: Color(0xFF5D4037),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 15),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFE6D7C9),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF8D6E63).withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFF6D4C41),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.local_offer, color: Colors.white),
              ),
              const SizedBox(width: 15),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '2x1 en Cafés Especiales',
                      style: TextStyle(
                        color: Color(0xFF5D4037),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Hoy hasta las 12:00 pm',
                      style: TextStyle(color: Color(0xFF8D6E63), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomNavigationBar(
      currentIndex: _currentIndex,
      onTap: (index) {
        setState(() {
          _currentIndex = index;
        });
        // Navegar según el índice seleccionado
        if (index == 1) {
          // Índice 1 es el Menú
          _navigateToMenuPage(context);
        } else if (index == 2) {
          // Índice 2 es Pedidos
          _navigateToOrdersPage(context);
        }
      },
      backgroundColor: Colors.white,
      selectedItemColor: const Color(0xFF6D4C41),
      unselectedItemColor: const Color(0xFF8D6E63),
      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
        BottomNavigationBarItem(
          icon: Icon(Icons.restaurant_menu),
          label: 'Menú',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.shopping_bag),
          label: 'Pedidos',
        ),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
      ],
    );
  }

  // Método para navegar al MenuPage
  void _navigateToMenuPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const MenuPage()),
    );
  }

  // Método para navegar a OrdersPage
  void _navigateToOrdersPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const OrdersPage()),
    );
  }

  // Método para navegar a HistoryPage
  void _navigateToHistoryPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const HistoryPage()),
    );
  }

  Widget _buildMainTitle() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      child: Column(
        children: [
          Text(
            'Cafetería',
            style: TextStyle(
              color: const Color(0xFF5D4037),
              fontSize: 42,
              fontWeight: FontWeight.bold,
              shadows: [
                Shadow(
                  color: Colors.brown.withOpacity(0.3),
                  offset: const Offset(2, 2),
                  blurRadius: 4,
                ),
              ],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'U. Mariana',
            style: TextStyle(
              color: const Color(0xFF8D6E63),
              fontSize: 28,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Container(
            width: 80,
            height: 4,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF8D6E63), Color(0xFF6D4C41)],
              ),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroImage() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      height: 280,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.brown.withOpacity(0.2),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Image.asset(
          'assets/Cappuccino.jpg',
          width: double.infinity,
          height: double.infinity,
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  Widget _buildDecorativeIcon(IconData icon) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.8),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.brown.withOpacity(0.2),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Icon(
        icon,
        size: 24,
        color: const Color(0xFF8D6E63),
      ),
    );
  }
}
