import 'package:flutter/material.dart';

class CartItem {
  final String name;
  final double price;
  final IconData icon;
  int quantity;

  CartItem({
    required this.name,
    required this.price,
    required this.icon,
    this.quantity = 1,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'price': price,
      'icon': icon.codePoint,
      'quantity': quantity,
    };
  }

  factory CartItem.fromMap(Map<String, dynamic> map) {
    return CartItem(
      name: map['name'],
      price: map['price'],
      icon: IconData(map['icon'], fontFamily: 'MaterialIcons'),
      quantity: map['quantity'],
    );
  }
}
