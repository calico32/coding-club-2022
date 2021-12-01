import 'package:flutter/material.dart';

import 'extensions/map_with_index.dart';
import 'text.dart';

TextStyle _bold = const TextStyle(fontWeight: FontWeight.bold);

mixin _CanOutputText {
  List<StoryTextComponent> _text = [];

  List<StoryTextComponent> get text => _text;

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

  TextSpan _getTextSpan(int index) {
    var component = _text[index];
    if (component is StoryPlaceholder) {
      var type = component.wordType.toString().split(".")[1];
      var count = component.index + 1;
      var label = component.label;
      if (label == defaultLabels[component.wordType]) {
        return TextSpan(text: "<$type.$count>", style: _bold);
      } else {
        return TextSpan(text: "<$type.$count.$label>", style: _bold);
      }
    } else if (component is Literal) {
      return TextSpan(
        text: component.text,
        style: component.replaced ? _bold : null,
      );
    } else if (component is WordCopy) {
      var delta = component.delta;

      var newIndex = index;

      while (delta.abs() != 0) {
        newIndex += delta.sign;
        if (newIndex == -1 || newIndex == _text.length) {
          newIndex -= delta.sign;
          break;
        }
        var component = _text[newIndex];
        if ((component is Literal && component.replaced) ||
            component is WordCopy) {
          delta -= delta.sign;
        }
      }

      return _getTextSpan(newIndex);
    } else {
      throw Exception("Unknown text type");
    }
  }

  Widget richText(BuildContext context) {
    return SelectableText.rich(TextSpan(
      style: Theme.of(context).textTheme.bodyText2?.copyWith(fontSize: 18),
      children: _text.mapIndex((e, i) => _getTextSpan(i)).toList(),
    ));
  }
}

mixin _CanGetPlaceholders on _CanOutputText {
  List<StoryPlaceholder> get placeholders {
    return _text.whereType<StoryPlaceholder>().toList();
  }
}

class StoryBuilder {
  final List<StoryTextComponent> _text = [];
  final Map<WordType, int> _counters = {};
  String? _title;
  int? _id;

  StoryBuilder() {
    for (var word in WordType.values) {
      _counters[word] = 0;
    }
  }

  StoryBuilder title(String title) {
    _title = title;
    return this;
  }

  StoryBuilder id(int id) {
    _id = id;
    return this;
  }

  // StoryBuilder t(String text) => this.text(text);
  // StoryBuilder w(WordType type, [String? label]) => word(type, label);

  StoryBuilder copy(int delta) {
    _text.add(WordCopy(delta: delta));
    return this;
  }

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
    if (_id == null) {
      throw StateError("Story id not set");
    }

    if (_title == null) {
      throw StateError("Story title not set");
    }

    return Story(
      title: _title!,
      text: List.from(_text, growable: false),
      id: _id!,
    );
  }
}

class Story with _CanOutputText, _CanGetPlaceholders {
  final String title;
  final int id;

  Story({
    required this.title,
    required List<StoryTextComponent> text,
    required this.id,
  }) {
    _text = text;
  }

  EditableStory toEditable() {
    return EditableStory(
      title: title,
      text: List.from(_text, growable: false),
      id: id,
    );
  }
}

class EditableStory with _CanOutputText {
  final String title;
  final int id;
  final List<String> words = [];

  EditableStory({
    required this.title,
    required List<StoryTextComponent> text,
    required this.id,
  }) {
    _text = text;
  }

  /// Returns true if any placeholder was replaced
  bool fillNext({required String value}) {
    for (var i = 0; i < _text.length; i++) {
      if (_text[i] is StoryPlaceholder) {
        _text[i] = Literal(value, replaced: true);
        words.add(value);
        return true;
      }
    }
    return false;
  }

  /// Returns true if any placeholder was replaced
  bool fillType({required WordType type, required String value}) {
    for (var i = 0; i < _text.length; i++) {
      var component = _text[i];
      if (component is StoryPlaceholder && component.wordType == type) {
        _text[i] = Literal(value, replaced: true);
        words.add(value);
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
        words[index] = value;
        return true;
      }
    }
    return false;
  }

  get completed => _text.every((component) => component is Literal);
}
