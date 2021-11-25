import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'components/app_bar_subtitle.dart';
import 'stories/story.dart';
import 'stories/text.dart';
import 'story_final.dart';

class StoryPage extends StatefulWidget {
  const StoryPage({Key? key, required this.story}) : super(key: key);

  final Story story;

  @override
  _StoryPageState createState() => _StoryPageState();
}

class _StoryPageState extends State<StoryPage> {
  final _formKey = GlobalKey<FormState>();
  late final List<TextEditingController> _fieldControllers;
  late final List<StoryPlaceholder> _placeholders;

  @override
  initState() {
    super.initState();
    _placeholders = widget.story.text.whereType<StoryPlaceholder>().toList();
    _fieldControllers = [
      for (var i = 0; i < _placeholders.length; i++) TextEditingController()
    ];
  }

  Widget _buildPlaceholder(int index) {
    var placeholder = _placeholders[index];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: TextFormField(
        controller: _fieldControllers[index],
        key: Key(
          '${placeholder.wordType.toString()}_${placeholder.index.toString()}',
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter a value';
          }
          return null;
        },
        autovalidateMode: AutovalidateMode.onUserInteraction,
        decoration: InputDecoration(
          border: const OutlineInputBorder(),
          labelText: '${placeholder.label} #${placeholder.index + 1}',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Story'), titleSpacing: 0),
      body: Column(children: [
        AppBarSubtitle(text: widget.story.title),
        Expanded(
          child: Form(
            key: _formKey,
            child: ListView(children: [
              Padding(
                padding: const EdgeInsets.all(8).copyWith(top: 16, left: 16),
                child: Text(
                  "Blanks",
                  style: Theme.of(context).textTheme.headline5,
                ),
              ),
              for (var i = 0; i < _placeholders.length; i++)
                _buildPlaceholder(i),
              Padding(
                padding: const EdgeInsets.all(16).copyWith(top: 0),
                child: ElevatedButton(
                  child: const Text('Submit'),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      var editable = widget.story.toEditable();

                      for (var i = 0; i < _placeholders.length; i++) {
                        var placeholder = _placeholders[i];
                        // ignore: avoid_print
                        editable.fillIndex(
                          type: placeholder.wordType,
                          index: placeholder.index,
                          value: _fieldControllers[i].text,
                        );
                      }

                      Navigator.of(context).push(
                        CupertinoPageRoute(
                          builder: (context) => FinalStoryPage(story: editable),
                        ),
                      );
                    }
                  },
                ),
              ),
            ]),
          ),
        ),
      ]),
    );
  }
}
