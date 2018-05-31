// var spotifyAPI = new SpotifyWebAPI();
// spotifyAPI.setAccessToken('')

var clientId = 'fe8362d03fae494c914dbed629a6f9f8';
// var clientSecret = 'b3e9bee2e7df4d8f832ff04dc8e2cfa0';
// var encodedData = window.btoa(clientId + ':' + clientSecret);
// var authorizationHeaderString = 'Authorization: Basic ' + encodedData;

var localToken;

var localPageID;

// getAuthorization();

function getAuthorization() {
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
    const redirectUri = 'https://rudenik.github.io/Bandifier/';
    const scopes = [
        // 'user-top-read'
    ];

    // If there is no token, redirect to Spotify authorization
    if (!_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
        localToken = _token;
    }
    //this is where to change/make the request
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function (data) {
            // Do something with the returned data
            console.log(data)
            data.items.map(function (artist) {
                let item = $('<li>' + artist.name + '</li>');
                item.appendTo($('#top-artists'));
            });
        }
    });
}
$("#spotifybutton").click(function() {

    searchTerm = $("#spotify-input").val()
    sessionStorage.setItem("searchedTerm", searchTerm)
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
        const redirectUri = 'https://rudenik.github.io/Bandifier/wikiSearch.html';
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
                for (track in data.tracks){
                    data.tracks[track].name
                    data.tracks[track].uri
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", "https://embed.spotify.com/?uri="+data.tracks[track].url);
                    trackiFrame.appendTo(trackDiv);
                    trackDiv.appendTo("#top-artists");
                }
            }
        });
});


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


    // $.ajax({
    //     url: "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist&limit=1",
    //     type: "GET",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Bearer ' + localToken);
    //     },
    //     success: function (data) {
    //         // Do something with the returned data
    //         console.log(data)
    //         data.items.map(function (artist) {
    //             let item = $('<li>' + artist.name + '</li>');
    //             item.appendTo($('#top-artists'));
    //         });
    //     }
    // });
});

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
        buildCollapsible(gsresp.parse.sections);
    })
}

function processResult(apiResult) {

    localPageID = apiResult.query.search[0].title;
    grabSections(localPageID);
    $('#display-result').append('<img src=' + apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source + '>')
    $('#display-result').append('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract.replace("...", "") + '</p>');
 
}

function buildCollapsible(sectionsArray) {
    console.log(sectionsArray);
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

    collapse.appendTo($("#artistsections"));
    var lements = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(lements);
}