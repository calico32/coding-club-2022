enum TextType { literal, placeholder, copy }
enum WordType {
  adjective,
  adverb,
  noun,
  number,
  pluralNoun,
  verbIng,
  verbPast,
  name,
  verb,
  superlative,
  preposition,
  other,
}

const Map<WordType, String> defaultLabels = {
  WordType.adjective: "adjective",
  WordType.adverb: "adverb",
  WordType.noun: "noun",
  WordType.number: "number",
  WordType.pluralNoun: "plural noun",
  WordType.verbIng: "verb (-ing)",
  WordType.verbPast: "verb (past)",
  WordType.name: "name",
  WordType.verb: "verb",
  WordType.superlative: "superlative (fastest, youngest, etc.)",
  WordType.preposition: "preposition (under, over, etc.)",
};

class StoryTextComponent {
  final TextType _type;

  StoryTextComponent({required TextType type}) : _type = type;

  get type => _type;
}

class StoryPlaceholder extends StoryTextComponent {
  final WordType wordType;
  late final String label;
  final int index;

  StoryPlaceholder({
    String? label,
    required this.wordType,
    required this.index,
  }) : super(type: TextType.placeholder) {
    this.label =
        label ?? defaultLabels[wordType] ?? wordType.toString().split('.')[1];
  }
}

class Literal extends StoryTextComponent {
  final String text;
  final bool replaced;
  Literal(this.text, {this.replaced = false}) : super(type: TextType.literal);
}

class WordCopy extends StoryTextComponent {
  final int delta;
  WordCopy({required this.delta})
      : assert(delta != 0, "Delta cannot be 0"),
        super(type: TextType.copy);
}
