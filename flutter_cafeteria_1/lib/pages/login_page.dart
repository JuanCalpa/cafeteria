import 'package:flutter/material.dart';
import 'register_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _rememberMe = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDF5E6), // Color crema claro
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Título
                const Text(
                  'Login',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF5D4037), // Café oscuro
                  ),
                ),
                const SizedBox(height: 40),

                // Campo de Usuario
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
                      labelText: 'Email',
                      labelStyle: TextStyle(
                        color: Color(0xFF8D6E63),
                      ), // Café medio
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      prefixIcon: Icon(Icons.person, color: Color(0xFF8D6E63)),
                    ),
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
                      labelText: 'Password',
                      labelStyle: TextStyle(color: Color(0xFF8D6E63)),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      prefixIcon: Icon(Icons.lock, color: Color(0xFF8D6E63)),
                    ),
                    obscureText: true,
                  ),
                ),
                const SizedBox(height: 20),

                // Recordarme
                Row(
                  children: [
                    Checkbox(
                      value: _rememberMe,
                      onChanged: (value) {
                        setState(() {
                          _rememberMe = value!;
                        });
                      },
                      activeColor: const Color(0xFF8D6E63), // Café medio
                    ),
                    const Text(
                      'Remember me',
                      style: TextStyle(color: Color(0xFF5D4037)),
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // Botón de Login
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      // Aquí luego validas el login
                      Navigator.pushReplacementNamed(context, '/home');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(
                        0xFF6D4C41,
                      ), // Café principal
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 3,
                    ),
                    child: const Text(
                      'Login',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Texto de contraseña objetivo (Target Password)
                const Text(
                  'Target Password',
                  style: TextStyle(color: Color(0xFF8D6E63), fontSize: 14),
                ),
                const SizedBox(height: 30),

                // Enlace de registro
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const RegisterPage()),
                    );
                  },
                  child: const Text(
                    '¿No tienes cuenta? Regístrate',
                    style: TextStyle(
                      color: Color(0xFF8D6E63),
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
