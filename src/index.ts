type NotFoundOptions = {
    label?: string;
    site: string;
    imageURL: string;
};

type StacksTextInputOptions = {
    classes?: string[];
    placeholder?: string;
    value?: string;
};

interface Window {
    Stacks: typeof Stacks;
}

((w, d, l) => {
    class Store {
        static storage: Storage = localStorage;

        static prefix = "bring-back-404";

        static clear(): void {
            const { storage, prefix } = this;
            storage.removeItem(prefix);
        }

        private static open() {
            const { storage, prefix } = this;
            const val = storage.getItem(prefix);
            return val ? JSON.parse(val) : {};
        }

        static load<T>(key: string, def?: T): T {
            const val = Store.open()[key];
            return val !== void 0 ? val : def;
        }

        static save<T>(key: string, val: T): void {
            const { storage, prefix } = this;
            const old = Store.open();
            old[key] = val;
            storage.setItem(prefix, JSON.stringify(old));
        }

        static toggle(key: string) {
            return Store.save(key, !Store.load(key));
        }

        static remove(key: string): void {
            const { prefix } = this;

            const old = this.load<Record<string, any>>(prefix, {});
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

        return [wrap, input];
    };

    /**
     * @summary creates config modal element
     */
    const makeConfigView = (id: string, configs: NotFoundOptions[]) => {
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
        doc.classList.add("s-modal--dialog", "ps-relative");
        doc.setAttribute("role", "document");

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
                : configs.push({ site: id, imageURL: value });

            Store.save("overrides", configs);
        });

        const inputClasses = ["flex--item"];
        const inputs = configs.map(({ imageURL, site, label }) => {
            return makeStacksTextInput(site, label || site, {
                value: imageURL,
                classes: inputClasses,
            })[0];
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
     * @summary adds a UI element for opening userscript config
     */
    const addConfigOptions = (configs: NotFoundOptions[]) => {
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
            if (modal) w.Stacks?.showModal(modal);
        });
    };

    const pageNotFounds: NotFoundOptions[] = [
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

    const overrides = Store.load<NotFoundOptions[]>("overrides", []);
    overrides.forEach((option) => {
        const defaults = pageNotFounds.find(({ site }) => site === option.site);
        if (!defaults) return pageNotFounds.push(option);
        Object.assign(defaults, option);
    });

    addConfigOptions(pageNotFounds);

    const { hostname } = l;

    const currentSite = hostname.split(".").slice(0, -1).join(".");

    const config = pageNotFounds.find(({ site }) => site === currentSite);
    if (!config) return console.debug(`not on supported site: ${currentSite}`);

    const { imageURL } = config;

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
        if (!flexWrap) return console.debug("404 content does't use Flexbox");

        //properly centers flex items vertically
        flexWrap.classList.replace("ai-start", "ai-center");
    });

    d.body.append(image);
})(
    typeof unsafeWindow !== "undefined" ? unsafeWindow : window,
    document,
    location
);
