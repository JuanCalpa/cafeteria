import 'package:flutter/foundation.dart' hide Category;
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/category_model.dart';

class MenuProvider with ChangeNotifier {
  // PRUEBA CON DIFERENTES URLs:
  final String _baseUrl = 'http://10.0.2.2:3000'; // Para emulador Android
  // Alternativas si no funciona:
  // final String _baseUrl = 'http://127.0.0.1:3000'; // Para desarrollo local
  // final String _baseUrl = 'http://localhost:3000'; // Para desarrollo local
  // final String _baseUrl = 'http://0.0.0.0:3000'; // Para servidor

  List<Category> _categories = [];
  List<Product> _allProducts = [];
  List<Product> _categoryProducts = [];
  bool _isLoading = false;
  String _error = '';

  List<Category> get categories => _categories;
  List<Product> get allProducts => _allProducts;
  List<Product> get categoryProducts => _categoryProducts;
  bool get isLoading => _isLoading;
  String get error => _error;

  List<Product> getProductsByCategory(String categoryName) {
    return _allProducts
        .where((product) => product.category == categoryName)
        .toList();
  }

  Future<void> loadMenuData() async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      print('🔄 Iniciando carga de datos desde: $_baseUrl');

      // Primero prueba la conexión básica
      await _testConnection();

      // Luego carga los datos
      await Future.wait([
        _fetchCategories(),
        _fetchAllProducts(),
      ]);

      print('✅ Datos cargados exitosamente');
      print(
          '📊 Categorías: ${_categories.length}, Productos: ${_allProducts.length}');
    } catch (e) {
      _error = 'Error cargando datos del menú: $e';
      print('❌ Error cargando datos del menú: $e');
      print('🔍 Detalles del error: ${e.toString()}');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _testConnection() async {
    try {
      print('🔍 Probando conexión con el servidor...');
      final response = await http.get(
        Uri.parse('$_baseUrl/health'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 10));

      if (response.statusCode == 200) {
        print('✅ Conexión con servidor exitosa');
      } else {
        throw Exception('Servidor respondió con error: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error de conexión: $e');
      throw Exception('No se pudo conectar al servidor: $e');
    }
  }

  Future<void> _fetchCategories() async {
    try {
      print('🔄 Obteniendo categorías desde: $_baseUrl/api/categories');
      final response = await http.get(
        Uri.parse('$_baseUrl/api/categories'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 15));

      print('📊 Respuesta del servidor - Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _categories = data.map((json) => Category.fromJson(json)).toList();
        print('✅ Categorías cargadas: ${_categories.length}');
      } else {
        print('❌ Error HTTP: ${response.statusCode} - ${response.body}');
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } catch (e) {
      _error = 'Error fetching categories: $e';
      print('❌ Error fetching categories: $e');
      throw e;
    }
  }

  Future<void> _fetchAllProducts() async {
    try {
      print('🔄 Obteniendo todos los productos...');
      final response = await http.get(
        Uri.parse('$_baseUrl/api/products'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 15));

      print('📊 Respuesta productos - Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _allProducts = data.map((json) => Product.fromJson(json)).toList();
        print('✅ Productos cargados: ${_allProducts.length}');
      } else {
        print('❌ Error HTTP productos: ${response.statusCode}');
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } catch (e) {
      _error = 'Error fetching all products: $e';
      print('❌ Error fetching all products: $e');
      throw e;
    }
  }

  // ... (los demás métodos permanecen igual)
  Future<void> fetchProductsByCategory(String categoryName) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      print('🔄 Obteniendo productos para categoría: $categoryName');
      final response = await http.get(
        Uri.parse('$_baseUrl/api/categories/$categoryName/products'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _categoryProducts = data.map((json) => Product.fromJson(json)).toList();
        print('✅ Productos de categoría cargados: ${_categoryProducts.length}');
      } else {
        throw Exception(
            'Failed to load category products: ${response.statusCode}');
      }
    } catch (e) {
      _error = 'Error fetching category products: $e';
      print('❌ Error fetching category products: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = '';
    notifyListeners();
  }
}
