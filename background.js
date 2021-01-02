chrome.runtime.onInstalled.addListener(function (details) {
    // variables initialization
    var settings = {
        
        popup_width: 340,
        popup_height: 40,

        
        CSS_COLORS_COUNT: 10, 
        CSSprefix1: "chrome-extension-FindManyStrings",
        CSSprefix2: "chrome-extension-FindManyStrings-style-",
        CSSprefix3: "CE-FMS-",

       
        isInstant: true,
        isSaveKws: true,
        delim: ' ',
        latest_keywords: [],

        
        isItemAddKw: true,
        isItemRemoveKw: true
    }

   
    chrome.contextMenus.create({
        title: 'Remove Keyword',
        id: 'removeKw', 
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        title: 'Add Keyword',
        id: 'addKw', 
        contexts: ['selection'],
    });

    chrome.storage.local.set({'settings': settings});
});


chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        var tabkey = get_tabkey(tabId);
        var tabinfo = {};
        tabinfo.id = tabId;
        tabinfo.style_nbr = 0;
        tabinfo.isNewPage = true;
        tabinfo.keywords = [];
        chrome.storage.local.set({[tabkey]: tabinfo});
    }
});


chrome.contextMenus.onClicked.addListener(function getword(info, tab) {
    var tabkey = get_tabkey(tab.id);
    var kw = info.selectionText.toLowerCase().split(' ')[0];

    if (info.menuItemId === "removeKw") {
        chrome.storage.local.get(["settings", tabkey], function (result) {
         
            settings = result.settings;
            tabinfo = result[tabkey];
         
            var index = tabinfo.keywords.indexOf(kw);
            if (index !== -1) {
                length = tabinfo.keywords.length
               
                while (length--) {
                    if (kw.indexOf(tabinfo.keywords[length]) != -1 && length != index) {
                        return;
                    }
                }
                tabinfo.keywords.splice(index, 1);
            }
            settings.latest_keywords = tabinfo.keywords;
            hl_clear([kw], settings, tabinfo);
            chrome.storage.local.set({[tabkey]: tabinfo, "settings": settings}, function () {
            });
        });
    } else if (info.menuItemId === "addKw") {
        chrome.storage.local.get(["settings", tabkey], function (result) {
        
            settings = result.settings;
            tabinfo = result[tabkey];
            tabinfo.keywords.push(kw);
            settings.latest_keywords = tabinfo.keywords;
            hl_search([kw], settings, tabinfo);
            chrome.storage.local.set({[tabkey]: tabinfo, "settings": settings}, function () {
            });
        });
    }

});
