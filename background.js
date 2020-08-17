// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// To make sure we can uniquely identify each screenshot tab, add an id as a
// query param to the url that displays the screenshot.
// Note: It's OK that this is a global variable (and not in localStorage),
// because the event page will stay open as long as any screenshot tabs are
// open.
// Listen for a click on the camera icon. On that click, take a screenshot.

var id = 100;
var targetId = null;

// Listen for a click on the camera icon. On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.captureVisibleTab(function (screenshotUrl) {
		// const imageArray = dataTransformUtil.convertDataURIToBinary(screenshotUrl);
		// console.log(imageArray);
		// console.log(imageArray.length);
		qrcode.callback = qrcodeCallback;
		qrcode.decode(screenshotUrl);

		chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
			// We are waiting for the tab we opened to finish loading.
			// Check that the tab's id matches the tab we opened,
			// and that the tab is done loading.
			if (tabId != targetId || changedProps.status != "complete") return;
			// Passing the above test means this is the event we were waiting for.
			// There is nothing we need to do for future onUpdated events, so we
			// use removeListner to stop getting called when onUpdated events fire.
			chrome.tabs.onUpdated.removeListener(listener);
		});
	});
});

function qrcodeCallback(data) {
	if (validURL(data)) {
		// open it in new tab
		chrome.tabs.create({ url: data }, function (tab) {
			targetId = tab.id;
		});
	} else {
		alert("抱歉，未能识别出二维码，请将页面放大至二维码居中且清晰可见～");
	}
}

function validURL(str) {
	try {
		return Boolean(new URL(str));
	} catch (e) {
		return false;
	}
}
