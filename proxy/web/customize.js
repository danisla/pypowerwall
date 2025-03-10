'use strict'

// Clear IndexedDB to prevent auth hangup in the proxied Powerwall web app.
window.indexedDB.databases().then((dbs) => {
    dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) });
});

function injectScriptAndUse() {
    return new Promise((resolve, reject) => {
        var body = document.getElementsByTagName("body")[0];
        var script = document.createElement("script");
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
        script.onload = function () {
            resolve();
        };
        body.appendChild(script);
    });
}

injectScriptAndUse().then(() => {
    console.log("Applying Dakboard customization");
    triggerOnMutation(formatPowerwallForDakboard);
});

function triggerOnMutation(cb) {
    // Create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var newNodes = mutation.addedNodes; // DOM NodeList
            if (newNodes !== null) { // If there are new nodes added
                if (cb) cb();
            }
        });
    });

    // Configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        subtree: true,
    };

    var target = $("#root")[0];

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);
}

function formatPowerwallForDakboard() {
    // Hide elements.
    $('.overview-menu, #logout, .footer, .compact-btn-row, .toast-list, .power-flow-header').hide();

    // Set alignment
    $('.core-layout__viewport').css({
        padding: 0,
        margin: 0,
    });

    $('.power-flow-header').css({
        "padding-top": 0,
    });

    $('.power-flow-grid').css({
        width: "100%",
        left: 0,
        right: 0,
        margin: 0,
        "padding-top": 0,
        "position": "fixed",
    });

    // Set colors
    $('body').css({
        "background-color": "black",
    });

    $('.power-flow-grid.active').css({
        "background-color": "#000",
    });
}