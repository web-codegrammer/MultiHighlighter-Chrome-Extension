document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var currTab = tabs[0];
        if (currTab) { 
            var tabkey = get_tabkey(currTab.id);
            chrome.storage.local.get(['settings', tabkey], function (result) {
            
                var settings = result.settings;
                var tabinfo = result[tabkey];
                var flag = {"is_change": false};
    
                container.style.width = settings.popup_width + "px";
                highlightWords.style.minHeight = settings.popup_height + "px";
                instant.checked = settings.isInstant;
                saveWords.checked = settings.isSaveKws;
                if (settings.isSaveKws && tabinfo.isNewPage) { 
                    flag.is_change = true;
                } 
                tabinfo.isNewPage = false;
                chrome.storage.local.set({[tabkey]: tabinfo}, function () {
                    if (flag.is_change) {
                        handle_highlightWords_change(tabkey);
                    }
                });
              
                $("#highlightWords").on("input", function () {
                    handle_highlightWords_change(tabkey);
                })
                $("#instant").on("input", function () {
                    handle_instant_mode_change(settings);
                })
                $("#saveWords").on("input", function () {
                    handle_saveWords_mode_change(settings);
                })

            });
        }
    });
});
