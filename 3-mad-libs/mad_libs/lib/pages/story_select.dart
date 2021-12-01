import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../components/app_bar_subtitle.dart';
import '../components/random_button.dart';
import '../generated/stories.dart';
import '../story.dart';
import '../text.dart';
import 'story_edit.dart';

enum StorySort {
  idAscending,
  idDescending,
  titleAscending,
  titleDescending,
  blanksAscending,
  blanksDescending,
  random,
}

class StorySelectPage extends StatefulWidget {
  const StorySelectPage({Key? key}) : super(key: key);

  @override
  State<StorySelectPage> createState() => _StorySelectPageState();
}

class _StorySelectPageState extends State<StorySelectPage> {
  StorySort _sort = StorySort.idAscending;

  DropdownMenuItem<StorySort> _item(StorySort sort, String label) {
    return DropdownMenuItem(
      child: Text(
        label,
        style: TextStyle(
          color: Theme.of(context).colorScheme.onPrimary,
        ),
      ),
      value: sort,
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Story> sortedStories = stories.toList();
    if (_sort == StorySort.idAscending) {
      sortedStories.sort((a, b) => a.id.compareTo(b.id));
    } else if (_sort == StorySort.idDescending) {
      sortedStories.sort((a, b) => b.id.compareTo(a.id));
    } else if (_sort == StorySort.titleAscending) {
      sortedStories.sort(
          (a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
    } else if (_sort == StorySort.titleDescending) {
      sortedStories.sort(
          (a, b) => b.title.toLowerCase().compareTo(a.title.toLowerCase()));
    } else if (_sort == StorySort.blanksAscending) {
      sortedStories.sort(
        (a, b) => a.placeholders.length.compareTo(b.placeholders.length),
      );
    } else if (_sort == StorySort.blanksDescending) {
      sortedStories.sort(
        (a, b) => b.placeholders.length.compareTo(a.placeholders.length),
      );
    } else if (_sort == StorySort.random) {
      sortedStories.shuffle();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mad Libs"),
      ),
      floatingActionButton: randomButton(context),
      body: Column(children: [
        AppBarSubtitle(
          left: const Text("Stories"),
          right: DropdownButton(
            isDense: true,
            underline: Container(
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    width: 0,
                    color: Colors.grey.shade300,
                  ),
                ),
              ),
            ),
            value: _sort,
            iconEnabledColor: Theme.of(context).colorScheme.onPrimary,
            dropdownColor: Colors.grey.shade900,
            items: [
              _item(StorySort.idAscending, "Story ID (ascending)"),
              _item(StorySort.idDescending, "Story ID (descending)"),
              _item(StorySort.titleAscending, "Title (ascending)"),
              _item(StorySort.titleDescending, "Title (descending)"),
              _item(StorySort.blanksAscending, "# of blanks (ascending)"),
              _item(StorySort.blanksDescending, "# of blanks (descending)"),
              _item(StorySort.random, "Random"),
            ],
            onChanged: (value) {
              setState(() {
                _sort = value as StorySort;
              });
            },
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: sortedStories.length,
            itemBuilder: (context, index) => ListTile(
              tileColor: index % 2 == 0 ? Colors.white : Colors.grey.shade100,
              title: Text(sortedStories[index].title),
              subtitle: Text(
                '${sortedStories[index].text.whereType<StoryPlaceholder>().length} blanks',
              ),
              leading: const Icon(Icons.text_snippet),
              trailing: Text(
                '#${sortedStories[index].id}',
                style: TextStyle(
                  color: Colors.grey.shade700,
                  fontSize: 14,
                  fontWeight: FontWeight.normal,
                ),
              ),
              enabled: true,
              enableFeedback: true,
              onTap: () {
                Navigator.of(context).push(
                  CupertinoPageRoute(
                    maintainState: true,
                    builder: (context) => StoryEditPage(
                      story: sortedStories[index],
                    ),
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
