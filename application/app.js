let page = 0;
let pos_focus = 0;
let article_array;
let tabindex_i = -0;
let window_status = "article-list";
let dataSet;
let panels = ["All"];
let current_panel = 0;
let app_slug;

$(document).ready(function () {
  check_iconnection();

  //////////////////////////////
  //fetch-database////
  //////////////////////////////

  function init() {
    BackendApi.setStatusCallback(toaster);

    function loadData() {
      // console.log("loadData");
      dataSet = BackendApi.getData();
      console.log(dataSet);
      addAppList();
      addCategories();

      $("div#message-box").css("animation-play-state", "running");
      $("div#message-box img.icon-2").css("animation-play-state", "running");
      $("div#message-box img.icon-1").css("animation-play-state", "running");
      $("div#message-box div").css("display", "none");
    }

    if (!BackendApi.getData()) {
      if (!navigator.onLine) {
        $("#download").html(
          "😴<br>Your device is offline, please connect it to the internet "
        );
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
        toaster("offline mode - loading data from cache");
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
          "' class= 'All " +
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
      set_tabindex();

      fetch("about.html")
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          $("div#privacy").html(data);
        });
      let update_time = moment(dataSet.generated_at).format(
        "DD.MM.YYYY, HH:mm"
      );
      let about_text =
        "<div>An alternative app store by free developers for free devices.The database of apps is hosted https://banana-hackers.gitlab.io/store-db , further can be added by a pull request.</div>" +
        "<div><h1>Contributors</h1><div id='contributors'></div></div>" +
        "<div><h1>Respect</h1>" +
        "<div>Respect the licenses of the apps, it would be nice if you use app more often to support the developer with a donation.<br>Thanks!</div>" +
        "<div id='privacy'></div>" +
        "<div class='footer'> Last update: " +
        update_time +
        "</div>";

      let article = $("<article class='About'>" + about_text + "</article>");
      $("div#app-panels").append(article);

      $("div#contributors").text(contributors.sort().join(", "));

      getData();

      $("article#search input").focus();
    });
  }

  function addCategories() {
    $.each(dataSet.categories, function (key, val) {
      panels.push(key);
    });
    panels.push("About");
    $("div#navigation").append("<div>" + panels[0] + "</div>");
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
      siblings[focused].focus();

      let focusedElement = $(":focus")[0].offsetTop;
      //$('div#app-panels article').eq(-2).css("margin-bottom", "40px")

      window.scrollTo({
        top: focusedElement - 35,
        behavior: "smooth",
      });

      if ($("article#search").is(":focus")) {
        $("input").focus();
      }
    }

    if (param == "-1" && focused > 0) {
      focused--;
      siblings[focused].focus();
      let focusedElement = $(":focus")[0].offsetTop;

      window.scrollTo({
        top: focusedElement - 35,
        behavior: "smooth",
      });

      if ($("article#search").is(":focus")) {
        $("input").focus();
      }
    }
  }

  //store current article
  let article_id;

  function show_article() {
    let $focused = $(":focus");
    let getClass = $focused.attr("class");
    let getId = $(":focus").parent().attr("id");
    article_id = $(":focus").attr("id");

    if (getId == "search") {
      return false;
    }

    if (getClass != "About" || getId != "search") {
      $("article").css("display", "none");
      $("div#navigation").css("display", "none");
      $("div#app div#app-panels").css("margin", "5px 0 0 0");
      $("div#app div#app-panels").css("max-height", "100%");
      $("div#app div#app-panels").css("overflow-y", "scroll");

      $focused.css("display", "block");
      $("div.summary").css("display", "block");
      $("div.meta-data").css("display", "block");
      $("div.icon").css("display", "block");
      $("div.channel").css("display", "none");
      $("ul.images").css("display", "block");

      $("div#button-bar").css("display", "block");
      $("div#button-bar div#button-left").css("color", "white");
      $("div#button-bar div#button-center").css("color", "black");
      $("div#button-bar div#button-right").css("color", "white");
      window_status = "single-article";
    }
  }

  function show_article_list() {
    navigator.spatialNavigationEnabled = false;
    panels_list(panels[current_panel]);
    $("div#app div#app-panels").css("margin", "32px 0 0 0");
    $("div#app div#app-panels").css("max-height", "73%");
    $("div#options").css("display", "none");

    $("div#navigation").css("display", "block");
    $("div#app-panels").css("display", "block");
    $("div.summary").css("display", "none");
    $("div.meta-data").css("display", "none");
    $("div.channel").css("display", "block");
    $("ul.images").css("display", "none");

    $("div.icon").css("display", "none");

    let targetElement = article_array[pos_focus];
    targetElement.focus();

    $("div#button-bar").css("display", "block");
    $("div#button-bar div#button-left").css("color", "black");
    $("div#button-bar div#button-center").css("color", "white");
    $("div#button-bar div#button-right").css("color", "black");

    window.scrollTo(0, $(targetElement).offset().top);
    window_status = "article-list";
  }

  function download() {
    let link_target = "";
    let targetElement = $(":focus");
    link_target = $(targetElement).data("download");
    app_slug = $(targetElement).data("slug");
    window.location.assign(link_target);
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

    $("div#button-bar").css("display", "block");
    $("div#button-bar div#button-left").css("color", "white");
    $("div#button-bar div#button-center").css("color", "black");
    $("div#button-bar div#button-right").css("color", "white");
    window_status = "single-article";
  }

  function open_options() {
    let $focused = $(":focus");
    let selected_article = $focused.attr("id");

    $("div#options div").css("display", "none");

    $("div#options").css("display", "block");
    $("div#options div#" + selected_article).css("display", "block");

    $("div#options div#" + selected_article + " div").css("display", "block");

    $("div#button-bar div#button-left").css("color", "black");
    $("div#button-bar div#button-center").css("color", "white");
    $("div#button-bar div#button-right").css("color", "black");

    $("div#options div#" + selected_article + " div:first").focus();
    window_status = "options";
  }

  //////////////////////////
  ////KEYPAD TRIGGER////////////
  /////////////////////////

  function handleKeyDown(evt) {
    const isInSearchField = evt.target.id == "search";

    switch (evt.key) {
      case "Enter":
        if (window_status == "article-list") {
          show_article();
        }

        if (window_status == "options") {
          open_url();
        }
        break;

      case "ArrowDown":
        nav("+1");
        break;

      case "ArrowUp":
        nav("-1");
        break;

      case "ArrowLeft":
        if (isInSearchField) break;
        if (window_status == "article-list") {
          nav_panels("left");
        }
        break;

      case "ArrowRight":
        if (isInSearchField) break;
        if (window_status == "article-list") {
          nav_panels("right");
        }
        break;

      case "SoftLeft":
        if (window_status == "single-article") {
          open_options();
        }

        break;

      case "SoftRight":
        if (window_status == "single-article") {
          download();
        }
        break;

      case "Backspace":
        if (isInSearchField) break;
        evt.preventDefault();
        if (window_status == "single-article") {
          show_article_list();
          return;
        }

        if (window_status == "options") {
          close_options();
          return;
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
