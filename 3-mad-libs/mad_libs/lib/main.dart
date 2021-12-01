import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'pages/story_select.dart';
import 'platform/link_handler.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MadLibsApp());
}

class MadLibsApp extends StatelessWidget {
  const MadLibsApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mad Libs',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.purple,
        colorScheme: ColorScheme.fromSwatch(
          brightness: Brightness.light,
          primarySwatch: Colors.purple,
          primaryColorDark: Colors.purple.shade600,
          accentColor: Colors.purpleAccent.shade100,
        ),
        fontFamily: "Inter",
        appBarTheme: AppBarTheme(
          toolbarHeight: 45,
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Theme.of(context).colorScheme.onPrimary,
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      home: const LinkHandler(child: StorySelectPage()),
    );
  }
}
