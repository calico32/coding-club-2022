import 'package:flutter/material.dart';

import 'text.dart';

mixin _CanOutputText {
  List<StoryTextComponent> _text = [];
  String get plainText {
    var output = "";
    for (var component in _text) {
      if (component is StoryPlaceholder) {
        var type = component.wordType.toString().split(".")[1];
        var count = component.index + 1;
        var label = component.label;
        if (label == defaultLabels[component.wordType]) {
          output += "<$type.$count>";
        } else {
          output += "<$type.$count.$label>";
        }
      } else if (component is Literal) {
        output += component.text;
      } else {
        throw Exception("Unknown text type");
      }
    }
    return output;
  }

  Widget richText(BuildContext context) {
    TextStyle bold = const TextStyle(fontWeight: FontWeight.bold);

    return SelectableText.rich(TextSpan(
      style: Theme.of(context).textTheme.bodyText1,
      children: _text.map((component) {
        if (component is StoryPlaceholder) {
          var type = component.wordType.toString().split(".")[1];
          var count = component.index + 1;
          var label = component.label;
          if (label == defaultLabels[component.wordType]) {
            return TextSpan(text: "<$type.$count>", style: bold);
          } else {
            return TextSpan(text: "<$type.$count.$label>", style: bold);
          }
        } else if (component is Literal) {
          return TextSpan(
            text: component.text,
            style: component.replaced ? bold : null,
          );
        } else {
          throw Exception("Unknown text type");
        }
      }).toList(),
    ));
  }
}

class StoryBuilder {
  final String title;
  final List<StoryTextComponent> _text = [];
  final Map<WordType, int> _counters = {};

  StoryBuilder({required this.title}) {
    for (var word in WordType.values) {
      _counters[word] = 0;
    }
  }

  // StoryBuilder t(String text) => this.text(text);
  // StoryBuilder w(WordType type, [String? label]) => word(type, label);

  StoryBuilder text(String text) {
    _text.add(Literal(text));
    return this;
  }

  StoryBuilder word(WordType type, [String? label]) {
    if (_counters[type] == null) {
      throw StateError("WordType missing from counters");
    }

    var index = _counters[type]!;
    _counters[type] = index + 1;

    var word = type.toString().split(".")[1];

    label = label ?? defaultLabels[type] ?? word;

    if (label.contains(">")) {
      throw ArgumentError("Label cannot contain '>'");
    }

    _text.add(StoryPlaceholder(wordType: type, label: label, index: index));
    return this;
  }

  Story pack() {
    return Story(title: title, text: List.from(_text, growable: false));
  }
}

class Story with _CanOutputText {
  final String title;

  Story({required this.title, required List<StoryTextComponent> text}) {
    _text = text;
  }

  List<StoryTextComponent> get text => _text;

  EditableStory toEditable() {
    return EditableStory(title: title, text: List.from(_text, growable: false));
  }
}

class EditableStory with _CanOutputText {
  final String title;

  EditableStory({required this.title, required List<StoryTextComponent> text}) {
    _text = text;
  }

  /// Returns true if any placeholder was replaced
  bool fill({required WordType type, required String value}) {
    for (var i = 0; i < _text.length; i++) {
      var component = _text[i];
      if (component is StoryPlaceholder && component.wordType == type) {
        _text[i] = Literal(value, replaced: true);
        return true;
      }
    }
    return false;
  }

  /// Returns true if any placeholder was replaced
  bool fillIndex({
    required WordType type,
    required int index,
    required String value,
  }) {
    for (var i = 0; i < _text.length; i++) {
      var component = _text[i];
      if (component is StoryPlaceholder &&
          component.index == index &&
          component.wordType == type) {
        _text[i] = Literal(value, replaced: true);
        return true;
      }
    }
    return false;
  }

  get completed => _text.every((component) => component is Literal);
}
