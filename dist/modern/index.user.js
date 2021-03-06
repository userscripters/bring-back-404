// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Brings back 404 pages to Stack Exchange network
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_setValue
// @homepage        https://github.com/userscripters/bring-back-404#readme
// @match           https://*.stackexchange.com/*
// @match           https://askubuntu.com/*
// @match           https://es.meta.stackoverflow.com/*
// @match           https://es.stackoverflow.com/*
// @match           https://ja.meta.stackoverflow.com/*
// @match           https://ja.stackoverflow.com/*
// @match           https://mathoverflow.net/*
// @match           https://meta.askubuntu.com/*
// @match           https://meta.mathoverflow.net/*
// @match           https://meta.serverfault.com/*
// @match           https://meta.stackoverflow.com/*
// @match           https://meta.superuser.com/*
// @match           https://pt.meta.stackoverflow.com/*
// @match           https://pt.stackoverflow.com/*
// @match           https://ru.meta.stackoverflow.com/*
// @match           https://ru.stackoverflow.com/*
// @match           https://serverfault.com/*
// @match           https://stackapps.com/*
// @match           https://stackoverflow.com/*
// @match           https://superuser.com/*
// @name            Bring Back 404
// @namespace       userscripters
// @require         https://github.com/userscripters/storage/raw/master/dist/browser.js
// @run-at          document-start
// @source          git+https://github.com/userscripters/bring-back-404.git
// @supportURL      https://github.com/userscripters/bring-back-404/issues
// @version         2.0.0
// ==/UserScript==

"use strict";
((uw, w, d, l) => {
    const makeConfigItem = (id) => {
        const item = d.createElement("li");
        item.id = id;
        const { dataset } = item;
        dataset.action = "s-modal#toggle";
        const link = d.createElement("a");
        link.classList.add("s-topbar--item");
        const text = d.createElement("strong");
        text.textContent = "404";
        link.append(text);
        item.append(link);
        return item;
    };
    const makeStacksTextInput = (id, { classes = [], placeholder = "", title = "", value = "", } = {}) => {
        const wrap = d.createElement("div");
        wrap.classList.add("d-flex", "gs4", "gsy", "fd-column", ...classes);
        const inputWrap = d.createElement("div");
        inputWrap.classList.add("d-flex", "ps-relative");
        const input = d.createElement("input");
        input.classList.add("s-input");
        input.id = id;
        input.type = "text";
        input.placeholder = placeholder;
        input.value = value;
        inputWrap.append(input);
        wrap.append(inputWrap);
        if (title) {
            const lblWrap = d.createElement("div");
            lblWrap.classList.add("flex--item");
            const label = d.createElement("label");
            label.classList.add("d-block", "s-label");
            label.htmlFor = id;
            label.textContent = title;
            lblWrap.append(label);
            wrap.prepend(lblWrap);
            return [wrap, input, label];
        }
        return [wrap, input];
    };
    const makeStacksIcon = (name, pathConfig, namespace = "http://www.w3.org/2000/svg") => {
        const svg = d.createElementNS(namespace, "svg");
        svg.classList.add("svg-icon", name);
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("viewBox", "0 0 18 18");
        svg.setAttribute("aria-hidden", "true");
        const path = d.createElementNS(namespace, "path");
        path.setAttribute("d", pathConfig);
        svg.append(path);
        return [svg, path];
    };
    const makeLinkIcon = (url, title) => {
        const ns = "http://www.w3.org/2000/svg";
        const [svg, path] = makeStacksIcon("iconGlobe", `M9 1C4.64 1 1 4.64 1 9c0 4.36 3.64 8 8 8 4.36 0 8-3.64 8-8
            0-4.36-3.64-8-8-8zM8 15.32a6.46 6.46 0 01-4.3-2.74 6.46 6.46
            0 0 1-.93-5.01L7 11.68v.8c0 .88.12 1.32 1
            1.32v1.52zm5.72-2c-.2-.66-1-1.32-1.72-1.32h-1v-2c0-.44-.56-1-1-1H6V7h1c.44
            0 1-.56 1-1V5h2c.88 0 1.4-.72 1.4-1.6v-.33a6.45 6.45 0 013.83 4.51 6.45 6.45
            0 0 1-1.51 5.73v.01z`, ns);
        const ttl = d.createElementNS(ns, "title");
        ttl.textContent = title;
        svg.append(ttl);
        const anchor = d.createElementNS(ns, "a");
        anchor.setAttribute("href", url);
        anchor.setAttribute("target", "_blank");
        anchor.append(path);
        svg.append(anchor);
        return svg;
    };
    const addStyles = (d) => {
        const style = d.createElement("style");
        d.head.append(style);
        const { sheet } = style;
        if (!sheet)
            return;
        sheet.insertRule(".s-modal--dialog[draggable=true] { cursor: grab; }");
        sheet.insertRule(".iconGlobe path { fill: var(--black-400) !important; }");
    };
    const makeDraggable = (id) => {
        d.addEventListener("dragstart", ({ dataTransfer }) => {
            const dummy = d.createElement("img");
            dummy.src = "data:image/png;base64,AAAAAA==";
            dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.setDragImage(dummy, 0, 0);
        });
        let previousX = 0;
        let previousY = 0;
        let zeroed = 0;
        let isDragging = false;
        const handleCoordChange = ({ clientX, clientY }) => {
            const modal = d.getElementById(id);
            if (!modal)
                return;
            previousX || (previousX = clientX);
            previousY || (previousY = clientY);
            let { style: { top, left }, } = modal;
            if (!top && !left) {
                const computed = uw.getComputedStyle(modal);
                top = computed.top;
                left = computed.left;
            }
            const moveX = clientX - previousX;
            const moveY = clientY - previousY;
            const superSonic = 500;
            if ([moveX, moveY].map(Math.abs).some((c) => c > superSonic))
                return;
            const { style } = modal;
            style.left = `${parseInt(left) + moveX}px`;
            style.top = `${parseInt(top) + moveY}px`;
            previousX = clientX;
            previousY = clientY;
        };
        d.addEventListener("dragstart", (event) => {
            const { target } = event;
            if (target === d.getElementById(id))
                isDragging = true;
        });
        d.addEventListener("dragend", ({ target }) => {
            if (target === d.getElementById(id)) {
                isDragging = false;
                previousX = 0;
                previousY = 0;
            }
        });
        d.addEventListener("drag", (event) => {
            zeroed = event.clientX ? 0 : zeroed < 3 ? zeroed + 1 : 3;
            if (zeroed >= 3 || !isDragging)
                return;
            return handleCoordChange(event);
        });
        d.addEventListener("dragover", (e) => {
            if (isDragging)
                e.preventDefault();
            if (zeroed < 3 || !isDragging)
                return;
            return handleCoordChange(e);
        });
    };
    const makeConfigView = (store, id, configs) => {
        const ariaLabelId = "modal-title";
        const ariaDescrId = "modal-description";
        const wrap = d.createElement("aside");
        wrap.classList.add("s-modal");
        wrap.id = id;
        wrap.tabIndex = -1;
        wrap.setAttribute("role", "dialog");
        wrap.setAttribute("aria-labelledby", ariaLabelId);
        wrap.setAttribute("aria-describeddy", ariaDescrId);
        wrap.setAttribute("aria-hidden", "true");
        const { dataset } = wrap;
        dataset.sModalTarget = "modal";
        dataset.controller = "s-modal";
        const doc = d.createElement("div");
        doc.classList.add("s-modal--dialog", "ps-relative", "hmx6");
        doc.setAttribute("role", "document");
        doc.id = `${id}-document`;
        doc.draggable = true;
        makeDraggable(doc.id);
        const title = d.createElement("h1");
        title.classList.add("s-modal--header");
        title.id = ariaLabelId;
        title.textContent = "Custom 404 Options";
        const form = d.createElement("form");
        form.classList.add("s-modal--body", "d-flex", "flex__allitems6", "fw-wrap", "gs16");
        form.addEventListener("change", ({ target }) => {
            const { id, value } = target;
            const [siteId, configProp] = id.split("-");
            const option = configs.find(({ site }) => site === siteId);
            option
                ? Object.assign(option, { [configProp]: value })
                : configs.push(new NotFoundConfig({
                    site: siteId,
                    [configProp]: value,
                    url: l.hostname,
                }));
            store.save("overrides", configs);
        });
        const inputs = configs.map(({ imageURL, site, label, notFoundURL, header }) => {
            const title = label || site;
            const wrapper = d.createElement("div");
            wrapper.classList.add("flex--item");
            const [imageInputWrap, _input, lbl] = makeStacksTextInput(`${site}-imageURL`, { value: imageURL, title });
            lbl.append(d.createTextNode(" "), makeLinkIcon(notFoundURL, `${title} 404 page`));
            lbl.classList.add("mb8");
            const [headerInputWrap] = makeStacksTextInput(`${site}-header`, {
                placeholder: "custom header",
                value: header || "",
            });
            wrapper.append(imageInputWrap, headerInputWrap);
            return wrapper;
        });
        form.append(...inputs);
        const close = d.createElement("button");
        close.classList.add("s-modal--close", "s-btn", "s-btn__muted");
        close.type = "button";
        close.dataset.action = "s-modal#hide";
        const svgNS = "http://www.w3.org/2000/svg";
        const closeIcon = d.createElementNS(svgNS, "svg");
        closeIcon.setAttribute("aria-hidden", "true");
        closeIcon.setAttribute("viewBox", "0 0 14 14");
        closeIcon.setAttribute("width", "14");
        closeIcon.setAttribute("height", "14");
        closeIcon.classList.add("svg-icon", "iconClearSm");
        const iconPath = d.createElementNS(svgNS, "path");
        iconPath.setAttribute("d", "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z");
        closeIcon.append(iconPath);
        close.append(closeIcon);
        doc.append(title, form, close);
        wrap.append(doc);
        return wrap;
    };
    const insert404Image = (d, { imageURL = "", site }) => {
        const image = d.createElement("img");
        image.src = imageURL;
        image.alt = "Page not found";
        image.decoding = "async";
        image.width = 250;
        image.style.display = "none";
        image.addEventListener("error", () => console.debug(`failed to load 404 image on ${site}`));
        image.addEventListener("load", () => {
            const contentModal = d.getElementById("content");
            if (!contentModal)
                return console.debug("missing content modal");
            const alertImage = contentModal.querySelector("svg.spotAlertXL, [alt='Page not found']");
            if (!alertImage)
                return console.debug("missing 404 image");
            alertImage.replaceWith(image);
            image.style.display = "unset";
            const header = contentModal.querySelector("h1");
            if (!header)
                return console.debug("missing 404 header");
            header.classList.remove("mt48");
            const flexWrap = header.closest(".d-flex");
            if (!flexWrap)
                return console.debug("404 content does't use Flexbox");
            flexWrap.classList.replace("ai-start", "ai-center");
        });
        d.body.append(image);
    };
    const modify404Headline = (d, { header }) => {
        const contentModal = d.getElementById("content");
        if (!contentModal)
            return console.debug("missing content modal");
        const headline = contentModal.querySelector("h1:not(#question-header > h1)");
        if (!header || !headline)
            return;
        headline.textContent = header;
    };
    const addConfigOptions = (store, configs) => {
        const itemId = "bring-back-404";
        const menu = d.querySelector("ol.s-topbar--content");
        if (!menu)
            return console.debug("failed to find main menu");
        const item = d.getElementById(itemId) || makeConfigItem(itemId);
        if (item.isConnected)
            return;
        menu.append(item);
        const uiId = "bring-back-404-config";
        item.addEventListener("click", () => menu.append(makeConfigView(store, uiId, configs)), { once: true });
        item.addEventListener("click", (event) => {
            var _a;
            event.preventDefault();
            const modal = d.getElementById(uiId);
            if (modal)
                (_a = uw.Stacks) === null || _a === void 0 ? void 0 : _a.showModal(modal);
        });
    };
    class NotFoundConfig {
        constructor(options) {
            Object.assign(this, options);
        }
        get notFoundURL() {
            const { site, url } = this;
            return url || `https://${site}.com/404`;
        }
    }
    const defaultOptions = [
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
        {
            label: "Android Enthusiasts",
            site: "android.stackexchange",
            imageURL: "https://i.stack.imgur.com/kgFiY.png",
        },
        {
            label: "Graphic Design",
            site: "graphicdesign.stackexchange",
            imageURL: "https://i.stack.imgur.com/FwQQL.png",
        },
        {
            label: "Database Administrators",
            site: "dba.stackexchange",
            imageURL: "https://i.stack.imgur.com/ly6am.png",
        },
        {
            label: "Movies & TV",
            site: "movies.stackexchange",
            imageURL: "https://i.stack.imgur.com/wCrM9.png",
        },
        {
            label: "Software Recommendations",
            site: "softwarerecs.stackexchange",
            imageURL: "https://i.stack.imgur.com/BqikQ.png",
        },
        {
            label: "Academia",
            site: "academia.stackexchange",
            imageURL: "https://i.stack.imgur.com/l10yz.png",
        },
    ];
    const pageNotFounds = defaultOptions.map((option) => new NotFoundConfig(option));
    w.addEventListener("load", async () => {
        const storage = Store.locateStorage();
        const store = new Store.default("bring-back-404", storage);
        const overrides = await store.load("overrides", []);
        overrides.forEach((option) => {
            const defaults = pageNotFounds.find(({ site }) => site === option.site);
            if (!defaults)
                return pageNotFounds.push(new NotFoundConfig(option));
            Object.assign(defaults, option);
        });
        addStyles(d);
        addConfigOptions(store, pageNotFounds);
        const { status } = await fetch(l.href);
        if (status !== 404)
            return;
        const { hostname } = l;
        const currentSite = hostname.split(".").slice(0, -1).join(".");
        const config = pageNotFounds.find(({ site }) => site === currentSite) ||
            new NotFoundConfig({
                site: currentSite,
                header: "Arrrggghhh!",
                imageURL: "https://i.stack.imgur.com/ata1R.jpg",
            });
        insert404Image(d, config);
        modify404Headline(d, config);
    });
})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window, window, document, location);
