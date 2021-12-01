import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'generated/stories.dart';
import 'pages/story_edit.dart';
import 'pages/story_final.dart';
import 'pages/story_select.dart';
import 'story.dart';

dynamic _parseStory(String data) {
  Map<String, dynamic>? parsed = json.decode(
    utf8.decode(base64Url.decode(data)),
  );

  if (parsed == null) {
    return null;
  }

  if (parsed is List<dynamic>) {
    return null;
  }

  int? id = parsed['id'];
  List<dynamic>? words = parsed['words'];

  if (id == null || id < 0 || id >= stories.length) {
    return null;
  }

  if (words == null || words.isEmpty) {
    return stories[id];
  }

  var story = stories[id].toEditable();
  for (int i = 0; i < words.length; i++) {
    story.fillNext(value: words[i]);
  }
  return story;
}

Future<void> _showInvalidSnackBar(BuildContext context) async {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Invalid link.')),
  );
}

Future<void> handleInvalidLink(BuildContext context) async {
  _showInvalidSnackBar(context);

  await Navigator.pushReplacement(
    context,
    CupertinoPageRoute(
      builder: (context) {
        return const StorySelectPage();
      },
    ),
  );
}

void handleLink(BuildContext context, Uri? uri) {
  if (uri == null) {
    return;
  }

  if (uri.host.contains('page.link')) {
    // firebase handles these links, so we don't need to
    return;
  }

  var data = uri.queryParameters['data'];

  if (data == null || data.isEmpty) {
    handleInvalidLink(context);
    return;
  }

  var story = _parseStory(data);
  if (story == null) {
    handleInvalidLink(context);
    return;
  }

  if (story is Story) {
    Navigator.push(
      context,
      CupertinoPageRoute(
        fullscreenDialog: true,
        builder: (context) => StoryEditPage(story: story),
      ),
    );
  } else if (story is EditableStory) {
    Navigator.push(
      context,
      CupertinoPageRoute(
        fullscreenDialog: true,
        builder: (context) => StoryFinalPage(story: story),
      ),
    );
  } else {
    handleInvalidLink(context);
  }
}
