browser.browserAction.setBadgeText({text:"Testing setBadgeText"});

browser.browserAction.setBadgeBackgroundColor({ color: [127, 127, 127, 127] });
browser.browserAction.getBadgeText({}, function (details) {
  console.log(details);
});
console.log(browser.browserAction.getBadgeBackgroundColor({}, function (result) {
  console.log(result);
}));

