"use strict";

let page = 0;
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
//store current article
let article_id;
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
    if (!navigator.onLine) {
    } else {
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
  dataSet.apps.forEach(function (value, index) {
    let data = dataSet.apps[index];
    let item_title = data.name;
    let item_summary = data.description;
    let item_link = data.download.url;
    let item_url;
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
    let images = "";

    if (data.meta.categories != "undefinedutility") {
      pep += data.meta.categories + ",";
    }

    if (data.screenshots != "") {
      images = data.screenshots.toString().split(",");
    }

    if (data.git_repo != "") {
      item_url = data.git_repo;
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
  searchGetData();
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
    document.querySelector("div#app").style.margin = "5px 0 0 0";
  } else {
    document.querySelector("div#navigation").style.display = "block";
    document.querySelector("div#app").style.margin = "30px 0 0 0";
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

document.querySelector("article#search").onfocus = function () {
  document.querySelector("article#search input").focus();
};

///////////////////////////
////RATING////////////////
//////////////////////////

let rating_stars = 0;
document
  .querySelector("div#rating-wrapper input.star")
  .addEventListener("keyup", function () {
    var val = Number(this.value);
    var i = 0;
    for (; i <= val; i++) {
      if (i > 0) {
        document.querySelector(`div#stars span:nth-child(${i})`).style.color =
          "yellow";
      }
    }
    for (; i <= 5; i++) {
      document.querySelector(`div#stars span:nth-child(${i})`).style.color =
        "white";
    }
    rating_stars = document.querySelector("div#rating-wrapper input.star")
      .value;
    document.querySelector("div#rating-wrapper input.star").value = "";
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

  data.ratings.forEach(function (item) {
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

    let app = document.activeElement;
    let elem_stars = document.createElement("div");
    elem_stars.classList.add("rating-points");
    elem_stars.textContent = stars;

    let elem_description = document.createElement("div");
    elem_description.classList.add("rating-description");
    elem_description.textContent = item.description;

    app.appendChild(elem_stars);
    app.appendChild(elem_description);
  });
}

jQuery(function () {
  init();

  ////////////////////
  ////SHOW ARTICLE///
  ///////////////////

  function show_article(app) {
    document.getElementById("app-panels-inner").style.height = "94vh";
    document.querySelector("div#app-panels-inner").scrollTo(0, 0);
    document.querySelector("div#app").style.margin = "0 0 0 0";

    article_id = document.activeElement.getAttribute("id");

    if (document.activeElement.getAttribute("class") != "About") {
      document.querySelector("div#navigation").style.display = "none";

      let elm1 = document.querySelectorAll("article");
      for (var i = 0; i < elm1.length; i++) {
        elm1[i].style.display = "none";
      }

      document.activeElement.style.display = "block";

      let elm2 = document.querySelectorAll("div.single-article");
      for (var i = 0; i < elm2.length; i++) {
        elm2[i].style.display = "block";
      }

      let elm3 = document.querySelectorAll("div.article-list");
      for (var i = 0; i < elm3.length; i++) {
        elm3[i].style.display = "none";
      }

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
    document.getElementById("app-panels-inner").style.height = "84vh";

    if (current_panel == 0) {
      document.querySelector("div#app").style.margin = "5px 0 0 0";
    }
    if (current_panel != 0) {
      document.querySelector("div#app").style.margin = "30px 0 0 0";
      $("div#navigation").css("display", "block");
    }
    document.getElementById("app-panels-inner").scrollTo(0, 0);

    document.getElementById(article_id).focus();

    let elm1 = document.querySelectorAll("article");
    for (var i = 0; i < elm1.length; i++) {
      elm1[i].style.display = "block";
    }

    let elm2 = document.querySelectorAll("div.single-article");
    for (var i = 0; i < elm2.length; i++) {
      elm2[i].style.display = "none";
    }

    let elm3 = document.querySelectorAll("div.article-list");
    for (var i = 0; i < elm3.length; i++) {
      elm3[i].style.display = "block";
    }

    panels_list(panels[current_panel]);
    $("div[class*=rating]").remove();

    bottom_bar("", "select", "about");
    window_status = "article-list";
  }

  //////////////////
  //download app///
  /////////////////

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
    document.querySelector("div#rating-wrapper").style.display = "block";
    document.querySelector("div#rating-wrapper input").focus();
    rating_stars = 0;
    get_userId();

    bottom_bar("send", "", "close");
    window_status = "rating";
  }

  function close_rating() {
    $("div#rating-wrapper").css("display", "none");
    $("div#rating-wrapper input").val("");
    $("div#rating-wrapper textarea").val("");
    rating_stars = 0;

    bottom_bar("", "", "");
    open_options();
  }

  function close_options() {
    $("div.options").css("display", "none");
    $("article#" + article_id).focus();
    $("div#navigation").css("display", "none");
    $("div.single-article").css("display", "block");
    $("div.article-list").css("display", "none");

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
    document.querySelector("div#about").style.display = "block";
    document.querySelector("div#about div#inner").focus();
    document.getElementById("top").scrollIntoView();
    article_id = document.activeElement.getAttribute("id");
    bottom_bar("", "", "");
    window_status = "about";
  }

  function close_about() {
    document.querySelector("div#about").style.display = "none";
    document.querySelector("article#search").focus();

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
    request.onerror = function (e) {
      console.log("Error calling getInstalled: " + request.error.name);
    };
    request.onsuccess = function (e) {
      var appsRecord = request.result;
      appsRecord[appsRecord.length - 1].launch();
    };
  }

  //////////////////////////
  ////KEYPAD TRIGGER////////////
  /////////////////////////

  function handleKeyDown(evt) {
    const isInSearchField = evt.target.id == "search" && evt.target.value != "";

    switch (evt.key) {
      case "Enter":
        if (window_status == "about" || window_status == "search") {
          break;
        }
        if (window_status == "article-list") {
          show_article(document.activeElement.getAttribute("data-slug"));
        }

        if (window_status == "options") {
          if (document.activeElement.hasAttribute("data-slug")) {
            open_rating();
          }
          if (document.activeElement.hasAttribute("data-url")) {
            open_url();
          }
        }
        break;

      case "ArrowDown":
        if (window_status == "about") {
          break;
        }

        if (window_status == "single-article") {
          document.querySelector("div#app-panels-inner").scrollBy(0, 15);
          break;
        }

        nav("+1");

        break;

      case "ArrowUp":
        if (window_status == "single-article") {
          document.querySelector("div#app-panels-inner").scrollBy(0, -15);
          break;
        }

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
          start_scan(function (callback) {
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
          close_about();
          show_article_list();
          break;
        }

        if (window_status == "scan") {
          evt.preventDefault();
          document.getElementById("qr-screen").hidden = false;
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
