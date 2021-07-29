// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Brings back 404 pages to Stack Exchange network
// @grant           none
// @homepage        https://github.com/userscripters/bring-back-404#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @match           https://*.superuser.com/*
// @name            bring-back-404
// @namespace       userscripters
// @source          git+https://github.com/userscripters/bring-back-404.git
// @supportURL      https://github.com/userscripters/bring-back-404/issues
// @version         0.1.0
// ==/UserScript==

"use strict";
(function (_w, d, l) {
    var Store = (function () {
        function Store() {
        }
        Store.clear = function () {
            var _a = this, storage = _a.storage, prefix = _a.prefix;
            storage.removeItem(prefix);
        };
        Store.open = function () {
            var _a = this, storage = _a.storage, prefix = _a.prefix;
            var val = storage.getItem(prefix);
            return val ? JSON.parse(val) : {};
        };
        Store.load = function (key, def) {
            var val = Store.open()[key];
            return val !== void 0 ? val : def;
        };
        Store.save = function (key, val) {
            var _a = this, storage = _a.storage, prefix = _a.prefix;
            var old = Store.open();
            old[key] = val;
            storage.setItem(prefix, JSON.stringify(old));
        };
        Store.toggle = function (key) {
            return Store.save(key, !Store.load(key));
        };
        Store.remove = function (key) {
            var prefix = this.prefix;
            var old = this.load(prefix, {});
            delete old[key];
            return Store.save(key, old);
        };
        Store.storage = localStorage;
        Store.prefix = "bring-back-404";
        return Store;
    }());
    var pageNotFounds = [
        {
            site: "stackoverflow",
            imageURL: "https://i.stack.imgur.com/okzBE.png",
        },
        {
            site: "meta.stackoverflow",
            imageURL: "https://i.stack.imgur.com/0i2to.png",
        },
        {
            site: "askubuntu",
            imageURL: "https://i.stack.imgur.com/KopoQ.png",
        },
        {
            site: "superuser",
            imageURL: "https://i.stack.imgur.com/hMfYx.png",
        },
        {
            site: "english.stackexchange",
            imageURL: "https://i.stack.imgur.com/cQLRt.png",
        },
        {
            site: "codereview.stackexchange",
            imageURL: "https://i.stack.imgur.com/R4Tgd.png",
        },
        {
            site: "unix.stackexchange",
            imageURL: "https://i.stack.imgur.com/XQRh5.png",
        },
        {
            site: "scifi.stackexchange",
            imageURL: "https://i.stack.imgur.com/UR35t.png",
        },
        {
            site: "math.stackexchange",
            imageURL: "https://i.stack.imgur.com/bHpU1.png",
        },
        {
            site: "serverfault",
            imageURL: "https://i.stack.imgur.com/W7VMk.png",
        },
        {
            site: "apple.stackexchange",
            imageURL: "https://i.stack.imgur.com/fCIaP.png",
        },
        {
            site: "stats.stackexchange",
            imageURL: "https://i.stack.imgur.com/BqaS0.png",
        },
        {
            site: "gaming.stackexchange",
            imageURL: "https://i.stack.imgur.com/C4jC1.png",
        },
        {
            site: "judaism.stackexchange",
            imageURL: "https://i.stack.imgur.com/048MA.png",
        },
        {
            site: "webmasters.stackexchange",
            imageURL: "https://i.stack.imgur.com/Z8Y2o.png",
        },
        {
            site: "crypto.stackexchange",
            imageURL: "https://i.stack.imgur.com/2hyIe.png",
        },
        {
            site: "cooking.stackexchange",
            imageURL: "https://i.stack.imgur.com/kSX5n.png",
        },
        {
            site: "diy.stackexchange",
            imageURL: "https://i.stack.imgur.com/C4P5L.png",
        },
    ];
    var overrides = Store.load("overrides", []);
    overrides.forEach(function (option) {
        var defaults = pageNotFounds.find(function (_a) {
            var site = _a.site;
            return site === option.site;
        });
        if (!defaults)
            return pageNotFounds.push(option);
        Object.assign(defaults, option);
    });
    var hostname = l.hostname;
    var currentSite = hostname.split(".").slice(0, -1).join(".");
    var config = pageNotFounds.find(function (_a) {
        var site = _a.site;
        return site === currentSite;
    });
    if (!config)
        return console.debug("not on supported site: " + currentSite);
    var imageURL = config.imageURL;
    var image = d.createElement("img");
    image.src = imageURL;
    image.alt = "Page not found";
    image.decoding = "async";
    image.width = 250;
    image.style.display = "none";
    image.addEventListener("error", function () {
        return console.debug("failed to load 404 image on " + currentSite);
    });
    image.addEventListener("load", function () {
        var contentModal = d.getElementById("content");
        if (!contentModal)
            return console.debug("missing content modal");
        var alertImage = contentModal.querySelector("svg.spotAlertXL");
        if (!alertImage)
            return console.debug("missing 404 image");
        alertImage.replaceWith(image);
        image.style.display = "unset";
        var header = contentModal.querySelector("h1");
        if (!header)
            return console.debug("missing 404 header");
        header.classList.remove("mt48");
        var flexWrap = header.closest(".d-flex");
        if (!flexWrap)
            return console.debug("404 content does't use Flexbox");
        flexWrap.classList.replace("ai-start", "ai-center");
    });
    d.body.append(image);
})(window, document, location);
