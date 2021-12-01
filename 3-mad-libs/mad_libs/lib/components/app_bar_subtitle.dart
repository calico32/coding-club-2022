import 'package:flutter/material.dart';

class AppBarSubtitle extends StatelessWidget {
  final Widget? left;
  final Widget? right;

  const AppBarSubtitle({
    Key? key,
    this.left,
    this.right,
  }) : super(key: key);

  // Widget _leftWidget(Widget? left) {
  //   if (left is Text) {
  //     return left
  //       ..style!.color = Theme.of(context).colorScheme.onPrimary
  //       ..style.fontSize = 24
  //       ..style.fontWeight = FontWeight.w600;
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Flex(direction: Axis.horizontal, children: [
      Expanded(
        child: Container(
          decoration: const BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: Color(0xa0000000),
                blurRadius: 8,
                offset: Offset(0, 0),
              )
            ],
          ),
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 8,
            ),
            color: Theme.of(context).colorScheme.primaryVariant,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Flexible(
                  flex: 1,
                  child: DefaultTextStyle(
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                    child: left ?? Container(),
                  ),
                ),
                if (right != null)
                  Flexible(
                    flex: 0,
                    child: DefaultTextStyle(
                      style: TextStyle(
                        color: Theme.of(context)
                            .colorScheme
                            .onPrimary
                            .withOpacity(0.9),
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                      child: right ?? Container(),
                    ),
                  )
              ],
            ),
          ),
        ),
      ),
    ]);
  }
}
