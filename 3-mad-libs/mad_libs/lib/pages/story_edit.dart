import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';

import '../components/app_bar_subtitle.dart';
import '../components/random_button.dart';
import '../link.dart';
import '../platform/platform.dart';
import '../story.dart';
import '../text.dart';
import 'story_final.dart';

class StoryEditPage extends StatefulWidget {
  final Story story;
  final bool showRandomButton;
  final List<String>? words;

  const StoryEditPage({
    Key? key,
    required this.story,
    this.words,
    this.showRandomButton = false,
  }) : super(key: key);

  @override
  _StoryEditPageState createState() => _StoryEditPageState();
}

class _StoryEditPageState extends State<StoryEditPage> {
  final _formKey = GlobalKey<FormState>();
  late final List<TextEditingController> _fieldControllers;
  late final List<StoryPlaceholder> _placeholders;
  Uri? _shareLink;

  Future<Uri?> _getShareLink() {
    return shareLink(widget.story.id);
  }

  @override
  void initState() {
    super.initState();
    _getShareLink().then((value) => setState(() => _shareLink = value));
    _placeholders = widget.story.text.whereType<StoryPlaceholder>().toList();
    _fieldControllers = [
      for (var i = 0; i < _placeholders.length; i++)
        TextEditingController(
          text: widget.words != null && i < widget.words!.length
              ? widget.words![i]
              : null,
        )
    ];
  }

  Widget _buildPlaceholder(int index) {
    var placeholder = _placeholders[index];
    String label;
    if (placeholder.wordType == WordType.other) {
      label = placeholder.label;
    } else {
      label = '${placeholder.label} #${placeholder.index + 1}';
    }

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
          label: Text('${index + 1}. $label'),
        ),
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      var editable = widget.story.toEditable();

      for (var i = 0; i < _placeholders.length; i++) {
        var placeholder = _placeholders[i];
        editable.fillType(
          type: placeholder.wordType,
          value: _fieldControllers[i].text,
        );
      }

      Navigator.of(context).push(
        CupertinoPageRoute(
          maintainState: true,
          builder: (context) => StoryFinalPage(story: editable),
        ),
      );
    }
  }

  void _shareAction(Uri link) {
    if (isWeb) {
      var text = link.toString();
      Clipboard.setData(ClipboardData(text: text));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Link copied!")),
      );
    } else {
      Share.share(link.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Story'),
        titleSpacing: Navigator.of(context).canPop() ? 0 : null,
        actions: [
          if (_shareLink != null)
            IconButton(
              icon: Icon(isWeb ? Icons.copy : Icons.share),
              onPressed: () => _shareAction(_shareLink!),
            ),
        ],
      ),
      floatingActionButton:
          widget.showRandomButton ? randomButton(context, replace: true) : null,
      body: Column(children: [
        AppBarSubtitle(
          left: Text(widget.story.title),
          right: Text('#${widget.story.id}'),
        ),
        Expanded(
          child: Form(
            key: _formKey,
            child: ListView(children: [
              Padding(
                padding: const EdgeInsets.all(8).copyWith(top: 16, left: 16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      "Blanks",
                      style: Theme.of(context).textTheme.headline5,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        '(${_placeholders.length})',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey.shade800,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              for (var i = 0; i < _placeholders.length; i++)
                _buildPlaceholder(i),
              Padding(
                padding: const EdgeInsets.all(16).copyWith(top: 8),
                child: ElevatedButton(
                  child: const Text('Submit'),
                  onPressed: _submitForm,
                ),
              ),
            ]),
          ),
        ),
      ]),
    );
  }
}
