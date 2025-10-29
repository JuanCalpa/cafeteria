import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/category_model.dart';

class ApiService {
  // ⚠️ IMPORTANTE: Esta URL la cambiarás después de desplegar en Railway
  static const String baseUrl = 'http://10.0.2.2:3000'; // Para emulador Android
  // static const String baseUrl =
  //     'http://localhost:3000'; // Para desarrollo local
  // static const String baseUrl = 'https://tu-backend.railway.app'; // Para producción

  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client client = http.Client();

  Future<List<Category>> getCategories() async {
    try {
      print('🔄 Obteniendo categorías desde: $baseUrl/api/categories');

      final response = await client.get(
        Uri.parse('$baseUrl/api/categories'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Categorías obtenidas: ${data.length}');
        return data.map((category) => Category.fromJson(category)).toList();
      } else {
        print('❌ Error al obtener categorías: ${response.statusCode}');
        throw Exception('Failed to load categories: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching categories: $e');
      throw Exception('Error fetching categories: $e');
    }
  }

  Future<List<Product>> getProductsByCategory(String categoryName) async {
    try {
      print('🔄 Obteniendo productos para categoría: $categoryName');

      final response = await client.get(
        Uri.parse('$baseUrl/api/categories/$categoryName/products'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Productos obtenidos: ${data.length} para $categoryName');
        return data.map((product) => Product.fromJson(product)).toList();
      } else {
        print('❌ Error al obtener productos: ${response.statusCode}');
        throw Exception('Failed to load products: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching products: $e');
      throw Exception('Error fetching products: $e');
    }
  }

  Future<List<Product>> getAllProducts() async {
    try {
      print('🔄 Obteniendo todos los productos...');

      final response = await client.get(
        Uri.parse('$baseUrl/api/products'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Todos los productos obtenidos: ${data.length}');
        return data.map((product) => Product.fromJson(product)).toList();
      } else {
        print('❌ Error HTTP productos: ${response.statusCode}');
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching all products: $e');
      throw Exception('Error fetching all products: $e');
    }
  }

  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/api/products/search?q=$query'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((product) => Product.fromJson(product)).toList();
      } else {
        throw Exception('Failed to search products: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error searching products: $e');
    }
  }

  // Métodos para autenticación
  Future<Map<String, dynamic>> login(String correo, String contrasena) async {
    try {
      print('🔄 Iniciando sesión con: $correo');

      final response = await client.post(
        Uri.parse('$baseUrl/api/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'correo': correo,
          'contrasena': contrasena,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Login exitoso: ${data['usuario']}');
        return data;
      } else {
        print('❌ Error en login: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to login: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error en login: $e');
      throw Exception('Error logging in: $e');
    }
  }

  Future<Map<String, dynamic>> register(
      String nombre, String correo, String contrasena) async {
    try {
      print('🔄 Registrando usuario: $correo');

      final response = await client.post(
        Uri.parse('$baseUrl/api/registro'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'nombre': nombre,
          'correo': correo,
          'contrasena': contrasena,
          'rol': 'cliente', // Rol por defecto para usuarios de la app móvil
          'fecha_registro':
              DateTime.now().toString().split(' ')[0], // Formato YYYY-MM-DD
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        print('✅ Registro exitoso: ${data['mensaje']}');
        return data;
      } else {
        print('❌ Error en registro: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to register: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error en registro: $e');
      throw Exception('Error registering: $e');
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      print('🔄 Cerrando sesión...');

      final response = await client.post(
        Uri.parse('$baseUrl/api/logout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Logout exitoso: ${data['mensaje']}');
        return data;
      } else {
        print('❌ Error en logout: ${response.statusCode}');
        throw Exception('Failed to logout: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error en logout: $e');
      throw Exception('Error logging out: $e');
    }
  }

  Future<Map<String, dynamic>> verificarSesion() async {
    try {
      print('🔄 Verificando sesión...');

      final response = await client.get(
        Uri.parse('$baseUrl/api/verificarSesion'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Sesión activa: ${data['usuario']}');
        return data;
      } else {
        print('❌ Sesión no activa: ${response.statusCode}');
        throw Exception('Session not active: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error verificando sesión: $e');
      throw Exception('Error verifying session: $e');
    }
  }
}
