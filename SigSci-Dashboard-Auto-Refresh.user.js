// ==UserScript==
// @name         SigSci Dashboard Auto-Refresh
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  Adds an auto-refresh capability to selected pages in the Fastly Next-Gen WAF Dashboard
// @author       Stephen Kiel
// @match        https://dashboard.signalsciences.net/corps/*/sites/*/dashboards*
// @match        https://dashboard.signalsciences.net/corps/*/sites/*/requests*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=signalsciences.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('SigSci Dashboard Auto-Refresh script loaded via Tampermonkey!');

    // Your code here...
    const CONFIG = {
        DEBUG: false,
        UI_SELECTOR: {
            '/corps/*/sites/*/dashboards': 'span:contains("Charts display timeseries data for a given signal")',
            '/corps/*/sites/*/requests': 'span:contains("Search for requests within the last 30 days.")',
        },
        DEFAULT_STATE: { interval: 0, active: false, },
        QS_PARAM_NAME: 'refresh',
        LOCALSTORAGE_ITEM_NAME: 'dashboard-auto-refresh',
        MIN_REFRESH_INTERVAL: 10, // Seconds
        UI_CHECK_INTERVAL: 100, // Milliseconds
    }

    // https://www.30secondsofcode.org/js/s/query-string-to-object/
    const queryStringToObject = url => Object.fromEntries([...new URLSearchParams(url.split('?')[1])]);
    const objectToQueryString = queryParameters => {
        return queryParameters
            ? Object.entries(queryParameters).reduce(
            (queryString, [key, val], index) => {
                const symbol = queryString.length === 0 ? '?' : '&';
                queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
                return queryString;
            },
            ''
        )
        : '';
    };

    // My functions
    function setStoredData(itemName, itemVal) {
        localStorage.setItem(itemName, JSON.stringify(itemVal));
    }

    function getStoredData(DEFAULT_STATE) {
        let STATE;
        try {
            STATE = JSON.parse(localStorage.getItem(CONFIG.LOCALSTORAGE_ITEM_NAME));
            if (Object.keys(STATE).length != Object.keys(DEFAULT_STATE).length) {
                throw new Error(`Bad Key Count: ${Object.keys(DEFAULT_STATE).length} expected, ${Object.keys(STATE).length} found`);
            }
            Object.keys(DEFAULT_STATE).forEach(key => {
                if (!(key in STATE)) {
                    throw new Error(`Missing Key: ${key} expected, but not found`);
                }
            });
            if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: "${CONFIG.LOCALSTORAGE_ITEM_NAME}" item from localStorage parsed`);
        } catch(err) {
            if (CONFIG.DEBUG) console.error(`Dashboard Auto-Refresh: Error parsing "${CONFIG.LOCALSTORAGE_ITEM_NAME}" item from localStorage - "${err.Message}"`);
            STATE = { ...DEFAULT_STATE };
        }
        return STATE;
    }

    function getQueryStringValue(QS_PARAM_NAME) {
        let oQueryString = queryStringToObject(location.href);
        let refreshSeconds = parseInt(oQueryString[QS_PARAM_NAME]);

        if (Number.isNaN(refreshSeconds)) {
            if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: Refresh interval bad or missing`);
            return null;
        }
        return refreshSeconds;
    }

    // My code
    const startTime = Math.trunc(Date.now()/1000);

    let genericPath = location.pathname.split('/').map((t,i) => [2,4].includes(i) ? '*' : t).join('/');
    if (!(genericPath in CONFIG.UI_SELECTOR)) {
        if (CONFIG.DEBUG) console.error(`Dashboard Auto-Refresh: No UI Selector configured for current page`);
        return;
    }

    let STATE = getStoredData( CONFIG.DEFAULT_STATE );

    let refreshSeconds = getQueryStringValue( CONFIG.QS_PARAM_NAME );

    if (refreshSeconds == 0) {
        STATE = {};
    } else {
        if (refreshSeconds == null) {
            refreshSeconds = STATE.interval;
        } else {
            if (refreshSeconds < CONFIG.MIN_REFRESH_INTERVAL) {
                refreshSeconds = STATE.interval;
                if (CONFIG.DEBUG) console.error(`Dashboard Auto-Refresh: Refresh interval (${refreshSeconds}) less than minimum (${CONFIG.MIN_REFRESH_INTERVAL})`);
            } else {
                STATE.interval = refreshSeconds;
            }
        }
    }
    setStoredData(CONFIG.LOCALSTORAGE_ITEM_NAME, STATE);

    if (refreshSeconds == 0) {
        if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: Disabled`);
        return;
    }

    let refreshRequested = STATE.active;

    if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: ${refreshSeconds} second${(refreshSeconds != 1) ? 's' : ''}`);

    const idUiCheck = setInterval(function(){
        let elapsedSeconds = Math.trunc(Date.now()/1000) - startTime;

        let eSpan = $(CONFIG.UI_SELECTOR[genericPath]);
        if (eSpan.length != 1) {
            if (elapsedSeconds < refreshSeconds) {
                return;
            }
            clearInterval(idUiCheck);
            console.error(`Dashboard Auto-Refresh: Issues tweaking UI`);
        }

        clearInterval(idUiCheck);

        if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: Tweaking UI`);

        let buttonColorStyles = [
            '[auto-refresh="enabled"] {background-color:rgb(92, 230, 138)}',
            '[auto-refresh="disabled"] {background-color:rgb(244, 96, 73)}',
            '[auto-refresh="unknown"] {background-color:rgb(255, 197, 36)}',
        ];
        $('head').append(`<style>\n${buttonColorStyles.join('\n')}\n</style>`);

        let autoRefreshButton = {
            options: {
                id:'rr-button',
                text:`Auto-Refresh (${refreshSeconds}s)`,
                'auto-refresh':'unknown',
                style:`display:inline-block;margin-left:1em;font-size:12px;vertical-align:top;cursor:pointer;`
            },
            clickFunction: function() {
                let LOCALSTORAGE_ITEM_NAME = $('.dashboard-auto-refresh.localstorage-item-name').val();
                let STATE = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM_NAME));
                $('#rr-button').attr('auto-refresh',(STATE.active)?'disabled':'enabled');
                STATE.active = !STATE.active;
                localStorage.setItem(LOCALSTORAGE_ITEM_NAME, JSON.stringify(STATE));
            }
        };
        eSpan.parent()
            .append($('<div>',autoRefreshButton.options))
            .append($('<input>',{type:'hidden',class:'dashboard-auto-refresh localstorage-item-name',value:CONFIG.LOCALSTORAGE_ITEM_NAME}));

        $('#rr-button')
            .attr('auto-refresh',STATE.active?'enabled':'disabled')
            .click(autoRefreshButton.clickFunction);

        let childHeight = $('#rr-button').height();
        let parentHeight = $('#rr-button').parent().height()
        $('#rr-button')
            .css('line-height',`${parentHeight}px`)
            .css('border-radius',`${parentHeight/2}px`)
            .css('padding',`0px ${2*(parentHeight-childHeight)}px`);

        if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: UI Tweaked`);

        setInterval(function(){
            if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: auto-refresh="${$('#rr-button').attr('auto-refresh')}"`);
            refreshRequested = $('#rr-button').attr('auto-refresh') == 'enabled';
            if (STATE.active != refreshRequested) {
                STATE.active = refreshRequested;
                setStoredData(CONFIG.LOCALSTORAGE_ITEM_NAME, STATE);
            }
            if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: Refresh ${STATE.active ? '' : 'NOT '}requested`);

            let oQueryString = queryStringToObject(location.href);
            delete oQueryString.refresh;

            ///$('#rr-button').attr('auto-refresh',refreshRequested?'enabled':'disabled');
            if (refreshRequested) {
                if (CONFIG.DEBUG) console.log(`Dashboard Auto-Refresh: New URL - "${location.href.replace(/\?.*$/,'') + objectToQueryString(oQueryString)}"`);
                location.href = location.href.replace(/\?.*$/,'') + objectToQueryString(oQueryString);
            }
        }, (refreshSeconds - elapsedSeconds) * 1000);
    }, CONFIG.UI_CHECK_INTERVAL);
})();

/*
$('div label[for="corp-signals"]:first-of-type').click()
$('div label[for="corp-signals"]:first-of-type input:checked').length == 1

tmp=[];
$('div label[class="Checkbox"][for]:first-of-type').each(function(){
    let idFor = $(this).attr('for');
    tmp.push(`${idFor}: ${$(`div label[for="${idFor}"]:first-of-type input:checked`).length == 1}`);
});
console.log(tmp.join('\n'));
*/
