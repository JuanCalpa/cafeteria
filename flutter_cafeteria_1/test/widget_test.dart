import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_cafeteria_1/main.dart';

void main() {
  testWidgets('App starts with LoginPage', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that the LoginPage is displayed (check for 'Email' label)
    expect(find.text('Email'), findsOneWidget);
  });
}
