import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6), // Color crema claro
      appBar: AppBar(
        title: const Text(
          'Registro',
          style: TextStyle(
            color: Color(0xFF5D4037), // Café oscuro
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFFFDF5E6),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFF8D6E63), // Café medio
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: ListView(
          children: [
            // Logo/Icono decorativo
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF8D6E63), Color(0xFF6D4C41)],
                ),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.brown.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.person_add,
                size: 40,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),

            // Título
            const Text(
              'Cafetería U. Mariana',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF5D4037), // Café oscuro
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Crear una cuenta',
              style: TextStyle(
                fontSize: 18,
                color: Color(0xFF8D6E63),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 30),

            const SizedBox(height: 20),

            // Campo de Nombre
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.brown.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre completo',
                  labelStyle: TextStyle(color: Color(0xFF8D6E63)), // Café medio
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  prefixIcon: Icon(
                    Icons.person_outline,
                    color: Color(0xFF8D6E63),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Campo de Correo
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.brown.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Correo',
                  labelStyle: TextStyle(color: Color(0xFF8D6E63)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  prefixIcon: Icon(
                    Icons.email_outlined,
                    color: Color(0xFF8D6E63),
                  ),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
            ),
            const SizedBox(height: 20),

            // Campo de Contraseña
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.brown.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Contraseña',
                  labelStyle: TextStyle(color: Color(0xFF8D6E63)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  prefixIcon: Icon(
                    Icons.lock_outline,
                    color: Color(0xFF8D6E63),
                  ),
                ),
                obscureText: true,
              ),
            ),
            const SizedBox(height: 30),

            // Botón de Registrar
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: authProvider.isLoading
                    ? null
                    : () async {
                        final name = _nameController.text.trim();
                        final email = _emailController.text.trim();
                        final password = _passwordController.text.trim();

                        if (name.isEmpty || email.isEmpty || password.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content:
                                  Text('Por favor, completa todos los campos'),
                            ),
                          );
                          return;
                        }

                        final success =
                            await authProvider.register(name, email, password);
                        if (success) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Usuario registrado exitosamente'),
                              backgroundColor: Colors.green,
                            ),
                          );
                          Navigator.pop(context);
                        } else {
                          // Mostrar mensaje de error específico
                          String errorMessage = 'Error al registrar usuario';
                          if (authProvider.errorMessage != null) {
                            if (authProvider.errorMessage!.contains('correo') ||
                                authProvider.errorMessage!.contains('email') ||
                                authProvider.errorMessage!
                                    .contains('ya existe')) {
                              errorMessage =
                                  'Este correo electrónico ya está registrado';
                            } else if (authProvider.errorMessage!
                                    .contains('contraseña') ||
                                authProvider.errorMessage!
                                    .contains('password')) {
                              errorMessage =
                                  'La contraseña debe tener al menos 6 caracteres';
                            } else if (authProvider.errorMessage!
                                    .contains('nombre') ||
                                authProvider.errorMessage!.contains('name')) {
                              errorMessage = 'El nombre es obligatorio';
                            } else {
                              errorMessage = authProvider.errorMessage!;
                            }
                          }

                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text(
                                  'Error de Registro',
                                  style: TextStyle(
                                    color: Color(0xFF5D4037),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                content: Text(
                                  errorMessage,
                                  style: const TextStyle(
                                    color: Color(0xFF8D6E63),
                                  ),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () {
                                      Navigator.of(context).pop();
                                    },
                                    child: const Text(
                                      'Entendido',
                                      style: TextStyle(
                                        color: Color(0xFF6D4C41),
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                                backgroundColor: const Color(0xFFFDF5E6),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              );
                            },
                          );
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6D4C41), // Café principal
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 3,
                ),
                child: authProvider.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'Registrar',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
            const SizedBox(height: 20),

            // Información adicional o términos
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Al registrarte, aceptas nuestros términos y condiciones',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF8D6E63), fontSize: 12),
              ),
            ),
            const SizedBox(height: 30),

            // Enlace para volver al login
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text(
                '¿Ya tienes cuenta? Inicia sesión',
                style: TextStyle(
                  color: Color(0xFF8D6E63),
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
