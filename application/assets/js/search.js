//https://github.com/devbridge/jquery-Autocomplete

function buildAutocomplete(element, source, container) {
    $(element).autocomplete({
        lookup: source,
        minChars: 1,
        triggerSelectOnValidInput: true,
        showNoSuggestionNotice: false,
        lookupLimit: 8,
        autoSelectFirst: false,
        appendTo: $('body'),

        onSearchStart: function() {
            //alert(source)
            $("article:not(article#search)").css("display", "none")

        },

        onSearchError: function(query, jqXHR, textStatus, errorThrown) {
            //alert(query)
        },
        onSelect: function(suggestion) {
            $("article:not(article#search)").css("display", "none")
            $('*[data-tags=' + suggestion.value + ']').css("display", "block")
            $('div#app-panels article').removeAttr("tabindex")
            $('div#app-panels article').filter(':visible').each(function(index) {
                $(this).prop("tabindex", index);

            })
            article_array = $('div#app-panels article').filter(':visible')
            $('body').find('article[tabindex = 1]').focus()
            $("input").val("")



        },
        onHide: function() {

        },

        onSearchComplete: function(query, suggestions) {

            //alert(query.length)


        }
    });
}

var search_list = [];
var filter_search_list = [];

function getData() {





    $.when(
        $('article').each(function(index) {
            if ($(this).attr('data-tags')) {

                if ($.inArray($(this).attr('data-tags'), filter_search_list) == -1) {
                    search_list.push({ "value": $(this).attr('data-tags'), "data": $(this).attr('data-tags') });
                    filter_search_list.push($(this).attr('data-tags'))
                };

            }

        })
    ).then(function() {
        buildAutocomplete("input", search_list, "div#app-panels")
    })


}