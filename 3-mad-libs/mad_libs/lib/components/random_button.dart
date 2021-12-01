import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../generated/stories.dart';
import '../pages/story_edit.dart';

Widget randomButton(BuildContext context, {bool replace = false}) {
  return FloatingActionButton.extended(
    onPressed: () {
      var random = Random(DateTime.now().microsecondsSinceEpoch);
      final story = stories[random.nextInt(stories.length)];
      final route = CupertinoPageRoute(
        fullscreenDialog: true,
        builder: (context) => StoryEditPage(
          story: story,
          showRandomButton: true,
        ),
      );

      if (replace) {
        Navigator.of(context).pushReplacement(route);
      } else {
        Navigator.of(context).push(route);
      }
    },
    label: const Text("RANDOM", style: TextStyle(letterSpacing: 2)),
    icon: const Icon(Icons.shuffle),
  );
}
