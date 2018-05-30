
var searchTerm = sessionStorage.getItem("SearchedTerm");
var localPageID;


if (!searchTerm){
    console.log("No Search Term, setting default to Strokes");
    searchTerm="The Strokes";
}

searchItUp();


function searchItUp (){

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            list: 'search',
            srsearch: searchTerm,
            format: 'json',
            generator: 'search',
            //parameters for generator
            gsrsearch: searchTerm,
            gsrnamespace: 0,
            gsrlimit: 10,
            origin: "*",
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
}

function processResult(apiResult) {    
    localPageID = apiResult.query.search[0].title;
    // grabSections(localPageID);
    $('.info-container').append('<img src='+apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source+'>');
    $('.info-container').html('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
    $('#bandinfocard').text(searchTerm);
    // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
}