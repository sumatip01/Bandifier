$('#searchbutton').click(function () {
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            
            list: 'search',
            srsearch: $("#search-input").val(),
            format: 'json',
            generator: 'search',
            //parameters for generator
            gsrsearch: $("#search-input").val(),
            gsrnamespace: 0,
            gsrlimit: 10,

            prop: 'extracts|pageimages',
            //parameters for extracts
            exchars: 1200,
            exlimit: 'max',
            exintro: true,

            //parameters for pageimages
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 200
        },
        dataType: 'jsonp',
        success: processResult
    }).then(function (resp) {
        // processResult(resp.query.search);
        // for (var i = 0; i < resp.query.search.length; i++){
        //     $('#display-result').append('<p>'+resp.query.search[i].title+'</p>');
        //   }
        console.log(resp);
    });
    console.log("button clicked")
    // $.ajax({
    //     url: 'http://en.wikipedia.org/w/api.php',
    //     data: {
    //         action: 'parse',
    //         page: 'API:Parsing_wikitext',
    //         srsearch: $("#search-input").val(),
    //         prop: 'sections|text',
    //         section: 1,
    //     },
    //     dataType: "json",
        
            

    // }).then(function(resp2){
    //     console.log(resp2);
    // });
});

function processResult(apiResult) {
    // for (var i = 0; i < apiResult.query.search.length; i++) {
        $('#display-result').append('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
        // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
    // }
}