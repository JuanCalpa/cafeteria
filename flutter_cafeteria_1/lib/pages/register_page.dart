import 'package:flutter/material.dart';

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
            // Título
            const Text(
              'Crear una cuenta',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF5D4037), // Café oscuro
              ),
            ),
            const SizedBox(height: 30),

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
                onPressed: () {
                  // Aquí se manejaría el registro
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6D4C41), // Café principal
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 3,
                ),
                child: const Text(
                  'Registrar',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
