
var searchTerm = sessionStorage.getItem("searchedTerm");
var localPageID;
var localToken;


if (!searchTerm){
    console.log("No Search Term, setting default to Strokes");
    searchTerm="The Strokes";
}

// searchItUp();

$("#btnMain").on("click", function (event){
    event.preventDefault();
    searchTerm = $("#search-input").val();
    sessionStorage.setItem("searchedTerm", searchTerm);
    $("#search-input").val("");
    location.href='bandspecific1.html';
    console.log(searchTerm);
    searchItUp();


})

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
        // console.log(resp);
    });

    const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
            }, {});
        window.location.hash = '';

        // Set token
        let _token = hash.access_token;
        localToken = _token;
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = 'fe8362d03fae494c914dbed629a6f9f8';
        const redirectUri = 'https://rudenik.github.io/Bandifier/index.html';
        const scopes = [
            // 'user-top-read'
        ];

        // If there is no token, redirect to Spotify authorization
        if (!_token) {
            window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
            localToken = _token;
        }
        searchTerm = encodeURI(searchTerm);

        $.ajax({
            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=artist",
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
            },
            success: function (data) {
                console.log(data)
                console.log(data.artists.items[0].id);
                // for (track in data.tracks){
                //     var sURI = "https://embed.spotify.com/?uri="+SpotifyResponse.tracks[track].uri;
                //     var trackDiv = $("<div>");
                //     trackDiv.addClass("spotify-embed");
                //     var trackiFrame = $("<iframe>");
                //     trackiFrame.attr("src", sURI);
                //     trackiFrame.appendTo(trackDiv);
                //     trackDiv.appendTo("#top-artists");
                // }
                getTopTracks(data.artists.items[0].id);
            }
        });

    }
function getTopTracks(artistID){
    const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
            }, {});
        window.location.hash = '';

        // Set token
        let _token = hash.access_token;
        localToken = _token;
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = 'fe8362d03fae494c914dbed629a6f9f8';
        const redirectUri = 'https://rudenik.github.io/Bandifier/index.html';
        const scopes = [
            // 'user-top-read'
        ];

        // If there is no token, redirect to Spotify authorization
        if (!_token) {
            window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
            localToken = _token;
        }
        // searchTerm = encodeURI(searchTerm);
$.ajax({
    url: "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks",
    type: "GET",
    beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    },
    success: function(response){
        console.log(response);
    }
});
};


function processResult(apiResult) {    
    // console.log(apiResult);
    localPageID = apiResult.query.search[0].title;
    // grabSections(localPageID);
    $('.info-container').append('<img src='+apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source+'>');
    $('.info-container').html('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
    $('#bandinfocard').text(searchTerm);
    // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
}