// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Brings back 404 pages to Stack Exchange network
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_setValue
// @homepage        https://github.com/userscripters/bring-back-404#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.mathoverflow.net/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @name            bring-back-404
// @namespace       userscripters
// @source          git+https://github.com/userscripters/bring-back-404.git
// @supportURL      https://github.com/userscripters/bring-back-404/issues
// @version         0.9.0
// ==/UserScript==

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
(function (uw, w, d, l) { return __awaiter(void 0, void 0, void 0, function () {
    var storageMap, _a, storage, Store, makeConfigItem, makeStacksTextInput, makeStacksIcon, makeLinkIcon, addStyles, makeDraggable, makeConfigView, insert404Image, addConfigOptions, NotFoundConfig, pageNotFounds, overrides, hostname, currentSite, config;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                storageMap = {
                    GM_setValue: {
                        get length() {
                            return GM_listValues().length;
                        },
                        clear: function () {
                            var keys = GM_listValues();
                            return keys.forEach(function (key) { return GM_deleteValue(key); });
                        },
                        key: function (index) {
                            return GM_listValues()[index];
                        },
                        getItem: function (key) {
                            return GM_getValue(key);
                        },
                        setItem: function (key, val) {
                            return GM_setValue(key, val);
                        },
                        removeItem: function (key) {
                            return GM_deleteValue(key);
                        },
                    },
                    GM: {
                        get length() {
                            return GM.listValues().then(function (v) { return v.length; });
                        },
                        clear: function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var keys;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, GM.listValues()];
                                        case 1:
                                            keys = _a.sent();
                                            return [2, keys.forEach(function (key) { return GM.deleteValue(key); })];
                                    }
                                });
                            });
                        },
                        key: function (index) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, GM.listValues()];
                                        case 1: return [2, (_a.sent())[index]];
                                    }
                                });
                            });
                        },
                        getItem: function (key) {
                            return __awaiter(this, void 0, void 0, function () {
                                var item;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, GM.getValue(key)];
                                        case 1:
                                            item = _a.sent();
                                            return [2, item === void 0 ? null : item === null || item === void 0 ? void 0 : item.toString()];
                                    }
                                });
                            });
                        },
                        setItem: function (key, val) {
                            return GM.setValue(key, val);
                        },
                        removeItem: function (key) {
                            return GM.deleteValue(key);
                        },
                    },
                };
                _a = __read(Object.entries(storageMap).find(function (_a) {
                    var _b = __read(_a, 1), key = _b[0];
                    return typeof w[key] !== "undefined";
                }) || [], 2), storage = _a[1];
                Store = (function () {
                    function Store() {
                    }
                    Store.clear = function () {
                        var _a = this, storage = _a.storage, prefix = _a.prefix;
                        storage.removeItem(prefix);
                    };
                    Store.open = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, storage, prefix, val;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = this, storage = _a.storage, prefix = _a.prefix;
                                        return [4, storage.getItem(prefix)];
                                    case 1:
                                        val = _b.sent();
                                        return [2, val ? JSON.parse(val) : {}];
                                }
                            });
                        });
                    };
                    Store.load = function (key, def) {
                        return __awaiter(this, void 0, void 0, function () {
                            var val;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, Store.open()];
                                    case 1:
                                        val = (_a.sent())[key];
                                        return [2, val !== void 0 ? val : def];
                                }
                            });
                        });
                    };
                    Store.save = function (key, val) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, storage, prefix, old;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = this, storage = _a.storage, prefix = _a.prefix;
                                        return [4, Store.open()];
                                    case 1:
                                        old = _b.sent();
                                        old[key] = val;
                                        return [2, storage.setItem(prefix, JSON.stringify(old))];
                                }
                            });
                        });
                    };
                    Store.toggle = function (key) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _b = (_a = Store).save;
                                        _c = [key];
                                        return [4, Store.load(key)];
                                    case 1: return [2, _b.apply(_a, _c.concat([!(_d.sent())]))];
                                }
                            });
                        });
                    };
                    Store.remove = function (key) {
                        return __awaiter(this, void 0, void 0, function () {
                            var prefix, old;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        prefix = this.prefix;
                                        return [4, this.load(prefix, {})];
                                    case 1:
                                        old = _a.sent();
                                        delete old[key];
                                        return [2, Store.save(key, old)];
                                }
                            });
                        });
                    };
                    Store.storage = storage || localStorage;
                    Store.prefix = "bring-back-404";
                    return Store;
                }());
                makeConfigItem = function (id) {
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
                makeStacksTextInput = function (id, title, _a) {
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
                    return [wrap, input, label];
                };
                makeStacksIcon = function (name, pathConfig, namespace) {
                    if (namespace === void 0) { namespace = "http://www.w3.org/2000/svg"; }
                    var svg = d.createElementNS(namespace, "svg");
                    svg.classList.add("svg-icon", name);
                    svg.setAttribute("width", "18");
                    svg.setAttribute("height", "18");
                    svg.setAttribute("viewBox", "0 0 18 18");
                    svg.setAttribute("aria-hidden", "true");
                    var path = d.createElementNS(namespace, "path");
                    path.setAttribute("d", pathConfig);
                    svg.append(path);
                    return [svg, path];
                };
                makeLinkIcon = function (url, title) {
                    var ns = "http://www.w3.org/2000/svg";
                    var _a = __read(makeStacksIcon("iconGlobe", "M9 1C4.64 1 1 4.64 1 9c0 4.36 3.64 8 8 8 4.36 0 8-3.64 8-8\n            0-4.36-3.64-8-8-8zM8 15.32a6.46 6.46 0 01-4.3-2.74 6.46 6.46\n            0 0 1-.93-5.01L7 11.68v.8c0 .88.12 1.32 1\n            1.32v1.52zm5.72-2c-.2-.66-1-1.32-1.72-1.32h-1v-2c0-.44-.56-1-1-1H6V7h1c.44\n            0 1-.56 1-1V5h2c.88 0 1.4-.72 1.4-1.6v-.33a6.45 6.45 0 013.83 4.51 6.45 6.45\n            0 0 1-1.51 5.73v.01z", ns), 2), svg = _a[0], path = _a[1];
                    var ttl = d.createElementNS(ns, "title");
                    ttl.textContent = title;
                    svg.append(ttl);
                    var anchor = d.createElementNS(ns, "a");
                    anchor.setAttribute("href", url);
                    anchor.setAttribute("target", "_blank");
                    anchor.append(path);
                    svg.append(anchor);
                    return svg;
                };
                addStyles = function (d) {
                    var style = d.createElement("style");
                    d.head.append(style);
                    var sheet = style.sheet;
                    if (!sheet)
                        return;
                    sheet.insertRule(".s-modal--dialog[draggable=true] { cursor: grab; }");
                    sheet.insertRule(".iconGlobe path { fill: var(--black-400) !important; }");
                };
                makeDraggable = function (id) {
                    d.addEventListener("dragstart", function (_a) {
                        var dataTransfer = _a.dataTransfer;
                        var dummy = d.createElement("img");
                        dummy.src = "data:image/png;base64,AAAAAA==";
                        dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.setDragImage(dummy, 0, 0);
                    });
                    var previousX = 0;
                    var previousY = 0;
                    var zeroed = 0;
                    var isDragging = false;
                    var handleCoordChange = function (_a) {
                        var clientX = _a.clientX, clientY = _a.clientY;
                        var modal = d.getElementById(id);
                        if (!modal)
                            return;
                        previousX || (previousX = clientX);
                        previousY || (previousY = clientY);
                        var _b = modal.style, top = _b.top, left = _b.left;
                        if (!top && !left) {
                            var computed = uw.getComputedStyle(modal);
                            top = computed.top;
                            left = computed.left;
                        }
                        var moveX = clientX - previousX;
                        var moveY = clientY - previousY;
                        var superSonic = 500;
                        if ([moveX, moveY].map(Math.abs).some(function (c) { return c > superSonic; }))
                            return;
                        var style = modal.style;
                        style.left = parseInt(left) + moveX + "px";
                        style.top = parseInt(top) + moveY + "px";
                        previousX = clientX;
                        previousY = clientY;
                    };
                    d.addEventListener("dragstart", function (event) {
                        var target = event.target;
                        if (target === d.getElementById(id))
                            isDragging = true;
                    });
                    d.addEventListener("dragend", function (_a) {
                        var target = _a.target;
                        if (target === d.getElementById(id)) {
                            isDragging = false;
                            previousX = 0;
                            previousY = 0;
                        }
                    });
                    d.addEventListener("drag", function (event) {
                        zeroed = event.clientX ? 0 : zeroed < 3 ? zeroed + 1 : 3;
                        if (zeroed >= 3 || !isDragging)
                            return;
                        return handleCoordChange(event);
                    });
                    d.addEventListener("dragover", function (e) {
                        if (isDragging)
                            e.preventDefault();
                        if (zeroed < 3 || !isDragging)
                            return;
                        return handleCoordChange(e);
                    });
                };
                makeConfigView = function (id, configs) {
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
                    doc.classList.add("s-modal--dialog", "ps-relative", "hmx6");
                    doc.setAttribute("role", "document");
                    doc.id = id + "-document";
                    doc.draggable = true;
                    makeDraggable(doc.id);
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
                            : configs.push(new NotFoundConfig({
                                site: id,
                                imageURL: value,
                                url: l.hostname,
                            }));
                        Store.save("overrides", configs);
                    });
                    var inputClasses = ["flex--item"];
                    var inputs = configs.map(function (_a) {
                        var imageURL = _a.imageURL, site = _a.site, label = _a.label, notFoundURL = _a.notFoundURL;
                        var title = label || site;
                        var _b = __read(makeStacksTextInput(site, title, {
                            value: imageURL,
                            classes: inputClasses,
                        }), 3), wrap = _b[0], _input = _b[1], lbl = _b[2];
                        lbl.append(d.createTextNode(" "), makeLinkIcon(notFoundURL, title + " 404 page"));
                        lbl.classList.add("mb8");
                        return wrap;
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
                insert404Image = function (d, _a) {
                    var imageURL = _a.imageURL;
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
                };
                addConfigOptions = function (configs) {
                    var itemId = "bring-back-404";
                    var menu = d.querySelector("ol.user-logged-in, ol.user-logged-out");
                    if (!menu)
                        return console.debug("failed to find main menu");
                    var item = d.getElementById(itemId) || makeConfigItem(itemId);
                    if (item.isConnected)
                        return;
                    menu.append(item);
                    var uiId = "bring-back-404-config";
                    item.addEventListener("click", function () { return menu.append(makeConfigView(uiId, configs)); }, { once: true });
                    item.addEventListener("click", function (event) {
                        var _a;
                        event.preventDefault();
                        var modal = d.getElementById(uiId);
                        if (modal)
                            (_a = uw.Stacks) === null || _a === void 0 ? void 0 : _a.showModal(modal);
                    });
                };
                NotFoundConfig = (function () {
                    function NotFoundConfig(options) {
                        Object.assign(this, options);
                    }
                    Object.defineProperty(NotFoundConfig.prototype, "notFoundURL", {
                        get: function () {
                            var _a = this, site = _a.site, url = _a.url;
                            return url || "https://" + site + ".com/404";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return NotFoundConfig;
                }());
                pageNotFounds = [
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
                ].map(function (option) { return new NotFoundConfig(option); });
                return [4, Store.load("overrides", [])];
            case 1:
                overrides = _b.sent();
                overrides.forEach(function (option) {
                    var defaults = pageNotFounds.find(function (_a) {
                        var site = _a.site;
                        return site === option.site;
                    });
                    if (!defaults)
                        return pageNotFounds.push(new NotFoundConfig(option));
                    Object.assign(defaults, option);
                });
                addStyles(d);
                addConfigOptions(pageNotFounds);
                hostname = l.hostname;
                currentSite = hostname.split(".").slice(0, -1).join(".");
                config = pageNotFounds.find(function (_a) {
                    var site = _a.site;
                    return site === currentSite;
                });
                if (!config)
                    return [2, console.debug("not on supported site: " + currentSite)];
                insert404Image(d, config);
                return [2];
        }
    });
}); })(typeof unsafeWindow !== "undefined" ? unsafeWindow : window, window, document, location);
