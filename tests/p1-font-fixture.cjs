// Next's installed Google-font test hook: synthetic CSS, no network or font file.
module.exports = new Proxy(
  {},
  {
    get(_target, url) {
      if (
        typeof url !== "string" ||
        !url.startsWith("https://fonts.googleapis.com/css2?family=Geist")
      )
        return undefined;
      const family = url.includes("Geist+Mono") ? "Geist Mono" : "Geist";
      return `@font-face { font-family: '${family}'; src: url(https://fonts.gstatic.com/p1-synthetic.woff2) format('woff2'); font-weight: 100 900; font-style: normal; }`;
    },
  }
);
