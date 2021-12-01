import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';

import '../components/app_bar_subtitle.dart';
import '../generated/stories.dart';
import '../link.dart';
import '../platform/platform.dart';
import '../story.dart';
import 'story_edit.dart';

class StoryFinalPage extends StatefulWidget {
  final EditableStory story;

  const StoryFinalPage({Key? key, required this.story}) : super(key: key);

  @override
  State<StoryFinalPage> createState() => _StoryFinalPageState();
}

class _StoryFinalPageState extends State<StoryFinalPage> {
  Future<Uri?> _getShareLink() {
    return shareLink(widget.story.id, widget.story.text);
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
    return FutureBuilder(
      future: _getShareLink(),
      builder: (context, snapshot) {
        final link = snapshot.data as Uri?;
        return Scaffold(
          appBar: AppBar(
            title: Navigator.of(context).canPop()
                ? const Text('Final Story')
                : const Text('Story'),
            titleSpacing: Navigator.of(context).canPop() ? 0 : null,
            actions: [
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () {
                  Navigator.of(context).push(
                    CupertinoPageRoute(
                      builder: (context) => StoryEditPage(
                        story: stories[widget.story.id],
                        words: widget.story.words,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          body: snapshot.connectionState == ConnectionState.done
              ? Column(children: [
                  AppBarSubtitle(left: Text(widget.story.title)),
                  Expanded(
                    child: ListView(children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: widget.story.richText(context),
                      ),
                      if (link != null)
                        Row(children: [
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: ElevatedButton.icon(
                              icon: Icon(isWeb ? Icons.copy : Icons.share),
                              label: Text(isWeb ? "Copy link" : "Share"),
                              onPressed: () => _shareAction(link),
                            ),
                          ),
                        ]),
                    ]),
                  ),
                ])
              : const Center(child: CircularProgressIndicator()),
        );
      },
    );
  }
}
