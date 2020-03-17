let page = 0;
let pos_focus = 0
let article_array;
let tabindex_i = -0;
let window_status = "article-list";
let dataSet;
let panels = ["All"];
let current_panel = 0;

$(document).ready(function() {

    check_iconnection();

    //////////////////////////////
    //fetch-database////
    //////////////////////////////


    function getJson(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.timeout = 4000; // time in milliseconds
        xhr.responseType = 'json';


        xhr.send();

        xhr.ontimeout = function(e) {
            toaster("timeout please wait I try another source")

            getJson('https://notabug.org/bananaphone/bhstore/src/master/data.json')
        }


        xhr.onload = function() {
            if (xhr.status != 200) { // analyze HTTP status of the response
                toaster(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            }
            if (xhr.status == 403) { // analyze HTTP status of the response
                toaster("database not found try another")
                getJson('https://notabug.org/bananaphone/bhstore/src/master/data.json')

            }
            if (xhr.status == 200) { // show the result
                dataSet = xhr.response;
                addAppList()
                addCategories()
                $("div#message-box").css('display', 'none');

            }
        };



        xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                //toaster(`Received ${event.loaded} of ${event.total} bytes`);
            } else {
                //toaster(`Received ${event.loaded} bytes`); // no Content-Length
            }

        };

        xhr.onerror = function() {
            toaster("Request failed, please try later.");
        };
    }

    getJson('https://banana-hackers.gitlab.io/store-db/data.json');

    function addAppList() {

        dataSet.apps.forEach(function(value, index) {
            let data = dataSet.apps[index];


            let item_title = data.name;
            let item_summary = data.description;
            let item_link = data.download.url;
            let item_url = data.git_repo;

            let str = data.meta.categories;
            let item_categorie = str.toString().replace(",", " ");




            let item_author = data.author;
            let item_icon = data.icon;
            let item_license = data.license;
            let item_type = data.type;

            let meta_data = "<div class='meta-data'><div><span>Author </span>" + item_author + "</div><div><span>License </span>" + item_license + "</div><div><span>Type </span>" + item_type + "</div></div>";
            let urls = "data-download ='" + item_link + "' data-url ='" + item_url + "'";


            let article = $("<article class= 'All " + item_categorie + "' " + urls + "><div class='icon'><img src='" + item_icon + "'></div><div class='channel'>" + item_categorie + "</div><h1>" + item_title + "</h1><div class='summary'>" + item_summary + "</div>" + meta_data + "</article>");
            $('div#app-panels').append(article);


        });
        set_tabindex()

    }


    function addCategories() {



        $.each(dataSet.categories, function(key, val) {
            panels.push(key)

        })
        $("div#navigation").append("<div>" + panels[0] + "</div>")




    }



    function set_tabindex() {
        $('div#app-panels article').removeAttr("tabindex")
        $('div#app-panels article').filter(':visible').each(function(index) {
            $(this).prop("tabindex", index);

        })
        article_array = $('div#app-panels article').filter(':visible')
        sort_data()
        $('body').find('article[tabindex = 0]').focus()




    }


    function sort_data() {

        let $wrapper = $('div#app-panels');

        $wrapper.find('article tabindex').sort(function(a, b) {
                return b - a;
            })
            .appendTo($wrapper);


    }

    function panels_list(panel) {

        $("article").css("display", "none");
        $("article." + panel).css("display", "block")
        $('div#app-panels article').find([tabindex = "0"]).focus()

    }



    ////////////////////////
    //NAVIGATION
    /////////////////////////

    function nav_panels(left_right) {
        if (left_right == "left" && current_panel > 0) {
            current_panel--;
            $("div#navigation div").text(panels[current_panel])
            panels_list(panels[current_panel])
            set_tabindex()
            pos_focus = 0;



        }

        if (left_right == "right" && current_panel < panels.length - 1) {
            current_panel++;
            $("div#navigation div").text(panels[current_panel])
            panels_list(panels[current_panel])
            set_tabindex()
            pos_focus = 0;


        }

    }

    function nav(move) {

        if (window_status == "article-list") {
            let $focused = $(':focus')[0];



            if (move == "+1" && pos_focus < article_array.length - 1) {
                pos_focus++

                if (pos_focus <= article_array.length) {

                    let focusedElement = $(':focus')[0].offsetTop + 20;


                    window.scrollTo({
                        top: focusedElement,
                        left: 100,
                        behavior: 'smooth'
                    });


                    let targetElement = article_array[pos_focus];
                    targetElement.focus();



                }
            }

            if (move == "-1" && pos_focus > 0) {
                pos_focus--
                if (pos_focus >= 0) {
                    let targetElement = article_array[pos_focus];
                    targetElement.focus();
                    let focusedElement = $(':focus')[0].offsetTop;
                    window.scrollTo({ top: focusedElement + 20, behavior: 'smooth' });

                }
            }
        }

    }




    function show_article() {
        let $focused = $(':focus');
        $('article').css('display', 'none');
        $('div#navigation').css('display', 'none');
        $('div#app-panels').css('margin', '0 0 0 0');

        $focused.css('display', 'block');
        $('div.summary').css('display', 'block');
        $('div.meta-data').css('display', 'block');
        $('div.icon').css('display', 'block');
        $('div.channel').css('display', 'none');
        $('div#button-bar').css('display', 'block');
        window_status = "single-article";

    }


    function show_article_list() {
        navigator.spatialNavigationEnabled = false;
        $('div#app-panels').css('margin', '30px 0 0 0');

        let $focused = $(':focus');
        $('div#navigation').css('display', 'block');
        $('div#app-panels').css('display', 'block');
        $('div.summary').css('display', 'none');
        $('div.meta-data').css('display', 'none');
        $('div.channel').css('display', 'block');

        $('div.icon').css('display', 'none');

        let targetElement = article_array[pos_focus];
        targetElement.focus();
        $('div#button-bar').css('display', 'none');


        window.scrollTo(0, $(targetElement).offset().top);

        $("div#source-page").css("display", "none");
        $("div#source-page iframe").attr("src", "");
        window_status = "article-list";

    }







    function download() {
        let targetElement = article_array[pos_focus];
        let link_target = $(targetElement).data('download');
        let test = window.location.assign(link_target)
        test.onload = function() {
            toaster("loaded")
        }

        test.addEventListener('loadend', function(e) {
            alert('Image load finished');
        });

        //notify("Message", "App downloaded", false, true);

    }

    function test(manifestUrl) {
        var request = window.navigator.mozApps.installPackage(manifestUrl);
        request.onsuccess = function() {
            // Save the App object that is returned
            var appRecord = this.result;
            alert('Installation successful!');
        };
        request.onerror = function() {
            // Display the error information from the DOMError object
            alert('Install failed, error: ' + this.error.name);
        };
    }



    function installPkg(packageFile) {
        navigator.mozApps.mgmt.import(packageFile).then(function() {
            alert('Installation successful!')
        }).catch(e => {
            alert('Installation error: ' + e.name + ' ' + e.message)
        })
        let appGetter = navigator.mozApps.mgmt.getAll()
        appGetter.onsuccess = function() {
            let apps = appGetter.result
            console.dir(apps)
        }
        appGetter.onerror = function(e) {
            console.dir(this.error)
        }
    }


    function open_url() {
        let targetElement = article_array[pos_focus];
        let link_target = $(targetElement).data('url');
        $('div#app-panels').css('display', 'none');
        $("div#source-page").css("display", "block");
        $("div#source-page iframe").attr("src", link_target);
        $('div#button-bar').css('display', 'none');
        window_status = "source-page";
        navigator.spatialNavigationEnabled = true;

    }






    //////////////////////////
    ////KEYPAD TRIGGER////////////
    /////////////////////////



    function handleKeyDown(evt) {

        switch (evt.key) {


            case 'Enter':
                show_article();
                break;


            case 'ArrowDown':
                nav("+1");
                break;


            case 'ArrowUp':
                nav("-1");
                break;

            case 'ArrowLeft':
                nav_panels("left");
                break;

            case 'ArrowRight':
                nav_panels("right");
                break;



            case 'SoftLeft':
                if (window_status == "single-article") {
                    open_url();
                }
                break;

            case '1':
                if (window_status == "single-article") {
                    open_url();
                }
                break;

            case 'SoftRight':
                if (window_status == "single-article") {
                    download();
                    //test("/sdcard/downloads/audio/application/manifest.webapp")

                }
                break;


            case 'Backspace':
                evt.preventDefault();
                if (window_status == "single-article" || window_status == "source-page") {
                    show_article_list();
                    return;

                }
                if (window_status == "article-list") { window.close() }
                break;




        }

    };



    document.addEventListener('keydown', handleKeyDown);






});