# dashboard-auto-refresh

## Overview
This is a [Tampermonkey](https://tampermonkey.net/) script for Google Chrome that adds an auto-refresh capability to selected pages in the [Fastly Next-Gen WAF Dashboard](https://dashboard.signalsciences.net/).
This script *should* work in [Greasemonkey](https://www.greasespot.net/), which is essentially Tampermonkey for other browsers, but it has not been tested, i.e. your mileage may vary.

---
**Note: Never run a Tampermonkey/Greasemonkey script (including mine), or otherwise paste JavaScript code into your browser's address/location bar or Console, without first seeing what it is doing**


## Installation
1. If it is not installed already, install the **Tampermonkey Addon to Chrome** by doing the following:
    * Browse to the [Chrome Web Store](https://chromewebstore.google.com/) using Chrome
    * Search extensions and themes for `tampermonkey`
    * Select the result from **tampermonkey.net**, which is most likely the top result
    * Click the **Add to Chrome** button
2. Go to the [JavaScript file for this project](https://github.com/minus27/dashboard-auto-refresh/blob/master/SigSci-Dashboard-Auto-Refresh.user.js)
3. Click on the **Raw** button
4. If Tampermonkey is installed and enabled, it will recognize the UserScript and ask you to (re-)install it by clicking the **Install** button
5. Follow Tampermonkey's instructions...
