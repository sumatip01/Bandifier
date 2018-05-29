// var spotifyAPI = new SpotifyWebAPI();
// spotifyAPI.setAccessToken('')

var clientId = 'fe8362d03fae494c914dbed629a6f9f8';
// var clientSecret = 'b3e9bee2e7df4d8f832ff04dc8e2cfa0';
// var encodedData = window.btoa(clientId + ':' + clientSecret);
// var authorizationHeaderString = 'Authorization: Basic ' + encodedData;





getAuthorization();

function getAuthorization(){
    // $.ajax({
    //     url: 'https://accounts.spotify.com/api/token',
    //     method: 'POST',
    //     'content-type': "application/x-www-form-urlencoded",
    //     header: {
    //             Authorization: authorizationHeaderString,
    //         },
    //     data:{
    //         grant_type: "client_credentials",
    //     }
    //     }).then(function(spotResp){
    //     console.log("Spot Auth resp");
    //     console.log(spotResp);
    // })
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

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'fe8362d03fae494c914dbed629a6f9f8';
const redirectUri = 'https://rudenik.github.io/Bandifier/';
const scopes = [
  'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
}

$.ajax({
    url: "https://api.spotify.com/v1/me/top/artists",
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    success: function(data) { 
      // Do something with the returned data
      console.log(data)
      data.items.map(function(artist) {
        let item = $('<li>' + artist.name + '</li>');
        item.appendTo($('#top-artists'));
      });
    }
 });
 
 






}

$('#searchbutton').click(function () {
    var searchTerm = $("#search-input").val();
    sessionStorage.setItem("searchedTerm", searchTerm);
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
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
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'parse',
            format: 'json',
            srsearch: searchTerm,
            prop:"revisions",
            rvprop: "content",
            origin: "github.io"
            // prop: 'sections|text',
            // section: 0
        },
        dataType: "json",
        
            

    }).then(function(resp2){
        console.log(resp2);
    });
});

function processResult(apiResult) {
    // for (var i = 0; i < apiResult.query.search.length; i++) {
        $('#display-result').append('<img src='+apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source+'>')
        $('#display-result').append('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
        // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
    // }
}