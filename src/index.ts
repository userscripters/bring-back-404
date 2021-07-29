((_w, d, l) => {
    type NotFoundOptions = {
        site: string;
        imageURL: string;
    };

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
    ];

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
