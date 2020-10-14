"use strict";

let page = 0;
let pos_focus = 0;
let article_array;
let tabindex_i = -0;
let window_status = "article-list";
let dataSet;
let panels = ["All"];
let current_panel = 0;
let app_slug;
let offline = false;
let apps_data = new Array();
let update_time;
let apps_rating = new Array();
let co;
let contributors = new Array();

//////////////////////////////
//fetch-database////
//////////////////////////////

function init() {
    BackendApi.setStatusCallback(toaster);

    function loadData() {
        dataSet = BackendApi.getData();
        addAppList(addAppList_callback);
        document.querySelector("div#message-box").style.animationPlayState =
            "running";
        document.querySelector(
            "div#message-box img.icon-2"
        ).style.animationPlayState = "running";
        document.querySelector(
            "div#message-box img.icon-1"
        ).style.animationPlayState = "running";
        document.querySelector("div#message-box div").style.display = "none";
    }

    DownloadCounter.load().then((_) => {
        const apps_article = document.querySelectorAll("div#apps article");
        for (let i = 0; i < apps_article.length; i++) {
            const appId = apps_article[i].getAttribute("data-slug");

            if (appId) {
                const dl_section = apps_article[i].querySelector("div.dl-cnt");
                const count = DownloadCounter.getForApp(appId);
                dl_section.innerHTML = "<span>Downloads </span>" + count;

                if (dl_section && count !== -1) {
                    dl_section.innerHTML = "<span>Downloads </span>" + count;
                }
            }
        }
    });

    if (!BackendApi.getData()) {
        if (!navigator.onLine) {} else {
            BackendApi.update()
                .then(loadData)
                .catch((error) => {
                    console.log(error);
                    toaster(error instanceof Error ? error.message : error, 3000);
                });
        }
    } else {
        if (navigator.onLine) {
            BackendApi.update()
                .then(loadData)
                .catch((error) => {
                    console.log(error);
                    toaster(error instanceof Error ? error.message : error, 3000);
                    loadData();
                });
        } else {
            offline = true;
            toaster(
                "<br> your device is offline, you can view the app but you cannot install it.",
                3000
            );

            loadData();
        }
    }
}

contributors = ["40min"];
let pep = new Array();
let counter = 0;

function addAppList(callback) {
    dataSet.apps.forEach(function(value, index) {
        let data = dataSet.apps[index];
        let item_title = data.name;
        let item_summary = data.description;
        let item_link = data.download.url;
        let item_url = data.git_repo;
        let item_donation = data.donation;
        let item_ads = data.has_ads;
        let item_tracking = data.has_tracking;
        let tag = data.meta.categories;
        let item_category = data.meta.categories.toString().replace(",", " ");
        let item_tags = tag.toString().replace(",", " ");
        let item_author = data.author.toString();
        let item_icon = data.icon;
        let item_license = data.license;
        let item_type = data.type;
        let donation_icon = "none";
        let item_slug = data.slug;
        let images = data.screenshots.toString().split(",");
        if (data.meta.categories != "undefinedutility") {
            pep += data.meta.categories + ",";
        }

        //unique author list
        let just_author_name = item_author.split("<")[0].trim();
        if (contributors.indexOf(just_author_name) === -1) {
            contributors.push(just_author_name);
        }

        if (item_donation == "") {
            donation_icon = "no";
        } else {
            donation_icon = "yes";
        }

        if (item_ads) {
            item_ads = "yes";
        } else {
            item_ads = "no";
        }

        if (item_tracking) {
            item_tracking = "yes";
        } else {
            item_tracking = "no";
        }

        counter++;
        apps_data.push({
            images: images,
            title: item_title,
            author: item_author,
            summary: item_summary,
            category: item_category,
            link: item_link,
            license: item_license,
            ads: item_ads,
            donation_url: item_donation,
            donation: donation_icon,
            tracking: item_tracking,
            type: item_type,
            summarie: item_summary,
            icon: item_icon,
            slug: item_slug,
            tags: item_tags,
            url: item_url,
            index: counter,
        });
    });

    update_time = moment(dataSet.generated_at).format("DD.MM.YYYY, HH:mm");
    co = contributors.sort().join(", ");

    callback("done");
}

function addAppList_callback(data) {
    //categories - panels
    pep = pep.split(",");
    pep.forEach((c) => {
        if (!panels.includes(c)) {
            panels.push(c);
        }
    });
    panels.pop(panels.length);

    document.querySelector("#update").textContent = update_time;
    document.querySelector(
        "div#about div#inner div#contributors"
    ).textContent = co;
    document.querySelector("article#search input").focus();

    bottom_bar("", "select", "about");
    renderHello();
}

////////////////////////
////SET TABINDEX////////
///////////////////////

function set_tabindex() {
    let articles_panel = document.querySelectorAll("article");

    focused = 0;

    var tab = 0;
    for (let i = 0; i < articles_panel.length; i++)
        if (articles_panel[i].style.display === "block") {
            tab++;
            articles_panel[i].setAttribute("tabindex", tab);
        } else {
            articles_panel[i].removeAttribute("tabindex");
        }

    let focusme = document.querySelectorAll("article[tabindex]");
    focusme[0].focus();
}

//////////////////////////
////WRITE HTML LIST///////
//////////////////////////

function renderHello() {
    var template = document.getElementById("template").innerHTML;
    var rendered = Mustache.render(template, { data: apps_data });
    document.getElementById("apps").innerHTML = rendered;
}

//////////////////////////
//////PANELS//////////////
//////////////////////////

function panels_list(panel) {
    let articles = document.querySelectorAll("article");

    let elements = document.getElementsByClassName(panel);

    for (let k = 0; k < articles.length; k++) {
        articles[k].style.display = "none";
    }

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
    }
    set_tabindex();
}

////////////////////////
//NAVIGATION///////////
/////////////////////////

function nav_panels(left_right) {
    window.scrollTo(0, 0);
    focused = 0;

    if (left_right == "left") {
        current_panel--;
    }

    if (left_right == "right") {
        current_panel++;
    }

    current_panel = current_panel % panels.length;
    if (current_panel < 0) {
        current_panel += panels.length;
    }

    document.querySelector("div#navigation div").textContent =
        panels[current_panel];
    panels_list(panels[current_panel]);

    if (current_panel == 0) {
        document.querySelector("input").focus();
        document.querySelector("div#navigation").style.display = "none";
    } else {
        document.querySelector("div#navigation").style.display = "block";
    }
}

//up - down
let focused = 0;
let st = 0;

function nav(param) {
    let articles;

    if (window_status == "article-list" || window_status == "search") {
        articles = document.querySelectorAll("article[tabindex]");
    }

    if (window_status == "options") {
        let k = document.activeElement.parentElement.id;
        articles = document.getElementById(k).children;
    }

    if (window_status == "rating") {
        let k = document.activeElement.parentElement.children;
        articles = k;
    }

    if (param == "+1" && focused < articles.length - 1) {
        focused++;
        articles[focused].focus();
        st += 10;

        var scrollDiv = articles[focused].offsetTop + 20;
        window.scrollTo({ top: scrollDiv, behavior: "smooth" });
    }

    if (param == "-1" && focused > 0) {
        focused--;
        articles[focused].focus();

        var scrollDiv = articles[focused].offsetTop + 30;
        window.scrollTo({ top: scrollDiv, behavior: "smooth" });
    }


}

jQuery(function() {
    init();


    document.querySelector('article#search').onfocus = function() {
        document.querySelector('article#search input').focus()
        document.querySelector("article#search").style.margin = "135px 0 0 0!Important";


    };



    searchGetData();


    ////////////////////
    ////SHOW ARTICLE///
    ///////////////////

    //store current article
    let article_id;

    function show_article(app) {
        $("article").css("display", "none");

        window.scrollTo({ top: 0, behavior: "smooth" });
        let $focused;
        if (app) {
            $focused = $('[data-slug="' + app + '"]');
            $('[data-slug="' + app + '"]').focus();
        } else {
            $focused = $(":focus");
        }

        article_id = $focused.attr("id");

        if ($focused.attr("class") != "About") {
            $("article").css("display", "none");

            $focused.css("display", "block");

            $("div#navigation").css("display", "none");
            //$("div#app div#app-panels").css("margin", "5px 0 0 0");
            //$("div#app div#app-panels").css("max-height", "100%");
            $("div.single-article").css("display", "block");
            $("div.article-list").css("display", "none");
            if (!offline) {
                bottom_bar("options", "", "install");
            } else {
                bottom_bar("", "", "");
            }
            //get ratinngs
            get_ratings($("#" + article_id).data("slug"), ratings_callback);

            window_status = "single-article";
        }
    }

    /////////////////////
    ///SHOW ARTICLE-LIST
    ////////////////////

    function show_article_list() {
        $("#" + article_id).focus();
        document.getElementById(article_id).scrollIntoView();

        if (article_id == "search") {
            $("input#search").focus();
        }

        if (article_id !== "search") {
            $("#" + article_id).focus();
        }

        if (current_panel != 0) {
            $("div#navigation").css("display", "block");
        }

        panels_list(panels[current_panel]);
        //$("div#app div#app-panels div#apps").css("margin", "5px 0 50px 0px");
        document.querySelector("article#search").style.margin = "135px 0 0 0!Important";


        $("div#options").css("display", "none");

        $("div#app-panels").css("display", "block");
        $("div.single-article").css("display", "none");
        $("div.article-list").css("display", "block");
        $("div.rating-item").remove();
        bottom_bar("", "select", "about");
        window_status = "article-list";
    }

    function install_app() {
        if (!offline) {
            let link_target = "";
            let targetElement = $(":focus");
            link_target = $(targetElement).data("download");
            app_slug = $(targetElement).data("slug");
            download_file(link_target);
        }
    }

    function open_url() {
        let targetElement = $(":focus");
        let link_target = $(targetElement).data("url");
        window.open(link_target, "_self ");
    }

    function open_rating() {
        $("div#rating-wrapper").css("display", "block");
        document.querySelector("div#rating-wrapper input").focus();
        $("div#stars span").css("color", "white");
        rating_stars = 0;
        bottom_bar("send", "", "close");
        window_status = "rating";
    }

    function close_rating() {
        $("div#rating-wrapper").css("display", "none");
        bottom_bar("", "", "");
        $("div#rating-wrapper input").val("");
        $("div#rating-wrapper textarea").val("");
        rating_stars = 0;
        open_options();
    }

    function close_options() {
        $("div.options").css("display", "none");
        $("article#" + article_id).focus();
        $("div#navigation").css("display", "none");
        $("div.summary").css("display", "block");
        $("div.meta-data").css("display", "block");
        $("div.icon").css("display", "block");
        $("div.channel").css("display", "none");
        $("ul.images").css("display", "block");
        bottom_bar("options", "", "install");
        window_status = "single-article";
    }

    function open_options() {
        $("div.options").css("display", "none");
        focused = 0;
        $("article#" + article_id)
            .next()
            .css("display", "block");
        $("article#" + article_id)
            .next()
            .children()
            .first()
            .focus();

        bottom_bar("", "", "");
        window_status = "options";
    }

    function open_about() {
        article_id = $(":focus").attr("id");
        document.querySelector("div#about").style.display = "block";
        document.querySelector("div#about div#inner").focus();
        document.getElementById("top").scrollIntoView();

        bottom_bar("", "", "");
        window_status = "about";
    }

    const search_listener = document.querySelector("article#search input");

    search_listener.addEventListener("focus", (event) => {
        bottom_bar("scan", "select", "about");
        window.scrollTo(0, 0);
        window_status = "search";
    });

    search_listener.addEventListener("blur", (event) => {
        bottom_bar("", "select", "about");
        window_status = "article-list";
    });

    ///launch app after installation

    function launch_app() {
        var request = window.navigator.mozApps.mgmt.getAll();
        request.onerror = function(e) {
            console.log("Error calling getInstalled: " + request.error.name);
        };
        request.onsuccess = function(e) {
            var appsRecord = request.result;
            appsRecord[appsRecord.length - 1].launch();
        };
    }

    ///////////////////////////
    ////RATING////////////////
    //////////////////////////

    let rating_stars = 0;

    let stars_listener = document.querySelector("div#rating-wrapper input.star");

    stars_listener.addEventListener("blur", (event) => {
        document.querySelector("div#stars").style.fontSize = "0.8rem";

        stars_listener.value = "";
    });

    stars_listener.addEventListener("focus", (event) => {
        document.querySelector("div#stars").style.fontSize = "1rem";
    });

    window.addEventListener("keyup", (event) => {
        switch (stars_listener.value) {
            case "0":
                $("div#stars span:nth-child(1)").css("color", "white");
                $("div#stars span:nth-child(2)").css("color", "white");
                $("div#stars span:nth-child(3)").css("color", "white");
                $("div#stars span:nth-child(4)").css("color", "white");
                $("div#stars span:nth-child(5)").css("color", "white");
                rating_stars = 0;
                stars_listener.value = "";

                break;
            case "1":
                $("div#stars span:nth-child(1)").css("color", "yellow");
                $("div#stars span:nth-child(2)").css("color", "white");
                $("div#stars span:nth-child(3)").css("color", "white");
                $("div#stars span:nth-child(4)").css("color", "white");
                $("div#stars span:nth-child(5)").css("color", "white");
                rating_stars = 1;
                stars_listener.value = "";

                break;
            case "2":
                $("div#stars span:nth-child(1)").css("color", "yellow");
                $("div#stars span:nth-child(2)").css("color", "yellow");
                $("div#stars span:nth-child(3)").css("color", "white");
                $("div#stars span:nth-child(4)").css("color", "white");
                $("div#stars span:nth-child(5)").css("color", "white");
                rating_stars = 2;
                stars_listener.value = "";

                break;
            case "3":
                $("div#stars span:nth-child(1)").css("color", "yellow");
                $("div#stars span:nth-child(2)").css("color", "yellow");
                $("div#stars span:nth-child(3)").css("color", "yellow");
                $("div#stars span:nth-child(4)").css("color", "white");
                $("div#stars span:nth-child(5)").css("color", "white");
                rating_stars = 3;
                stars_listener.value = "";

                break;
            case "4":
                $("div#stars span:nth-child(1)").css("color", "yellow");
                $("div#stars span:nth-child(2)").css("color", "yellow");
                $("div#stars span:nth-child(3)").css("color", "yellow");
                $("div#stars span:nth-child(4)").css("color", "yellow");
                $("div#stars span:nth-child(5)").css("color", "white");
                rating_stars = 4;
                stars_listener.value = "";

                break;
            case "5":
                $("div#stars span:nth-child(1)").css("color", "yellow");
                $("div#stars span:nth-child(2)").css("color", "yellow");
                $("div#stars span:nth-child(3)").css("color", "yellow");
                $("div#stars span:nth-child(4)").css("color", "yellow");
                $("div#stars span:nth-child(5)").css("color", "yellow");
                rating_stars = 5;
                stars_listener.value = "";

                break;
        }
    });

    function xhr_callback(data) {
        if (data == 201) {
            toaster("Thank you for your rating!", 3000);
            close_rating();
        }
        if (data == 400) {
            toaster("I can't send anything without a rating", 3000);
        }
        if (data == 409) {
            toaster("You already posted a review for this app", 3000);
        }
        if (data == "Network Error") {
            toaster("Network Error", 3000);
        }
    }

    ////////////////////
    ///Read Rating/////
    ///////////////////

    function ratings_callback(data) {
        if (data.ratings.length > 0) {
            apps_data.push([data.appid, data.ratings]);
        }

        data.ratings.forEach(function(item) {
            let stars = "";
            switch (item.points) {
                case 0:
                    stars = "";
                    break;
                case 1:
                    stars = "★";
                    break;
                case 2:
                    stars = "★ ★";
                    break;
                case 3:
                    stars = "★ ★ ★";
                    break;
                case 4:
                    stars = "★ ★ ★ ★";
                    break;
                case 5:
                    stars = "★ ★ ★  ★  ★";
                    break;
            }

            let temp = document.createElement("div");
            temp.innerHTML = item.description;
            let description = temp.textContent || temp.innerText;

            $("#" + article_id).append(
                "<div class='rating-item'><div><div class='points'>" +
                stars +
                "</div></div><div>" +
                description +
                "</div></div>"
            );
        });
    }

    //////////////////////////
    ////KEYPAD TRIGGER////////////
    /////////////////////////

    function handleKeyDown(evt) {
        const isInSearchField = evt.target.id == "search" && evt.target.value != "";

        switch (evt.key) {
            case "Enter":
                if (window_status == "article-list") {
                    show_article();
                }

                if (window_status == "options") {
                    if ($(":focus").attr("tabindex") === "1") {
                        open_rating();
                    }
                    if (
                        $(":focus").attr("tabindex") == "2" ||
                        $(":focus").attr("tabindex") == "3"
                    ) {
                        open_url();
                    }
                }
                break;

            case "ArrowDown":
                if (window_status == "about") {
                    break;
                }

                if (window_status == "single-article") {
                    break;
                }

                nav("+1");

                break;

            case "ArrowUp":
                if (window_status == "about") {
                    break;
                }
                if (window_status == "single-article") {
                    break;
                }

                nav("-1");

                break;

            case "ArrowLeft":
                if (isInSearchField) {
                    evt.preventDefault;
                    break;
                }
                if (evt.target.id == "search" && evt.target.value == "") {
                    nav_panels("left");
                    break;
                }

                if (window_status == "article-list") {
                    nav_panels("left");
                }
                break;

            case "ArrowRight":
                if (isInSearchField) break;

                if (evt.target.id == "search" && evt.target.value == "") {
                    nav_panels("right");
                    break;
                }
                if (window_status == "article-list") {
                    nav_panels("right");
                }

                break;

            case "8":
            case "SoftLeft":
                if (window_status == "search") {
                    start_scan(function(callback) {
                        let slug = callback.replace("bhackers:", "");
                        show_article(slug);
                    });

                    bottom_bar("", "", "");
                    window_status = "scan";
                }

                if (window_status == "rating") {
                    //sanitizer
                    let body = $("div#rating-wrapper textarea").val(),
                        temp = document.createElement("div");
                    temp.innerHTML = body;
                    let comment = temp.textContent || temp.innerText;

                    send_rating(
                        get_userId(),
                        get_userId(),
                        $("#" + article_id).data("slug"),
                        $("#" + article_id).data("name"),
                        Number(rating_stars),
                        comment,
                        xhr_callback
                    );

                    break;
                }

                if (window_status == "single-article") {
                    open_options();
                    break;
                }

            case "9":
            case "SoftRight":
                if (window_status == "article-list" || window_status == "search") {
                    open_about();
                    break;
                }

                if (window_status == "single-article") {
                    install_app();
                    break;
                }

                if (window_status == "post_installation") {
                    launch_app();
                    break;
                }
                if ((window_status = "rating")) {
                    close_rating();
                    break;
                }

                break;

            case "Backspace":
                if (isInSearchField) break;
                if (evt.target.id == "search" && evt.target.value == "") {
                    evt.preventDefault();

                    $("article:not(article#search)").css("display", "block");
                }

                if (
                    window_status == "single-article" ||
                    window_status == "post_installation"
                ) {
                    evt.preventDefault();

                    show_article_list();
                    break;
                }

                if (window_status == "about") {
                    evt.preventDefault();

                    $("div#about").css("display", "none");
                    show_article_list();

                    break;
                }

                if (window_status == "scan") {
                    evt.preventDefault();

                    document.getElementById("qr-screen").hidden = true;
                    show_article_list();


                    break;
                }

                if (window_status == "options") {
                    evt.preventDefault();

                    close_options();
                    break;
                }
                if (
                    window_status == "article-list" &&
                    !$("input#search").is(":focus")
                ) {
                    window.close();
                }
                break;
        }
    }

    document.addEventListener("keydown", handleKeyDown);
});