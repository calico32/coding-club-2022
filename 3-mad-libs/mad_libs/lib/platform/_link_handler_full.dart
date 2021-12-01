import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:flutter/material.dart';

import '../util.dart';
import '_link_handler_stub.dart' as stub;
import 'platform.dart';

class LinkHandler extends stub.LinkHandler {
  const LinkHandler({
    Key? key,
    required Widget child,
  }) : super(key: key, child: child);

  @override
  LinkHandlerState createState() => LinkHandlerState();
}

class LinkHandlerState extends stub.LinkHandlerState {
  Future<void> _initDynamicLinks() async {
    if (!isAndroid && !isIOS) {
      return;
    }

    FirebaseDynamicLinks.instance.onLink(
      onSuccess: (PendingDynamicLinkData? dynamicLink) async {
        final Uri? deepLink = dynamicLink?.link;

        if (deepLink != null) {
          handleLink(context, deepLink);
        }
      },
      onError: (OnLinkErrorException e) async {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message ?? "An unknown error occured.")),
        );
      },
    );

    final PendingDynamicLinkData? data =
        await FirebaseDynamicLinks.instance.getInitialLink();

    final Uri? deepLink = data?.link;

    if (deepLink != null) {
      handleLink(context, deepLink);
    }
  }

  @override
  void initState() {
    super.initState();
    _initDynamicLinks();
  }
}
