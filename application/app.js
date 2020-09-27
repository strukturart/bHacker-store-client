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

$(document).ready(function () {
  //////////////////////////////
  //fetch-database////
  //////////////////////////////

  function init() {
    BackendApi.setStatusCallback(toaster);

    function loadData() {
      dataSet = BackendApi.getData();
      addAppList();
      addCategories();

      $("div#message-box").css("animation-play-state", "running");
      $("div#message-box img.icon-2").css("animation-play-state", "running");
      $("div#message-box img.icon-1").css("animation-play-state", "running");
      $("div#message-box div").css("display", "none");

      DownloadCounter.load().then((_) => {
        const apps = document.querySelectorAll(".APP");
        apps.forEach((app) => {
          const appId = app.getAttribute("data-slug");

          if (appId) {
            const dl_section = app.querySelector("div.dl-cnt");
            const count = DownloadCounter.getForApp(appId);

            if (dl_section && count !== -1) {
              dl_section.innerHTML = "<span>Downloads </span>" + count;
            }
          }
        });
      });
    }

    if (!BackendApi.getData()) {
      if (!navigator.onLine) {
      } else {
        BackendApi.update()
          .then(loadData)
          .catch((error) => {
            console.log(error);
            toaster(error instanceof Error ? error.message : error);
          });
      }
    } else {
      if (navigator.onLine) {
        BackendApi.update()
          .then(loadData)
          .catch((error) => {
            console.log(error);
            toaster(error instanceof Error ? error.message : error);
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

  let contributors = ["40min"];

  function addAppList() {
    let i = 0;

    $.when(
      dataSet.apps.forEach(function (value, index) {
        let data = dataSet.apps[index];
        let item_title = data.name;
        let item_summary = data.description;
        let item_link = data.download.url;
        let item_url = data.git_repo;
        let donation = data.donation;
        let ads = data.has_ads;
        let tracking = data.has_tracking;
        let str = data.meta.categories;
        let tag = data.meta.categories;
        let item_categorie = str.toString().replace(",", " ");
        let item_tags = tag.toString().replace(",", " ");
        let item_author = data.author.toString();
        let item_icon = data.icon;
        let item_license = data.license;
        let item_type = data.type;
        let images = "";
        let images_collection = "";
        let donation_icon = "none";
        let ads_icon = "none";
        let tracking_icon = "none";
        let item_slug = data.slug;
        //i++;
        let elem_id = "elem-" + index;

        //unique author list
        const just_author_name = item_author.split("<")[0].trim();
        if (contributors.indexOf(just_author_name) === -1) {
          contributors.push(just_author_name);
        }
        //apps thumbnails
        if (data.screenshots) {
          images = data.screenshots.toString();
          images = images.split(",");

          images.forEach(function (value, index) {
            images_collection += "<li><img src=" + images[index] + "></li>";
          });
        }

        //to do
        //push data in array
        //to create elements in dom if needed
        apps_data.push([item_title, item_summary, item_categorie, item_link]);

        //options page
        $("div#options").append("<div id='" + elem_id + "'></div>");

        if (item_url) {
          $("div#options div#" + elem_id).append(
            "<div tabindex='0' data-url='" +
              item_url +
              "'>source code of the app</div>"
          );
        }

        if (donation) {
          donation_icon = "yes";
          $("div#options div#" + elem_id).append(
            "<div tabindex='1' data-url='" +
              donation +
              "'>make a donation</div>"
          );
        }

        if (tracking) {
          tracking_icon = "yes";
        }

        if (ads) {
          donation_icon = "yes";
        }

        //article
        let meta_data =
          "<div class='meta-data'>" +
          "<div><span>Author </span>" +
          item_author +
          "</div>" +
          "<div><span>License </span>" +
          item_license +
          "</div>" +
          "<div><span>Type </span>" +
          item_type +
          "</div>" +
          "<div><span>Donation </span>" +
          donation_icon +
          "</div>" +
          "<div><span>Tracking </span>" +
          tracking_icon +
          "</div>" +
          "<div><span>Ads </span>" +
          ads_icon +
          "</div>" +
          "<div class='dl-cnt'></div>" +
          "</div>";
        //urls
        let urls =
          "data-download ='" +
          item_link +
          "' data-url ='" +
          item_url +
          "'  data-tags ='" +
          item_tags +
          "' data-slug ='" +
          item_slug +
          "'";
        let article =
          "<article id= '" +
          elem_id +
          "' class= 'APP All " +
          item_categorie +
          " ' " +
          urls +
          ">" +
          "<div class='icon'><img src='" +
          item_icon +
          "'></div>" +
          "<div class='channel'>" +
          item_categorie +
          "</div>" +
          "<h1>" +
          item_title +
          "</h1><div class='summary'>" +
          item_summary +
          "</div>" +
          meta_data +
          "<div class='images'></div><ul class='images'>" +
          images_collection +
          "</article>";

        $("div#app-panels").append(article);
      })
    ).then(function () {
      update_time = moment(dataSet.generated_at).format("DD.MM.YYYY, HH:mm");
      $("#update").text(update_time);
      set_tabindex();
      let co = contributors.sort().join(", ");
      //add to about page
      $("div#about div#inner div#contributors").text(co);

      getData();

      $("article#search input").focus();
    });
  }

  bottom_bar("", "select", "about");

  function addCategories() {
    $.each(dataSet.categories, function (key, val) {
      panels.push(key);
    });
    $("div#navigation div").text(panels[0]);
  }

  function set_tabindex() {
    $("div#app-panels article").removeAttr("tabindex");
    $("div#app-panels article")
      .filter(":visible")
      .each(function (index) {
        $(this).prop("tabindex", index);
      });
    article_array = $("div#app-panels article").filter(":visible");
    sort_data();
    $("body").find("article[tabindex = 0]").focus();
  }

  function sort_data() {
    let $wrapper = $("div#app-panels");

    $wrapper
      .find("article tabindex")
      .sort(function (a, b) {
        return b - a;
      })
      .appendTo($wrapper);
  }

  function panels_list(panel) {
    $("article").css("display", "none");
    $("article." + panel).css("display", "block");
    $("div#app-panels article")
      .find([(tabindex = "0")])
      .focus();
  }

  ////////////////////////
  //NAVIGATION
  /////////////////////////
  ///thank you farooqkz
  //for the clever solution

  function nav_panels(left_right) {
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

    $("div#navigation div").text(panels[current_panel]);
    panels_list(panels[current_panel]);
    set_tabindex();
    pos_focus = 0;

    if (current_panel == 0) {
      $("input").val("");
      $("input").focus();
      $("div#navigation").css("display", "none");
    } else {
      $("div#navigation").css("display", "block");
    }
  }

  //up - down

  function nav(param) {
    let focused = $(":focus").attr("tabindex");
    let siblings = $(":focus").parent().children(":visible");
    let siblingsLength = $(":focus").parent().children(":visible").length;

    if ($("input").is(":focus")) {
      $("article#search").next().focus();
    }

    if (param == "+1" && focused < siblingsLength - 1) {
      focused++;

      var focusedElement = $(":focus")[0].offsetTop;

      $("html, body").animate({ scrollTop: focusedElement }, 200);

      siblings[focused].focus();

      if ($("article#search").is(":focus")) {
        $("input").focus();
      }
    }

    if (param == "-1" && focused > 0) {
      focused--;
      let focusedElement = $(":focus")[0].offsetTop;
      //$('html, body').animate({ scrollTo: focusedElement }, 1500);

      siblings[focused].focus();

      if ($("article#search").is(":focus")) {
        $("input").focus();
      }
    }
  }

  //store current article
  let article_id;

  function show_article(app) {
    let $focused;
    if (app) {
      $focused = $('[data-slug="' + app + '"]');
      $('[data-slug="' + app + '"]').focus();
    } else {
      $focused = $(":focus");
    }

    let getClass = $focused.attr("class");
    let getId = $focused.parent().attr("id");
    article_id = $focused.attr("id");

    if (getClass != "About") {
      $("article").css("display", "none");
      $("div#navigation").css("display", "none");
      $("div#app div#app-panels").css("margin", "5px 0 0 0");
      $("div#app div#app-panels").css("max-height", "100%");
      $focused.css("display", "block");
      $("div.summary").css("display", "block");
      $("div.meta-data").css("display", "block");
      $("div.icon").css("display", "block");
      $("div.channel").css("display", "none");
      $("ul.images").css("display", "block");
      if (!offline) {
        bottom_bar("options", "", "install");
      } else {
        bottom_bar("", "", "");
      }

      window_status = "single-article";
    }
  }

  function show_article_list() {
    panels_list(panels[current_panel]);
    $("div#app div#app-panels").css("margin", "35px 0 50px 0px");

    $("article#search").css("margin", "-35px 0 0 0!Important");
    $("div#options").css("display", "none");
    if (current_panel != 0) {
      $("div#navigation").css("display", "block");
    }
    $("div#app-panels").css("display", "block");
    $("div.summary").css("display", "none");
    $("div.meta-data").css("display", "none");
    $("div.channel").css("display", "block");
    $("ul.images").css("display", "none");
    $("div.icon").css("display", "none");

    let targetElement = article_array[pos_focus];
    targetElement.focus();

    bottom_bar("", "select", "about");

    window.scrollTo(0, $(targetElement).offset().top);
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

  function close_options() {
    $("div#options").css("display", "none");
    $("article#" + article_id).focus();
    $("div#navigation").css("display", "none");
    $("div#app div#app-panels").css("margin", "5px 0 0 0");
    $("div#app div#app-panels").css("max-height", "100%");
    $("div#app div#app-panels").css("overflow-y", "scroll");
    $("div.summary").css("display", "block");
    $("div.meta-data").css("display", "block");
    $("div.icon").css("display", "block");
    $("div.channel").css("display", "none");
    $("ul.images").css("display", "block");
    bottom_bar("options", "", "install");
    window_status = "single-article";
  }

  function open_options() {
    let $focused = $(":focus");
    let selected_article = $focused.attr("id");
    $("div#options div").css("display", "none");
    $("div#options").css("display", "block");
    $("div#options div#" + selected_article).css("display", "block");
    $("div#options div#" + selected_article + " div").css("display", "block");
    bottom_bar("", "", "");
    $("div#options div#" + selected_article + " div:first").focus();
    window_status = "options";
  }

  function open_about() {
    $("div#about").css("display", "block");
    $("div#about div#inner").focus();
    document.getElementById("inner").scrollIntoView();

    bottom_bar("", "", "");

    window_status = "about";
  }

  const search_listener = document.querySelector('input[type="search"]');

  search_listener.addEventListener("focus", (event) => {
    bottom_bar("scan", "select", "about");
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
      case "2":
        download_file(
          "https://gitlab.com/musky603/bh-apps/-/raw/master/batteryinfo/batteryv1.zip"
        );
        break;

      case "Enter":
        if (window_status == "article-list") {
          show_article();
        }

        if (window_status == "options") {
          open_url();
        }
        break;

      case "ArrowDown":
        if (window_status == "about") {
          break;
        }

        nav("+1");
        break;

      case "ArrowUp":
        if (window_status == "about") {
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

      case "SoftLeft":
        if (window_status == "search") {
          start_scan(function (callback) {
            let slug = callback.replace("bhackers:", "");
            show_article(slug);
          });

          bottom_bar("", "", "");
          window_status = "scan";
        }

        if (window_status == "single-article") {
          open_options();
          break;
        }

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

        break;

      case "Backspace":
        if (isInSearchField) break;
        evt.preventDefault();
        if (evt.target.id == "search" && evt.target.value == "") {
          $("article:not(article#search)").css("display", "block");
        }

        if (
          window_status == "single-article" ||
          window_status == "post_installation"
        ) {
          show_article_list();
          break;
        }

        if (window_status == "about") {
          $("div#about").css("display", "none");
          show_article_list();
          $("div#bottom-bar div#button-center").css("width", "30%");

          break;
        }

        if (window_status == "scan") {
          document.getElementById("qr-screen").hidden = true;

          break;
        }

        if (window_status == "options") {
          close_options();
          break;
        }
        if (window_status == "article-list" && !$("input").is(":focus")) {
          window.close();
        }
        break;
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  init();
});
