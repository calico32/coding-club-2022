import 'package:flutter/material.dart';

import 'components/app_bar_subtitle.dart';
import 'stories/story.dart';

class FinalStoryPage extends StatelessWidget {
  final EditableStory story;

  const FinalStoryPage({Key? key, required this.story}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Final Story'), titleSpacing: 0),
      body: Column(children: [
        AppBarSubtitle(text: story.title),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: story.richText(context),
          ),
        ),
      ]),
    );
  }
}
