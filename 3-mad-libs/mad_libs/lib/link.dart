import 'dart:convert';

import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';

import 'platform/platform.dart';
import 'text.dart';

Future<Uri?> shareLink(
  int storyId, [
  List<StoryTextComponent>? words,
]) async {
  if (!isAndroid && !isIOS && !isWeb) {
    return null;
  }

  Map<String, dynamic> data = {
    "id": storyId,
    "words": words
        ?.where((e) => e is Literal && e.replaced)
        .map((e) => (e as Literal).text)
        .toList(),
  };

  var b64 = base64Url.encode(utf8.encode(json.encode(data)));

  final link = Uri.parse('https://madlibs.wiisportsresorts.dev/?data=$b64');

  if (isWeb) {
    return link;
  }

  var parameters = DynamicLinkParameters(
    uriPrefix: 'https://madlibs.page.link',
    link: link,
    androidParameters: AndroidParameters(
      packageName: 'dev.wiisportsresorts.mad_libs',
      minimumVersion: 1,
    ),
    iosParameters: IosParameters(
      bundleId: 'dev.wiisportsresorts.madLibs',
      minimumVersion: '1.0.0',
      //
      // appStoreId: '123456789',
    ),
    // googleAnalyticsParameters: GoogleAnalyticsParameters(
    //   campaign: 'example-promo',
    //   medium: 'social',
    //   source: 'orkut',
    // ),
    // itunesConnectAnalyticsParameters: ItunesConnectAnalyticsParameters(
    //   providerToken: '123456',
    //   campaignToken: 'example-promo',
    // ),
    socialMetaTagParameters: SocialMetaTagParameters(
      title: 'Mad Libs: Story #$storyId',
      description: 'Mad Libs Flutter app',
    ),
  );

  final shortLink = await parameters.buildShortLink();
  return shortLink.shortUrl;
}
