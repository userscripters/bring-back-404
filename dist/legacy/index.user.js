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
// @version         0.5.0
// ==/UserScript==

"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
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
    var makeConfigItem = function (id) {
        var item = d.createElement("li");
        item.classList.add("-item");
        item.id = id;
        var dataset = item.dataset;
        dataset.action = "s-modal#toggle";
        var link = d.createElement("a");
        link.classList.add("-link");
        var text = d.createElement("strong");
        text.textContent = "404";
        link.append(text);
        item.append(link);
        return item;
    };
    var makeStacksTextInput = function (id, title, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.classes, classes = _d === void 0 ? [] : _d, _e = _c.placeholder, placeholder = _e === void 0 ? "" : _e, _f = _c.value, value = _f === void 0 ? "" : _f;
        var wrap = d.createElement("div");
        (_b = wrap.classList).add.apply(_b, __spreadArray(["d-flex", "gs4", "gsy", "fd-column"], __read(classes)));
        var lblWrap = d.createElement("div");
        lblWrap.classList.add("flex--item");
        var label = d.createElement("label");
        label.classList.add("d-block", "s-label");
        label.htmlFor = id;
        label.textContent = title;
        var inputWrap = d.createElement("div");
        inputWrap.classList.add("d-flex", "ps-relative");
        var input = d.createElement("input");
        input.classList.add("s-input");
        input.id = id;
        input.type = "text";
        input.placeholder = placeholder;
        input.value = value;
        lblWrap.append(label);
        inputWrap.append(input);
        wrap.append(lblWrap, inputWrap);
        return [wrap, input];
    };
    var makeConfigView = function (id, configs) {
        var ariaLabelId = "modal-title";
        var ariaDescrId = "modal-description";
        var wrap = d.createElement("aside");
        wrap.classList.add("s-modal");
        wrap.id = id;
        wrap.tabIndex = -1;
        wrap.setAttribute("role", "dialog");
        wrap.setAttribute("aria-labelledby", ariaLabelId);
        wrap.setAttribute("aria-describeddy", ariaDescrId);
        wrap.setAttribute("aria-hidden", "true");
        var dataset = wrap.dataset;
        dataset.sModalTarget = "modal";
        dataset.controller = "s-modal";
        var doc = d.createElement("div");
        doc.classList.add("s-modal--dialog", "ps-relative");
        doc.setAttribute("role", "document");
        var title = d.createElement("h1");
        title.classList.add("s-modal--header");
        title.id = ariaLabelId;
        title.textContent = "Custom 404 Options";
        var form = d.createElement("form");
        form.classList.add("s-modal--body", "d-flex", "flex__allcells6", "fw-wrap", "gs16");
        form.addEventListener("change", function (_a) {
            var target = _a.target;
            var _b = target, id = _b.id, value = _b.value;
            var option = configs.find(function (_a) {
                var site = _a.site;
                return site === id;
            });
            option
                ? Object.assign(option, { imageURL: value })
                : configs.push({ site: id, imageURL: value });
            Store.save("overrides", configs);
        });
        var inputClasses = ["flex--item"];
        var inputs = configs.map(function (_a) {
            var imageURL = _a.imageURL, site = _a.site, label = _a.label;
            return makeStacksTextInput(site, label || site, {
                value: imageURL,
                classes: inputClasses,
            })[0];
        });
        form.append.apply(form, __spreadArray([], __read(inputs)));
        var close = d.createElement("button");
        close.classList.add("s-modal--close", "s-btn", "s-btn__muted");
        close.type = "button";
        close.dataset.action = "s-modal#hide";
        var svgNS = "http://www.w3.org/2000/svg";
        var closeIcon = d.createElementNS(svgNS, "svg");
        closeIcon.setAttribute("aria-hidden", "true");
        closeIcon.setAttribute("viewBox", "0 0 14 14");
        closeIcon.setAttribute("width", "14");
        closeIcon.setAttribute("height", "14");
        closeIcon.classList.add("svg-icon", "iconClearSm");
        var iconPath = d.createElementNS(svgNS, "path");
        iconPath.setAttribute("d", "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z");
        closeIcon.append(iconPath);
        close.append(closeIcon);
        doc.append(title, form, close);
        wrap.append(doc);
        return wrap;
    };
    var addConfigOptions = function (configs) {
        var itemId = "bring-back-404";
        var menu = d.querySelector("ol.user-logged-in");
        if (!menu)
            return console.debug("failed to find main menu");
        var item = d.getElementById(itemId) || makeConfigItem(itemId);
        if (item.isConnected)
            return;
        menu.append(item);
        var uiId = "bring-back-404-config";
        item.addEventListener("click", function () { return menu.append(makeConfigView(uiId, configs)); }, { once: true });
        item.addEventListener("click", function (event) {
            event.preventDefault();
            var modal = d.getElementById(uiId);
            if (modal)
                Stacks === null || Stacks === void 0 ? void 0 : Stacks.showModal(modal);
        });
    };
    var pageNotFounds = [
        {
            label: "Stack Overflow",
            site: "stackoverflow",
            imageURL: "https://i.stack.imgur.com/okzBE.png",
        },
        {
            label: "Meta Stack Overflow",
            site: "meta.stackoverflow",
            imageURL: "https://i.stack.imgur.com/0i2to.png",
        },
        {
            label: "Ask Ubuntu",
            site: "askubuntu",
            imageURL: "https://i.stack.imgur.com/KopoQ.png",
        },
        {
            label: "Super User",
            site: "superuser",
            imageURL: "https://i.stack.imgur.com/hMfYx.png",
        },
        {
            label: "English Language Learners",
            site: "english.stackexchange",
            imageURL: "https://i.stack.imgur.com/cQLRt.png",
        },
        {
            label: "Code Review",
            site: "codereview.stackexchange",
            imageURL: "https://i.stack.imgur.com/R4Tgd.png",
        },
        {
            label: "Unix & Linux",
            site: "unix.stackexchange",
            imageURL: "https://i.stack.imgur.com/XQRh5.png",
        },
        {
            label: "Science Fiction & Fantasy",
            site: "scifi.stackexchange",
            imageURL: "https://i.stack.imgur.com/UR35t.png",
        },
        {
            label: "Mathematics",
            site: "math.stackexchange",
            imageURL: "https://i.stack.imgur.com/bHpU1.png",
        },
        {
            label: "Server Fault",
            site: "serverfault",
            imageURL: "https://i.stack.imgur.com/W7VMk.png",
        },
        {
            label: "Ask Different",
            site: "apple.stackexchange",
            imageURL: "https://i.stack.imgur.com/fCIaP.png",
        },
        {
            label: "Cross Validated",
            site: "stats.stackexchange",
            imageURL: "https://i.stack.imgur.com/BqaS0.png",
        },
        {
            label: "Arqade",
            site: "gaming.stackexchange",
            imageURL: "https://i.stack.imgur.com/C4jC1.png",
        },
        {
            label: "Mi Yodeya",
            site: "judaism.stackexchange",
            imageURL: "https://i.stack.imgur.com/048MA.png",
        },
        {
            label: "Webmasters",
            site: "webmasters.stackexchange",
            imageURL: "https://i.stack.imgur.com/Z8Y2o.png",
        },
        {
            label: "Cryptography",
            site: "crypto.stackexchange",
            imageURL: "https://i.stack.imgur.com/2hyIe.png",
        },
        {
            label: "Seasoned Advice",
            site: "cooking.stackexchange",
            imageURL: "https://i.stack.imgur.com/kSX5n.png",
        },
        {
            label: "Home Improvement",
            site: "diy.stackexchange",
            imageURL: "https://i.stack.imgur.com/C4P5L.png",
        },
        {
            label: "Chemistry",
            site: "chemistry.stackexchange",
            imageURL: "https://i.stack.imgur.com/SwIib.png",
        },
        {
            label: "Raspberry Pi",
            site: "raspberrypi.stackexchange",
            imageURL: "https://i.stack.imgur.com/A02um.png",
        },
        {
            label: "Emacs",
            site: "emacs.stackexchange",
            imageURL: "https://i.stack.imgur.com/KUafD.png",
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
        var alertImage = contentModal.querySelector("svg.spotAlertXL, [alt='Page not found']");
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
    addConfigOptions(pageNotFounds);
})(window, document, location);
