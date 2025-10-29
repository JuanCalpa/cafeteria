import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _errorMessage;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _user != null;

  final ApiService _apiService = ApiService();

  Future<bool> login(String correo, String contrasena) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.login(correo, contrasena);
      _user = User.fromJson(response['usuario']);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String nombre, String correo, String contrasena) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _apiService.register(nombre, correo, contrasena);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      // Manejar errores específicos
      String errorMsg = e.toString();
      if (errorMsg.contains('Duplicate entry') || errorMsg.contains('correo')) {
        _errorMessage =
            'El correo electrónico ya está registrado. Por favor, utiliza otro correo.';
      } else if (errorMsg.contains('Failed to register')) {
        _errorMessage =
            'Error al registrar usuario. Verifica tu conexión e intenta nuevamente.';
      } else {
        _errorMessage = 'Error desconocido. Por favor, intenta nuevamente.';
      }
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
    } catch (e) {
      print('Error al cerrar sesión: $e');
    }
    _user = null;
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> verificarSesion() async {
    try {
      final response = await _apiService.verificarSesion();
      _user = User.fromJson(response['usuario']);
    } catch (e) {
      _user = null;
    }
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
