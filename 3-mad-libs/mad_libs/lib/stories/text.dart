const Map<WordType, String> defaultLabels = {
  WordType.adjective: "Adjective",
  WordType.adverb: "Adverb",
  WordType.noun: "Noun",
  WordType.number: "Number",
  WordType.pluralNoun: "Plural Noun",
  WordType.verbIng: "Verb (-ing)",
  WordType.verbPast: "Verb (past)",
  WordType.name: "Name",
};

enum TextType { literal, placeholder }
enum WordType {
  adjective,
  adverb,
  noun,
  number,
  pluralNoun,
  verbIng,
  verbPast,
  name,
}

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
