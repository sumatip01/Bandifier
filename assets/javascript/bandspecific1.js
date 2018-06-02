
var searchTerm = sessionStorage.getItem("searchedTerm");
var localPageID;
var localToken;
var localSections;
// var elems = document.querySelectorAll('.modal');
// var instances = M.Modal.init(elems, onOpenStart(buildCollapsible()));//, options);

$(".info-container").on("click", ".modal-trigger", function(event){
    console.log("model-trigger");
    var elems = document.querySelectorAll('.modal');
    var options = {onOpenStart:buildCollapsible(localSections)};
    var instances = M.Modal.init(elems, options);
});


const clientID='fe8362d03fae494c914dbed629a6f9f8';
     let player,token;
     var accountUrl='https://accounts.spotify.com/authorize?client_id='+clientID+'&redirect_uri=http:%2F%2Fwww.touchcatdigital.ca&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-birthdate%20user-read-currently-playing&response_type=token&state=123';
     window.onSpotifyWebPlaybackSDKReady = () => {
     window.addEventListener("message", receiveMessage, false);
     var authWindow = window.open(accountUrl, '_blank');
    //  console.log(authWindow);
       if (authWindow) {
         authWindow.focus();
       }

       function receiveMessage(event){
        //  console.log(event);
         var msg=event.data;
         if(typeof msg==='string'){
           var parseArray=msg.split('&');
           token=parseArray[0].split('=')[1];
            authWindow.close();
             player = new Spotify.Player({
               name: 'Bandifier',
               getOAuthToken: cb => { cb(token); }
             });
             searchItUp();
            }



        }

 }
if (!searchTerm){
    console.log("No Search Term, setting default to Strokes");
    searchTerm="The Strokes";
}

// if (window.location.href.match('car-driving.html') != null) {
// searchItUp();
// }

$("#btnMain").on("click", function (event){
    event.preventDefault();
    searchTerm = $("#search-input").val();
    sessionStorage.setItem("searchedTerm", searchTerm);
    $("#search-input").val("");
    location.href='bandspecific1.html';
    // console.log('BUTTON MAIN CLICK');
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
        
    });

    // const hash = window.location.hash
    // .substring(1)
    // .split('&')
    // .reduce(function (initial, item) {
    //     if (item) {
    //         var parts = item.split('=');
    //         initial[parts[0]] = decodeURIComponent(parts[1]);
    //     }
    //     return initial;
    //         }, {});
    //     window.location.hash = '';

    //     // Set token
    //     let _token = hash.access_token;
    //     localToken = _token;
    //     const authEndpoint = 'https://accounts.spotify.com/authorize';

    //     // Replace with your app's client ID, redirect URI and desired scopes
    //     const clientId = 'fe8362d03fae494c914dbed629a6f9f8';
    //     const redirectUri = 'https://rudenik.github.io/Bandifier/bandspecific1.html';
    //     const scopes = [
    //         // 'user-top-read'
    //     ];

    //     // If there is no token, redirect to Spotify authorization
    //     if (!_token) {
    //         window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
    //         localToken = _token;
    //     }
        searchTerm = encodeURI(searchTerm);
        console.log(searchTerm);
        $.ajax({
            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=artist&market=CA",
            type: "GET",
            headers:{
                "Authorization":'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                console.log(data)
                console.log(data.artists.items[0].id);
            
                if (window.location.href.match('bandspecific1.html') != null) {
                getTopTracks(data.artists.items[0].id);
                }
            }
        });
    }
    
function getTopTracks(artistID){
    
$.ajax({
    url: "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=CA&limit=5",
    type: "GET",
    headers:{
        "Authorization":'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    success: function(response){
        console.log(response);
        if (response.tracks.length > 7){
            for (i=0; i<10; i++){ //Here's where to specify how many tracks to put up
                var sURI = "https://embed.spotify.com/?uri="+response.tracks[i].uri;
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", sURI);
                    trackiFrame.appendTo(trackDiv);
                    trackDiv.appendTo(".spotify-container");
            }
        }else{
        for (track in response.tracks){
                    var sURI = "https://embed.spotify.com/?uri="+response.tracks[track].uri;
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", sURI);
                    trackiFrame.appendTo(trackDiv);
                    trackDiv.appendTo(".spotify-container");
                }
            }
    }
});
};

function processResult(apiResult) {    
    console.log(apiResult);
    localPageID = apiResult.query.search[0].title;
    console.log(localPageID);
    grabSections(localPageID);
        try{
        
        $('.info-container').html('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
        $('.info-container').prepend('<img src='+apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source+'>');
        $('#bandinfocard').text(decodeURI(searchTerm));
        var moreButton = $("<a class='waves-effect waves-light btn modal-trigger' href='#modal1'>More?</a>");
        moreButton.appendTo('.info-container');

    }catch(error){
        if (error instanceof TypeError){
        console.log(error);
        searchTerm = searchTerm+" band";
        searchTerm = encodeURI(searchTerm);
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
            console.log(resp);
        });

        }
    
    // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
    }
}

function grabSections(pageID) {
    // /w/api.php?action=parse&format=json&origin=*&page=The%20Strokes&redirects=1&prop=sections%7Cwikitext&wrapoutputclass=mw-parser-output&contentmodel=wikitext&utf8=1&formatversion=2
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'parse',
            format: 'json',
            origin: '*',
            redirects: '1',
            prop: 'sections|text',
            page: pageID,

        },
        dataType: 'json'
    }).then(function (gsresp) {
        console.log(gsresp);
        var prettyString = JSON.stringify(gsresp.parse.text).replace(/\\n/g, "")
            .replace(/\\'/g, "")
            .replace(/\\"/g, '')
            .replace(/\\&/g, "")
            .replace(/\\r/g, "")
            .replace(/\\t/g, "")
            .replace(/\\b/g, "")
            .replace(/\\f/g, "");
        // buildCollapsible(gsresp.parse.sections);
        localSections=gsresp.parse.sections;
    })
}

function buildCollapsible(sectionsArray) {
    // console.log(sectionsArray);
    var collapse = $("<ul class='collapsible' id='returnedsections'>");
    var promises = sectionsArray.map(function (section) {
        return new Promise(function (resolve) {
            $.ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                data: {
                    action: 'parse',
                    format: 'json',
                    origin: '*',
                    redirects: '1',
                    prop: 'sections|text',
                    page: localPageID,
                    section: section.index,
                },
                dataType: 'json',
            }).then(function (returnValue) {
                resolve(returnValue);
            })
        })
    })
    Promise.all(promises).then(function (promiseResults) {
        for (elements in sectionsArray) {
            var litem = $("<li>");
            var divHeader = $("<div class='collapsible-header'>");
            divHeader.html(sectionsArray[elements].line.replace(/<i>/gi, "").replace(/<\/i>/gi, ""));
            var headerBadge = $("<span class='badge material-icons '>expand_more</span>");
            headerBadge.appendTo(divHeader);
            var divBody = $("<div class='collapsible-body'>");
            divBody.attr("style", "background-color: white;");
            var bodySpan = $("<span>");
            bodySpan.attr("id", "section" + elements);
            var prettyString = JSON.stringify(promiseResults[elements].parse.text['*']).replace(/\\n/g, "")
                .replace(/\\'/g, "")
                .replace(/\\"/g, '')
                .replace(/\\&/g, "")
                .replace(/\\r/g, "")
                .replace(/\\t/g, "")
                .replace(/\\b/g, "")
                .replace(/\\f/g, "");
            bodySpan.html(prettyString);
            bodySpan.appendTo(divBody);
            divHeader.appendTo(litem);
            divBody.appendTo(litem);
            litem.appendTo(collapse);
        }
    });
    $("#modal-body").empty();
    collapse.appendTo($("#modal-body"));
    $("#modal-header").text(decodeURI(searchTerm));
    var lements = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(lements);
}
$(".active").on("click", ".badge", function(event){
    console.log("clicked badge");
    this.text("-");
});