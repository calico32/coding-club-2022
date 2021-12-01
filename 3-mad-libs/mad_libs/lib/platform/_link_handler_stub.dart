import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:uni_links/uni_links.dart';

import '../util.dart';
import 'platform.dart';

class LinkHandler extends StatefulWidget {
  final Widget child;

  const LinkHandler({Key? key, required this.child}) : super(key: key);

  @override
  LinkHandlerState createState() => LinkHandlerState();
}

class LinkHandlerState extends State<LinkHandler> {
  StreamSubscription<Uri?>? _uniSub;

  Future<void> _initUniLinks() async {
    final Uri? link = await getInitialUri();

    if (link != null) {
      if (link.host.contains('page.link')) {
        // firebase handles these links, so we don't need to
        return;
      }

      handleLink(context, link);
    }

    if (!isWeb) {
      _uniSub = uriLinkStream.listen((Uri? link) {
        if (link != null) {
          if (link.host.contains('page.link')) {
            return;
          }

          handleLink(context, link);
        }
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _initUniLinks();
  }

  @override
  void dispose() {
    _uniSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
