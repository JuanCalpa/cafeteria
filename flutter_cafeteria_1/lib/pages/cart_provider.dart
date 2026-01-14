import 'package:flutter/material.dart';
import 'cart_model.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _cartItems = [];

  List<CartItem> get cartItems => _cartItems;

  double get totalPrice {
    return _cartItems.fold(
        0, (total, item) => total + (item.price * item.quantity));
  }

  int get totalItems {
    return _cartItems.fold(0, (total, item) => total + item.quantity);
  }

  void addToCart(CartItem newItem) {
    final existingIndex = _cartItems.indexWhere(
      (item) => item.name == newItem.name,
    );

    if (existingIndex != -1) {
      _cartItems[existingIndex].quantity += 1;
    } else {
      _cartItems.add(newItem);
    }
    notifyListeners();
  }

  void removeFromCart(int index) {
    _cartItems.removeAt(index);
    notifyListeners();
  }

  void updateQuantity(int index, int newQuantity) {
    if (newQuantity > 0) {
      _cartItems[index].quantity = newQuantity;
    } else {
      _cartItems.removeAt(index);
    }
    notifyListeners();
  }

  void updateSpecifications(int index, String specifications) {
    _cartItems[index].specifications = specifications;
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    notifyListeners();
  }

  bool get isCartEmpty => _cartItems.isEmpty;
}
