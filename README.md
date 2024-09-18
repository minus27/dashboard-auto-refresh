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

## Operation
By default, the auto-refresh capability is configured to operate on these pages:
* https://<area>dashboard.signalsciences.net/corps/`CORP_NAME`/sites/`SITE_NAME`/dashboards
* https://<area>dashboard.signalsciences.net/corps/`CORP_NAME`/sites/`SITE_NAME`/requests

Additional pages can be added and the CSS-based location where the `Auto-Refresh (#s)` button is added can be modified.
### Activation
To activate the auto-refresh capability capability, first decide on an auto-refresh interval in seconds

* the auto-refresh interval must be greater than or equal to `10`
* at any time, a new auto-refresh interval can be set using the steps below

**Note: For these instructions, a refresh interval of `30` seconds is assumed.**

1. If not already logged in, login to the [Fastly Next-Gen WAF Dashboard](https://dashboard.signalsciences.net/)
1. Browse to one of the pages that the auto-refresh capability is configured operate on
1. Append a `refresh=30` query string parameter to the URL in the address / location bar
    * if the URL does not have a query string, a `?` must be first added, i.e. `?refresh=30`
    * if the URL already has a query string, a `&` must be first added, i.e. `&refresh=30`
1. Hit the return / enter key
    * if everything works correctly, the `Auto-Refresh (30s)` button will appear near the top of the content area of the page
    * if the button is green, the auto-refresh is enabled and the page will refresh in approximately `30` seconds
    * if the button is red, the auto-refresh is disabled
1. Click the `Auto-Refresh (30s)` button to toggle the status of the capability
    * if the button is green, clicking it will disable the auto-refresh capability
    * if the button is red, clicking it will enable the auto-refresh capability


### Deactivation
To deactivate the auto-refresh capability capability, an auto-refresh interval of `0` seconds is used

1. If not already logged in, login to the [Fastly Next-Gen WAF Dashboard](https://dashboard.signalsciences.net/)
1. Browse to one of the pages that the auto-refresh capability is configured operate on
1. Append a `refresh=0` query string parameter to the URL in the address / location bar
    * if the URL does not have a query string, a `?` must be first added, i.e. `?refresh=0`
    * if the URL already has a query string, a `&` must be first added, i.e. `&refresh=0`
1. Hit the return / enter key
    * if everything works correctly, the `Auto-Refresh (30s)` button will disappear

## Advanced

### Configuration
**TBD**
