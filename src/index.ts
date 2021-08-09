type NotFoundOptions = {
    label?: string;
    site: string;
    url?: string;
    imageURL: string;
};

type StacksTextInputOptions = {
    classes?: string[];
    placeholder?: string;
    value?: string;
};

interface Window {
    Stacks: typeof Stacks;
    [x: string]: unknown;
}

type RemoveIndex<T> = {
    [P in keyof T as string extends P
        ? never
        : number extends P
        ? never
        : P]: T[P];
};

type AsyncStorage = RemoveIndex<
    {
        [P in keyof Storage]: Storage[P] extends Function
            ? (
                  ...args: Parameters<Storage[P]>
              ) => Promise<ReturnType<Storage[P]>>
            : Promise<Storage[P]>;
    }
>;

(async (uw, w, d, l) => {
    const storageMap: {
        GM_setValue: Storage;
        GM: AsyncStorage;
    } = {
        GM_setValue: {
            get length() {
                return GM_listValues().length;
            },
            clear() {
                const keys = GM_listValues();
                return keys.forEach((key) => GM_deleteValue(key));
            },
            key(index) {
                return GM_listValues()[index];
            },
            getItem(key) {
                return GM_getValue(key);
            },
            setItem(key, val) {
                return GM_setValue(key, val);
            },
            removeItem(key) {
                return GM_deleteValue(key);
            },
        },
        GM: {
            get length() {
                return GM.listValues().then((v) => v.length);
            },
            async clear() {
                const keys = await GM.listValues();
                return keys.forEach((key) => GM.deleteValue(key));
            },
            async key(index) {
                return (await GM.listValues())[index];
            },
            async getItem(key) {
                const item = await GM.getValue(key);
                return item === void 0 ? null : item?.toString();
            },
            setItem(key, val) {
                return GM.setValue(key, val);
            },
            removeItem(key) {
                return GM.deleteValue(key);
            },
        },
    };

    //TODO: switch to configurable preference
    const [, storage] =
        Object.entries(storageMap).find(
            ([key]) => typeof w[key] !== "undefined"
        ) || [];

    class Store {
        static storage: Storage | AsyncStorage = storage || localStorage;

        static prefix = "bring-back-404";

        static clear(): void {
            const { storage, prefix } = this;
            storage.removeItem(prefix);
        }

        private static async open() {
            const { storage, prefix } = this;
            const val = await storage.getItem(prefix);
            return val ? JSON.parse(val) : {};
        }

        static async load<T>(key: string, def?: T): Promise<T> {
            const val = (await Store.open())[key];
            return val !== void 0 ? val : def;
        }

        static async save<T>(key: string, val: T) {
            const { storage, prefix } = this;
            const old = await Store.open();
            old[key] = val;
            return storage.setItem(prefix, JSON.stringify(old));
        }

        static async toggle(key: string) {
            return Store.save(key, !(await Store.load(key)));
        }

        static async remove(key: string) {
            const { prefix } = this;

            const old = await this.load<Record<string, any>>(prefix, {});
            delete old[key];

            return Store.save(key, old);
        }
    }

    /**
     * @summary creates config item element
     */
    const makeConfigItem = (id: string) => {
        const item = d.createElement("li");
        item.classList.add("-item");
        item.id = id;

        const { dataset } = item;
        dataset.action = "s-modal#toggle";

        const link = d.createElement("a");
        link.classList.add("-link");

        const text = d.createElement("strong");
        text.textContent = "404";

        link.append(text);
        item.append(link);
        return item;
    };

    /**
     * @see https://stackoverflow.design/product/components/inputs/
     * @summary makes Stacks text input
     */
    const makeStacksTextInput = (
        id: string,
        title: string,
        {
            classes = [],
            placeholder = "",
            value = "",
        }: StacksTextInputOptions = {}
    ) => {
        const wrap = d.createElement("div");
        wrap.classList.add("d-flex", "gs4", "gsy", "fd-column", ...classes);

        const lblWrap = d.createElement("div");
        lblWrap.classList.add("flex--item");

        const label = d.createElement("label");
        label.classList.add("d-block", "s-label");
        label.htmlFor = id;
        label.textContent = title;

        const inputWrap = d.createElement("div");
        inputWrap.classList.add("d-flex", "ps-relative");

        const input = d.createElement("input");
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

    /**
     * @see https://stackoverflow.design/product/resources/icons/
     * @summary makes Stacks 18 x 18 icon
     */
    const makeStacksIcon = (
        name: string,
        pathConfig: string,
        namespace = "http://www.w3.org/2000/svg"
    ) => {
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

    /**
     * @see https://github.com/StackExchange/Stacks-Icons/blob/production/build/lib/Icon/Globe.svg
     * @summary makes Stacks link icon
     */
    const makeLinkIcon = (url: string, title: string) => {
        const ns = "http://www.w3.org/2000/svg";

        const [svg, path] = makeStacksIcon(
            "iconGlobe",
            `M9 1C4.64 1 1 4.64 1 9c0 4.36 3.64 8 8 8 4.36 0 8-3.64 8-8
            0-4.36-3.64-8-8-8zM8 15.32a6.46 6.46 0 01-4.3-2.74 6.46 6.46
            0 0 1-.93-5.01L7 11.68v.8c0 .88.12 1.32 1
            1.32v1.52zm5.72-2c-.2-.66-1-1.32-1.72-1.32h-1v-2c0-.44-.56-1-1-1H6V7h1c.44
            0 1-.56 1-1V5h2c.88 0 1.4-.72 1.4-1.6v-.33a6.45 6.45 0 013.83 4.51 6.45 6.45
            0 0 1-1.51 5.73v.01z`,
            ns
        );

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

    /**
     * @summary adds userscript-specific styles
     */
    const addStyles = (d: Document) => {
        const style = d.createElement("style");
        d.head.append(style);
        const { sheet } = style;
        if (!sheet) return;

        /* make modal cursor reflect its draggable state */
        sheet.insertRule(".s-modal--dialog[draggable=true] { cursor: grab; }");

        /* dim bright styling of the globe icon */
        sheet.insertRule(
            ".iconGlobe path { fill: var(--black-400) !important; }"
        );
    };

    const makeDraggable = (id: string) => {
        d.addEventListener("dragstart", ({ dataTransfer }) => {
            const dummy = d.createElement("img");
            dummy.src = "data:image/png;base64,AAAAAA==";
            dataTransfer?.setDragImage(dummy, 0, 0);
        });

        let previousX = 0;
        let previousY = 0;
        let zeroed = 0;
        let isDragging = false;

        const handleCoordChange = ({ clientX, clientY }: MouseEvent) => {
            const modal = d.getElementById(id);
            if (!modal) return;

            previousX ||= clientX;
            previousY ||= clientY;

            let {
                style: { top, left },
            } = modal;

            //get computed styles the first time
            if (!top && !left) {
                const computed = uw.getComputedStyle(modal);
                top = computed.top;
                left = computed.left;
            }

            const moveX = clientX - previousX;
            const moveY = clientY - previousY;

            //either mouse went off-screen, or we got a Sonic the Hedgehog
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
            if (target === d.getElementById(id)) isDragging = true;
        });

        d.addEventListener("dragend", ({ target }) => {
            if (target === d.getElementById(id)) {
                isDragging = false;
                previousX = 0;
                previousY = 0;
            }
        });

        d.addEventListener("drag", (event) => {
            //if clientX zeroes out 3 times in a row, we are dealing with an FF bug
            zeroed = event.clientX ? 0 : zeroed < 3 ? zeroed + 1 : 3;

            if (zeroed >= 3 || !isDragging) return;
            return handleCoordChange(event);
        });

        d.addEventListener("dragover", (e) => {
            if (isDragging) e.preventDefault();
            //fixes this old FF bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
            if (zeroed < 3 || !isDragging) return;
            return handleCoordChange(e);
        });
    };

    /**
     * @summary creates config modal element
     */
    const makeConfigView = (id: string, configs: NotFoundConfig[]) => {
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
        form.classList.add(
            "s-modal--body",
            "d-flex",
            "flex__allcells6",
            "fw-wrap",
            "gs16"
        );

        form.addEventListener("change", ({ target }) => {
            const { id, value } = target as HTMLInputElement;

            const option = configs.find(({ site }) => site === id);

            option
                ? Object.assign(option, { imageURL: value })
                : configs.push(
                    new NotFoundConfig({
                        site: id,
                        imageURL: value,
                        url: l.hostname,
                    })
                );

            Store.save("overrides", configs);
        });

        const inputClasses = ["flex--item"];
        const inputs = configs.map(({ imageURL, site, label, notFoundURL }) => {
            const title = label || site;

            const [wrap, _input, lbl] = makeStacksTextInput(site, title, {
                value: imageURL,
                classes: inputClasses,
            });

            lbl.append(
                d.createTextNode(" "),
                makeLinkIcon(notFoundURL, `${title} 404 page`)
            );
            lbl.classList.add("mb8");
            return wrap;
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
        iconPath.setAttribute(
            "d",
            "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z"
        );

        closeIcon.append(iconPath);
        close.append(closeIcon);
        doc.append(title, form, close);
        wrap.append(doc);
        return wrap;
    };

    /**
     * @summary inserts custom 404 image into the page
     */
    const insert404Image = (d: Document, { imageURL }: NotFoundConfig) => {
        const image = d.createElement("img");
        image.src = imageURL;
        image.alt = "Page not found";
        image.decoding = "async";
        image.width = 250;
        image.style.display = "none";

        image.addEventListener("error", () =>
            console.debug(`failed to load 404 image on ${currentSite}`)
        );

        image.addEventListener("load", () => {
            const contentModal = d.getElementById("content");
            if (!contentModal) return console.debug("missing content modal");

            const alertImage = contentModal.querySelector(
                "svg.spotAlertXL, [alt='Page not found']"
            );
            if (!alertImage) return console.debug("missing 404 image");

            alertImage.replaceWith(image);
            image.style.display = "unset";

            const header = contentModal.querySelector("h1");
            if (!header) return console.debug("missing 404 header");

            //removes excessive top margin before header
            header.classList.remove("mt48");

            const flexWrap = header.closest(".d-flex");
            if (!flexWrap)
                return console.debug("404 content does't use Flexbox");

            //properly centers flex items vertically
            flexWrap.classList.replace("ai-start", "ai-center");
        });

        d.body.append(image);
    };

    /**
     * @summary adds a UI element for opening userscript config
     */
    const addConfigOptions = (configs: NotFoundConfig[]) => {
        const itemId = "bring-back-404";

        const menu = d.querySelector("ol.user-logged-in, ol.user-logged-out");
        if (!menu) return console.debug("failed to find main menu");

        const item = d.getElementById(itemId) || makeConfigItem(itemId);
        if (item.isConnected) return;

        menu.append(item);

        const uiId = "bring-back-404-config";

        item.addEventListener(
            "click",
            () => menu.append(makeConfigView(uiId, configs)),
            { once: true }
        );

        item.addEventListener("click", (event) => {
            event.preventDefault();
            const modal = d.getElementById(uiId);
            if (modal) uw.Stacks?.showModal(modal);
        });
    };

    interface NotFoundConfig extends NotFoundOptions {}
    class NotFoundConfig {
        constructor(options: NotFoundOptions) {
            Object.assign(this, options);
        }

        get notFoundURL() {
            const { site, url } = this;
            return url || `https://${site}.com/404`;
        }
    }

    const pageNotFounds: NotFoundConfig[] = [
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
    ].map((option) => new NotFoundConfig(option));

    const overrides = await Store.load<NotFoundOptions[]>("overrides", []);
    overrides.forEach((option) => {
        const defaults = pageNotFounds.find(({ site }) => site === option.site);
        if (!defaults) return pageNotFounds.push(new NotFoundConfig(option));
        Object.assign(defaults, option);
    });

    addStyles(d);
    addConfigOptions(pageNotFounds);

    const { hostname } = l;

    const currentSite = hostname.split(".").slice(0, -1).join(".");

    const config = pageNotFounds.find(({ site }) => site === currentSite);
    if (!config) return console.debug(`not on supported site: ${currentSite}`);

    insert404Image(d, config);
})(
    typeof unsafeWindow !== "undefined" ? unsafeWindow : window,
    window,
    document,
    location
);
