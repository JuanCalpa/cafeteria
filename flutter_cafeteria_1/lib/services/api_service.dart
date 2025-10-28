import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/category_model.dart';

class ApiService {
  // ⚠️ IMPORTANTE: Esta URL la cambiarás después de desplegar en Railway
  static const String baseUrl = 'http://10.0.2.2:3000'; // Para emulador Android
  // static const String baseUrl = 'http://localhost:3000'; // Para desarrollo local
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
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Todos los productos obtenidos: ${data.length}');
        return data.map((product) => Product.fromJson(product)).toList();
      } else {
        print('❌ Error al obtener todos los productos: ${response.statusCode}');
        throw Exception('Failed to load all products: ${response.statusCode}');
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
}
