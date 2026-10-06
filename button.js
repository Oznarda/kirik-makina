function r_degistir (isim,y_img)  {
        var yeni_img;
        yeni_img="gifs/"+ isim +y_img;
        document.images[isim].src=(yeni_img);     
 }

var siteRefreshStyles = document.createElement("link");
var viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content = "width=device-width, initial-scale=1";
        document.head.appendChild(viewportMeta);
}

siteRefreshStyles.rel = "stylesheet";
siteRefreshStyles.href = "site-refresh.css";
document.head.appendChild(siteRefreshStyles);

/* Page opened straight from a folder (file://): browsers send no Referer header from there and YouTube then refuses
   to play embedded videos ("Hata 153"). Show every video as its YouTube thumbnail with a link instead.
   On the real web site (http / https) this block does nothing. button.js is loaded in <head>, so the observer swaps
   each iframe the moment the parser creates it, before it starts loading. */
(function () {
        if (window.location.protocol !== "file:") return;
        var english = /-en\.html$/i.test(decodeURIComponent(window.location.pathname.split("/").pop() || ""));
        var ytStyle = document.createElement("style");
        ytStyle.textContent = ".yt-local{position:absolute;inset:0;display:block;background:#0b2233;color:#fff;text-decoration:none}" +
                ".yt-local img{display:block;width:100%;height:100%;object-fit:cover}" +
                ".yt-local span{position:absolute;left:12px;bottom:12px;display:inline-flex;align-items:center;gap:9px;padding:9px 15px 9px 13px;border-radius:999px;background:rgba(0,0,0,.74);font-family:inherit;font-size:14px;font-weight:700;line-height:1}" +
                ".yt-local span:before{content:'';border-style:solid;border-width:6px 0 6px 10px;border-color:transparent transparent transparent #fff}" +
                ".yt-local:hover span,.yt-local:focus-visible span{background:#c4302b}";
        document.head.appendChild(ytStyle);
        function swapVideo(frame) {
                var id = /\/embed\/([\w-]+)/.exec(frame.getAttribute("src") || "");
                if (!id || !frame.parentNode) return;
                var link = document.createElement("a");
                link.className = "yt-local";
                link.href = "https://www.youtube.com/watch?v=" + id[1];
                link.target = "_blank";
                link.rel = "noopener";
                link.setAttribute("aria-label", (frame.getAttribute("title") || "") + " - YouTube");
                link.innerHTML = '<img src="https://i.ytimg.com/vi/' + id[1] + '/hqdefault.jpg" alt=""><span>' + (english ? "Watch on YouTube" : "YouTube'da izle") + '</span>';
                frame.parentNode.replaceChild(link, frame);
        }
        function swapAll(root) {
                if (root.matches && root.matches('iframe[src*="youtube"]')) swapVideo(root);
                else if (root.querySelectorAll) root.querySelectorAll('iframe[src*="youtube"]').forEach(swapVideo);
        }
        new MutationObserver(function (records) {
                records.forEach(function (record) {
                        record.addedNodes.forEach(function (node) {
                                if (node.nodeType === 1) swapAll(node);
                        });
                });
        }).observe(document.documentElement, { childList: true, subtree: true });
        document.addEventListener("DOMContentLoaded", function () { swapAll(document); });
})();

document.addEventListener("DOMContentLoaded", function () {
        var currentFile = decodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
        var isEnglish = /-en\.html$/i.test(currentFile);
        var baseFile = currentFile.replace(/-en\.html$/i, ".html");
        var pairedPages = /^(index|kirikmakina|iletisim|referanslar|makina\d+|urunler)\.html$/i;
        var turkishPage = isEnglish ? baseFile : currentFile;
        var englishPage = isEnglish ? currentFile : (pairedPages.test(currentFile) ? currentFile.replace(/\.html$/i, "-en.html") : "index-en.html");
        var labels = isEnglish
                ? { home: "Home", company: "Company", products: "Products", references: "References", contact: "Contact", menuOpen: "Open navigation menu", menuClose: "Close navigation menu" }
                : { home: "Ana Sayfa", company: "Kurumsal", products: "\u00DCr\u00FCnler", references: "Referanslar", contact: "\u0130leti\u015Fim", menuOpen: "Men\u00FCy\u00FC a\u00E7", menuClose: "Men\u00FCy\u00FC kapat" };
        var header = document.createElement("header");
        header.className = "site-header";
        header.innerHTML = '<div class="site-header-inner">' +
                '<a class="site-brand" href="' + (isEnglish ? "index-en.html" : "index.html") + '"><img class="site-brand-logo" src="images/logo-kms.png" alt="" width="52" height="52"><span><span class="site-brand-name">Kirik Makina</span><span class="site-brand-caption" lang="en">Industrial Machinery</span></span></a>' +
                '<nav id="site-navigation" class="site-nav" aria-label="Primary navigation">' +
                '<a href="' + (isEnglish ? "index-en.html" : "index.html") + '">' + labels.home + '</a>' +
                '<a href="' + (isEnglish ? "kirikmakina-en.html" : "kirikmakina.html") + '">' + labels.company + '</a>' +
                '<a href="' + (isEnglish ? "urunler-en.html" : "urunler.html") + '">' + labels.products + '</a>' +
                '<a href="' + (isEnglish ? "referanslar-en.html" : "referanslar.html") + '">' + labels.references + '</a>' +
                '<a href="' + (isEnglish ? "iletisim-en.html" : "iletisim.html") + '">' + labels.contact + '</a>' +
                '</nav><div class="site-language" aria-label="Language">' +
                '<a href="' + turkishPage + '" lang="tr" aria-label="T\u00FCrk\u00E7e" aria-current="' + (!isEnglish) + '">TR</a>' +
                '<a href="' + englishPage + '" lang="en" aria-label="English" aria-current="' + isEnglish + '">EN</a>' +
                '</div><button class="site-menu-toggle" type="button" aria-label="' + labels.menuOpen + '" aria-expanded="false" aria-controls="site-navigation">' +
                '<span></span><span></span><span></span></button></div>';
        document.body.insertBefore(header, document.body.firstChild);

        /* Same header font on every page (the home page gets Verdana from css.css, other pages do not) */
        var hdrStyle = document.createElement("style");
        hdrStyle.textContent = ".site-header a,.site-header summary,.site-header button{font-family:Verdana,Geneva,Arial,Helvetica,sans-serif !important}";
        document.head.appendChild(hdrStyle);

        /* Floating WhatsApp button: opens a chat with a prefilled message. The visitor must press Send themselves. */
        var waStyle = document.createElement("style");
        waStyle.textContent = ".wa-float{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:1500;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#25d366;color:#fff !important;box-shadow:0 6px 18px rgba(0,0,0,.25);text-decoration:none !important;transition:transform .2s ease,box-shadow .2s ease}.wa-float:hover{transform:scale(1.08);box-shadow:0 8px 22px rgba(0,0,0,.3)}.wa-float:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px #25d366}.wa-float svg{width:26px;height:26px;fill:currentColor}@media print{.wa-float{display:none}}@media (prefers-reduced-motion:reduce){.wa-float{transition:none}}";
        document.head.appendChild(waStyle);
        var waText = isEnglish ? "Hello, could you help me get some information?" : "Merhaba, bilgi almak için yardımcı olabilir misiniz?";
        var wa = document.createElement("a");
        wa.className = "wa-float";
        wa.href = "https://wa.me/905388425501?text=" + encodeURIComponent(waText);
        wa.target = "_blank";
        wa.rel = "noopener";
        wa.setAttribute("aria-label", isEnglish ? "Chat with us on WhatsApp" : "WhatsApp ile bize yazın");
        wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
        (document.querySelector(".home-main") || document.body).appendChild(wa);

        if (document.body.classList.contains("home-page")) {
                var updateHomeHeaderHeight = function () {
                        header.style.setProperty("--home-header-height", header.getBoundingClientRect().height + "px");
                };
                updateHomeHeaderHeight();
                if ("ResizeObserver" in window) {
                        new ResizeObserver(updateHomeHeaderHeight).observe(header);
                } else {
                        window.addEventListener("resize", updateHomeHeaderHeight);
                }
        }

        var languageMap = document.querySelector('map[name="home_ust"]');
        if (languageMap) {
                var languageAreas = languageMap.querySelectorAll("area");
                if (languageAreas[0]) languageAreas[0].href = turkishPage;
                if (languageAreas[1]) languageAreas[1].href = englishPage;
        }

        var englishReferencesLink = document.querySelector('img[name="c04"]');
        if (isEnglish && englishReferencesLink && englishReferencesLink.parentNode) {
                englishReferencesLink.parentNode.href = "referanslar-en.html";
        }

        header.querySelectorAll(".site-nav > a").forEach(function (link) {
                if (link.getAttribute("href") === currentFile || (/^makina\d+(-en)?\.html$/i.test(currentFile) && /^urunler/.test(link.getAttribute("href")))) link.setAttribute("aria-current", "page");
        });

        var menuToggle = header.querySelector(".site-menu-toggle");
        var siteNavigation = header.querySelector(".site-nav");
        function setMobileMenuOpen(isOpen) {
                header.classList.toggle("menu-open", isOpen);
                menuToggle.setAttribute("aria-expanded", String(isOpen));
                menuToggle.setAttribute("aria-label", isOpen ? labels.menuClose : labels.menuOpen);
        }
        menuToggle.addEventListener("click", function () {
                setMobileMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
        });
        siteNavigation.addEventListener("click", function (event) {
                if (event.target.closest && event.target.closest("a")) setMobileMenuOpen(false);
        });
        document.addEventListener("click", function (event) {
                if (!header.contains(event.target)) setMobileMenuOpen(false);
        });
        document.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                        setMobileMenuOpen(false);
                        menuToggle.focus();
                }
        });
        window.addEventListener("resize", function () {
                if (window.innerWidth >= 768) setMobileMenuOpen(false);
        });

        var homePage = document.querySelector(".home-page");
        if (homePage && "IntersectionObserver" in window &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                var revealSections = homePage.querySelectorAll(
                        ".home-products, .home-company, .home-video, .home-contact"
                );
                var revealObserver = new IntersectionObserver(function (entries, observer) {
                        entries.forEach(function (entry) {
                                if (entry.isIntersecting) {
                                        entry.target.classList.add("home-revealed");
                                        observer.unobserve(entry.target);
                                }
                        });
                }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

                revealSections.forEach(function (section) {
                        section.classList.add("home-reveal");
                        revealObserver.observe(section);
                });
        }
});

  Sakli0=new Image(108, 51);
  Sakli0.src=("gifs/b01_2.gif");
  Sakli1=new Image(141, 51);
  Sakli1.src=("gifs/b02_2.gif");
  Sakli2=new Image(167, 51);
  Sakli2.src=("gifs/b03_2.gif");
  Sakli3=new Image(174, 51);
  Sakli3.src=("gifs/b04_2.gif");
  Sakli4=new Image(124, 51);
  Sakli4.src=("gifs/b05_2.gif");