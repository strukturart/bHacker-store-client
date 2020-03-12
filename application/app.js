$(document).ready(function() {


    //

    //Global lets
    let redirection_counter = -1;
    let i = -1;
    let debug = "false";
    let page = 0;
    let pos_focus = 0
    let article_array;
    let tabindex_i = -0;
    let window_status = "article-list";
    let dataSet;

    check_iconnection();




    //////////////////////////////
    //fetch-database////
    //////////////////////////////


    function getJson() {
        // 1. Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest();

        // 2. Configure it: GET-request for the URL /article/.../load
        xhr.open('GET', 'https://banana-hackers.gitlab.io/store-db/data.json');
        xhr.responseType = 'json';


        // 3. Send the request over the network
        xhr.send();

        // 4. This will be called after the response is received
        xhr.onload = function() {
            if (xhr.status != 200) { // analyze HTTP status of the response
                toaster(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            } else { // show the result
                dataSet = xhr.response;
                addAppList()
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
            toaster("Request failed");
        };
    }

    getJson()

    function addAppList() {

        dataSet.apps.forEach(function(value, index) {
            let data = dataSet.apps[index];




            let item_title = data.name;
            let item_summary = data.description
            let item_link = data.download.url
            let item_categorie = data.meta.categories
            let item_author = data.author



            let article = $('<article data-link = "' + item_link + '"><div class="channel">' + item_categorie + '</div><h1>' + item_title + '</h1><div class="summary">' + item_summary + '</div><div class="author"><span>Author </span>' + item_author + '</div></article>')
            $('div#news-feed-list').append(article);



        });

        sort_data()
    }


    function set_tabindex() {

        $('div#news-feed-list article').each(function(index) {

            $(this).prop("tabindex", index);
            $('div#news-feed-list article:first').focus()


        })
    }


    function sort_data() {

        let $wrapper = $('div#news-feed-list');

        $wrapper.find('article').sort(function(a, b) {
                return +b.dataset.order - +a.dataset.order;
            })
            .appendTo($wrapper);

        article_array = $('div#news-feed-list article')
        set_tabindex()
    }












    ////////////////////////
    //NAVIGATION
    /////////////////////////



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
        $('article').css('display', 'none')
        $focused.css('display', 'block')
        $('div.summary').css('display', 'block');
        $('div.author').css('display', 'block')

        $('div#button-bar').css('display', 'block')
        window_status = "single-article";

    }


    function show_article_list() {
        let $focused = $(':focus');
        $('article').css('display', 'block')
        $('div.summary').css('display', 'none');
        $('div.author').css('display', 'none');
        $('div#button-bar').css('display', 'none')

        let targetElement = article_array[pos_focus];
        targetElement.focus();

        window.scrollTo(0, $(targetElement).offset().top);

        $("div#source-page").css("display", "none")
        $("div#source-page iframe").attr("src", "")
        $('div#button-bar div#button-right').css('display', 'block');
        window_status = "article-list";




    }




    function open_url() {
        let targetElement = article_array[pos_focus];
        let link_target = $(targetElement).data('link');
        window.location.assign(link_target)

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
                auto_scroll(30, "off");
                break;


            case 'ArrowUp':
                nav("-1");
                auto_scroll(30, "off");
                break;


            case 'SoftLeft':
                show_article_list();
                auto_scroll(30, "off");
                break;

            case 'SoftRight':
                open_url();
                break;


            case 'Backspace':
                evt.preventDefault();
                if (window_status == "article-list") { window.close() }
                show_article_list();
                break;

            case '2':
                auto_scroll(30, "on");
                break;


        }

    };



    document.addEventListener('keydown', handleKeyDown);






});