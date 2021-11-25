import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'components/app_bar_subtitle.dart';
import 'stories/index.dart';
import 'stories/text.dart';
import 'story_edit.dart';

class StorySelectPage extends StatefulWidget {
  const StorySelectPage({Key? key}) : super(key: key);

  @override
  State<StorySelectPage> createState() => _StorySelectPageState();
}

class _StorySelectPageState extends State<StorySelectPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mad Libs"),
      ),
      body: Column(children: [
        const AppBarSubtitle(text: "Stories"),
        Expanded(
          child: ListView.builder(
            itemCount: stories.length,
            itemBuilder: (context, index) => ListTile(
              tileColor: index % 2 == 0 ? Colors.white : Colors.grey.shade100,
              title: Text(stories[index].title),
              subtitle: Text(
                '${stories[index].text.whereType<StoryPlaceholder>().length} blanks',
              ),
              leading: const Icon(Icons.text_snippet),
              enabled: true,
              enableFeedback: true,
              onTap: () {
                Navigator.of(context).push(
                  CupertinoPageRoute(
                    builder: (context) => StoryPage(story: stories[index]),
                  ),
                );
              },
            ),
          ),
        ),
      ]),
    );
  }
}
