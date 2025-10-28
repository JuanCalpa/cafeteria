class Category {
  final String name;
  final String? icon;
  final String? color;

  Category({
    required this.name,
    this.icon,
    this.color,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      name: json['name'] ?? '',
      icon: json['icon'],
      color: json['color'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'icon': icon,
      'color': color,
    };
  }
}

class Product {
  final int id;
  final String name;
  final double price;
  final String? description;
  final String category;
  final String? icon;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.description,
    required this.category,
    this.icon,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      price: (json['price'] ?? json['precio'] ?? 0).toDouble(),
      description: json['description'],
      category: json['category'] ?? '',
      icon: json['icon'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'description': description,
      'category': category,
      'icon': icon,
    };
  }
}
