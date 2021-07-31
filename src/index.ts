type NotFoundOptions = {
    site: string;
    imageURL: string;
};

((_w, d, l) => {
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

    const pageNotFounds: NotFoundOptions[] = [
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

    const overrides = Store.load<NotFoundOptions[]>("overrides", []);
    overrides.forEach((option) => {
        const defaults = pageNotFounds.find(({ site }) => site === option.site);
        if (!defaults) return pageNotFounds.push(option);
        Object.assign(defaults, option);
    });

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

        const alertImage = contentModal.querySelector("svg.spotAlertXL");
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
})(window, document, location);
