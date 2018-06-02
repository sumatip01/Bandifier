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
                    var sURI = "https://embed.spotify.com/?uri="+SpotifyResponse.tracks[track].uri;
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", sURI);
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
    
    for (track in SpotifyResponse.tracks){
        console.log(SpotifyResponse.tracks[track].name);
        console.log(SpotifyResponse.tracks[track].uri);
        var sURI = "https://embed.spotify.com/?uri="+SpotifyResponse.tracks[track].uri;
        var trackDiv = $("<div>");
        trackDiv.addClass("spotify-embed");
        var trackiFrame = $("<iframe>");
        trackiFrame.attr("src", sURI);;
        trackiFrame.appendTo(trackDiv);
        trackDiv.appendTo("#top-artists");
    }
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

var SpotifyResponse = {
    "tracks": [
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/2OBSz5Nlto0Q5CtYPzPY7c"
          },
          "href": "https://api.spotify.com/v1/albums/2OBSz5Nlto0Q5CtYPzPY7c",
          "id": "2OBSz5Nlto0Q5CtYPzPY7c",
          "images": [
            {
              "height": 635,
              "url": "https://i.scdn.co/image/60a7b8672c73d0d46e3233e41028af19ceae159c",
              "width": 640
            },
            {
              "height": 297,
              "url": "https://i.scdn.co/image/98d14287d5af82310f263a4ca64667c8a8cc20ea",
              "width": 300
            },
            {
              "height": 63,
              "url": "https://i.scdn.co/image/283c14b07025085fde86b2afce5059bc5785821c",
              "width": 64
            }
          ],
          "name": "Weezer (Green Album)",
          "release_date": "2001-05-15",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:2OBSz5Nlto0Q5CtYPzPY7c"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 200306,
        "explicit": false,
        "external_ids": {
          "isrc": "USIR10110358"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2MLHyLy5z5l5YRp7momlgw"
        },
        "href": "https://api.spotify.com/v1/tracks/2MLHyLy5z5l5YRp7momlgw",
        "id": "2MLHyLy5z5l5YRp7momlgw",
        "is_local": false,
        "name": "Island In The Sun",
        "popularity": 72,
        "preview_url": "https://p.scdn.co/mp3-preview/917c8004b63d09a26021d0d7d9c3db1601be858d?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 4,
        "type": "track",
        "uri": "spotify:track:2MLHyLy5z5l5YRp7momlgw"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/33CmI2lR8PnQwz6133Mc7l"
          },
          "href": "https://api.spotify.com/v1/albums/33CmI2lR8PnQwz6133Mc7l",
          "id": "33CmI2lR8PnQwz6133Mc7l",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0b5ec7a2f7999ab456f40337a7743c4a882f2531",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/9671a88f934a2e1936443b4a1d56f1eac6fc6e3a",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/c570072baa95bce680c5e022ffe8c23ed593585d",
              "width": 64
            }
          ],
          "name": "Weezer (Deluxe Edition)",
          "release_date": "1994-05-10",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:33CmI2lR8PnQwz6133Mc7l"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 2,
        "duration_ms": 256880,
        "explicit": false,
        "external_ids": {
          "isrc": "USGF19962907"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/4YPhn26bIFm2KUkL1VLzQG"
        },
        "href": "https://api.spotify.com/v1/tracks/4YPhn26bIFm2KUkL1VLzQG",
        "id": "4YPhn26bIFm2KUkL1VLzQG",
        "is_local": false,
        "name": "Say It Ain't So",
        "popularity": 70,
        "preview_url": "https://p.scdn.co/mp3-preview/a0d879900ba1a5418c86a552f7dae2e1f258e75a?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 14,
        "type": "track",
        "uri": "spotify:track:4YPhn26bIFm2KUkL1VLzQG"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/33CmI2lR8PnQwz6133Mc7l"
          },
          "href": "https://api.spotify.com/v1/albums/33CmI2lR8PnQwz6133Mc7l",
          "id": "33CmI2lR8PnQwz6133Mc7l",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0b5ec7a2f7999ab456f40337a7743c4a882f2531",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/9671a88f934a2e1936443b4a1d56f1eac6fc6e3a",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/c570072baa95bce680c5e022ffe8c23ed593585d",
              "width": 64
            }
          ],
          "name": "Weezer (Deluxe Edition)",
          "release_date": "1994-05-10",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:33CmI2lR8PnQwz6133Mc7l"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 159586,
        "explicit": false,
        "external_ids": {
          "isrc": "USGF19562907"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/7GptbanebPZYkLPvjNfd6m"
        },
        "href": "https://api.spotify.com/v1/tracks/7GptbanebPZYkLPvjNfd6m",
        "id": "7GptbanebPZYkLPvjNfd6m",
        "is_local": false,
        "name": "Buddy Holly",
        "popularity": 66,
        "preview_url": "https://p.scdn.co/mp3-preview/bd8891541b9fd7c2aa055dee17a3a26f1c5099b1?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 4,
        "type": "track",
        "uri": "spotify:track:7GptbanebPZYkLPvjNfd6m"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/3EwfQtjvyRAXsPWAKO5FDP"
          },
          "href": "https://api.spotify.com/v1/albums/3EwfQtjvyRAXsPWAKO5FDP",
          "id": "3EwfQtjvyRAXsPWAKO5FDP",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0074e12e5155e33f46285b7ba5ed5f0b297d94e0",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/95eb0179cc6d93be1945b29ec4f1116baa469c17",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/b6471ee3f50381c6b90987f0116e7754ae5aa88d",
              "width": 64
            }
          ],
          "name": "Pacific Daydream",
          "release_date": "2017-10-27",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:3EwfQtjvyRAXsPWAKO5FDP"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 195893,
        "explicit": false,
        "external_ids": {
          "isrc": "USAT21700603"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2jz1bw1p0WQj0PDnVDP0uY"
        },
        "href": "https://api.spotify.com/v1/tracks/2jz1bw1p0WQj0PDnVDP0uY",
        "id": "2jz1bw1p0WQj0PDnVDP0uY",
        "is_local": false,
        "name": "Feels Like Summer",
        "popularity": 66,
        "preview_url": "https://p.scdn.co/mp3-preview/530a0fa1eaf7bc59c46b4695610be07e7ce80d12?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 3,
        "type": "track",
        "uri": "spotify:track:2jz1bw1p0WQj0PDnVDP0uY"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/4D8A8M0NJjEdQhusawyeDz"
          },
          "href": "https://api.spotify.com/v1/albums/4D8A8M0NJjEdQhusawyeDz",
          "id": "4D8A8M0NJjEdQhusawyeDz",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/648b1c9d662b07968c02f8dbc22ea388c64de25f",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/6cb02d28697562973520d3f34ecda3ccc0cc17f6",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/e3fe6f90314f3eff2f73e85c67ae524d4e386e2e",
              "width": 64
            }
          ],
          "name": "Make Believe",
          "release_date": "2005-05-10",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:4D8A8M0NJjEdQhusawyeDz"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 196093,
        "explicit": false,
        "external_ids": {
          "isrc": "USIR10500448"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/1yKu2MhpwzDXXH2tzG6xoa"
        },
        "href": "https://api.spotify.com/v1/tracks/1yKu2MhpwzDXXH2tzG6xoa",
        "id": "1yKu2MhpwzDXXH2tzG6xoa",
        "is_local": false,
        "name": "Beverly Hills",
        "popularity": 66,
        "preview_url": "https://p.scdn.co/mp3-preview/d18c13145c08d3317ea415c097fbc6105641eae0?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:1yKu2MhpwzDXXH2tzG6xoa"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/3EwfQtjvyRAXsPWAKO5FDP"
          },
          "href": "https://api.spotify.com/v1/albums/3EwfQtjvyRAXsPWAKO5FDP",
          "id": "3EwfQtjvyRAXsPWAKO5FDP",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0074e12e5155e33f46285b7ba5ed5f0b297d94e0",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/95eb0179cc6d93be1945b29ec4f1116baa469c17",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/b6471ee3f50381c6b90987f0116e7754ae5aa88d",
              "width": 64
            }
          ],
          "name": "Pacific Daydream",
          "release_date": "2017-10-27",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:3EwfQtjvyRAXsPWAKO5FDP"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 177280,
        "explicit": false,
        "external_ids": {
          "isrc": "USAT21703182"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6ILpnOUHollfHp4xWH7nqV"
        },
        "href": "https://api.spotify.com/v1/tracks/6ILpnOUHollfHp4xWH7nqV",
        "id": "6ILpnOUHollfHp4xWH7nqV",
        "is_local": false,
        "name": "Happy Hour",
        "popularity": 62,
        "preview_url": "https://p.scdn.co/mp3-preview/fd5690768d4a7ddb14aad7336a398a025a422c99?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 4,
        "type": "track",
        "uri": "spotify:track:6ILpnOUHollfHp4xWH7nqV"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/2OBSz5Nlto0Q5CtYPzPY7c"
          },
          "href": "https://api.spotify.com/v1/albums/2OBSz5Nlto0Q5CtYPzPY7c",
          "id": "2OBSz5Nlto0Q5CtYPzPY7c",
          "images": [
            {
              "height": 635,
              "url": "https://i.scdn.co/image/60a7b8672c73d0d46e3233e41028af19ceae159c",
              "width": 640
            },
            {
              "height": 297,
              "url": "https://i.scdn.co/image/98d14287d5af82310f263a4ca64667c8a8cc20ea",
              "width": 300
            },
            {
              "height": 63,
              "url": "https://i.scdn.co/image/283c14b07025085fde86b2afce5059bc5785821c",
              "width": 64
            }
          ],
          "name": "Weezer (Green Album)",
          "release_date": "2001-05-15",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:2OBSz5Nlto0Q5CtYPzPY7c"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 186533,
        "explicit": false,
        "external_ids": {
          "isrc": "USIR10110319"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2mPMFJvQ0v27gVqe5b6nDn"
        },
        "href": "https://api.spotify.com/v1/tracks/2mPMFJvQ0v27gVqe5b6nDn",
        "id": "2mPMFJvQ0v27gVqe5b6nDn",
        "is_local": false,
        "name": "Hash Pipe",
        "popularity": 59,
        "preview_url": "https://p.scdn.co/mp3-preview/3b0cb4c84033c682ae8158534eecde5ed2f0c78e?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 3,
        "type": "track",
        "uri": "spotify:track:2mPMFJvQ0v27gVqe5b6nDn"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/33CmI2lR8PnQwz6133Mc7l"
          },
          "href": "https://api.spotify.com/v1/albums/33CmI2lR8PnQwz6133Mc7l",
          "id": "33CmI2lR8PnQwz6133Mc7l",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0b5ec7a2f7999ab456f40337a7743c4a882f2531",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/9671a88f934a2e1936443b4a1d56f1eac6fc6e3a",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/c570072baa95bce680c5e022ffe8c23ed593585d",
              "width": 64
            }
          ],
          "name": "Weezer (Deluxe Edition)",
          "release_date": "1994-05-10",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:33CmI2lR8PnQwz6133Mc7l"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 304986,
        "explicit": false,
        "external_ids": {
          "isrc": "USGF19962905"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6FxbwB6o1MKOy0dHvxNr2W"
        },
        "href": "https://api.spotify.com/v1/tracks/6FxbwB6o1MKOy0dHvxNr2W",
        "id": "6FxbwB6o1MKOy0dHvxNr2W",
        "is_local": false,
        "name": "Undone - The Sweater Song",
        "popularity": 58,
        "preview_url": "https://p.scdn.co/mp3-preview/1110729815e8efa5d95e8a2c695bbc28a6fe0ff2?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 5,
        "type": "track",
        "uri": "spotify:track:6FxbwB6o1MKOy0dHvxNr2W"
      },
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/3EwfQtjvyRAXsPWAKO5FDP"
          },
          "href": "https://api.spotify.com/v1/albums/3EwfQtjvyRAXsPWAKO5FDP",
          "id": "3EwfQtjvyRAXsPWAKO5FDP",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/0074e12e5155e33f46285b7ba5ed5f0b297d94e0",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/95eb0179cc6d93be1945b29ec4f1116baa469c17",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/b6471ee3f50381c6b90987f0116e7754ae5aa88d",
              "width": 64
            }
          ],
          "name": "Pacific Daydream",
          "release_date": "2017-10-27",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:3EwfQtjvyRAXsPWAKO5FDP"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 189813,
        "explicit": false,
        "external_ids": {
          "isrc": "USAT21703173"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/1ZLfI1KqHS2JFP7lKsC8bl"
        },
        "href": "https://api.spotify.com/v1/tracks/1ZLfI1KqHS2JFP7lKsC8bl",
        "id": "1ZLfI1KqHS2JFP7lKsC8bl",
        "is_local": false,
        "name": "Mexican Fender",
        "popularity": 57,
        "preview_url": "https://p.scdn.co/mp3-preview/764ce7388143426458be1e9065753b521a4aa4e8?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:1ZLfI1KqHS2JFP7lKsC8bl"
      },
      {
        "album": {
          "album_type": "single",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
              },
              "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
              "id": "3jOstUTkEu2JkjvRdBA5Gu",
              "name": "Weezer",
              "type": "artist",
              "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
            }
          ],
          "available_markets": [
            "AD",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "EC",
            "EE",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IS",
            "IT",
            "JP",
            "LI",
            "LT",
            "LU",
            "LV",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "PA",
            "PE",
            "PH",
            "PL",
            "PT",
            "PY",
            "RO",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/49Xf5WCQH90DOweyvYd0f5"
          },
          "href": "https://api.spotify.com/v1/albums/49Xf5WCQH90DOweyvYd0f5",
          "id": "49Xf5WCQH90DOweyvYd0f5",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/af4d0af95a635d18aa346724829c6409cd0535d6",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/cffaa02b2b02a4cfe395fa37d3f17a998b7c04a5",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/758e16308249aef7ba8ea9d21d62395a4f9880c2",
              "width": 64
            }
          ],
          "name": "Happy Hour (The Remixes)",
          "release_date": "2018-01-26",
          "release_date_precision": "day",
          "type": "album",
          "uri": "spotify:album:49Xf5WCQH90DOweyvYd0f5"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/3jOstUTkEu2JkjvRdBA5Gu"
            },
            "href": "https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu",
            "id": "3jOstUTkEu2JkjvRdBA5Gu",
            "name": "Weezer",
            "type": "artist",
            "uri": "spotify:artist:3jOstUTkEu2JkjvRdBA5Gu"
          },
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/31Eea8xaK1xAMyJy2iWE0z"
            },
            "href": "https://api.spotify.com/v1/artists/31Eea8xaK1xAMyJy2iWE0z",
            "id": "31Eea8xaK1xAMyJy2iWE0z",
            "name": "Eden Prince",
            "type": "artist",
            "uri": "spotify:artist:31Eea8xaK1xAMyJy2iWE0z"
          }
        ],
        "available_markets": [
          "AD",
          "AR",
          "AT",
          "AU",
          "BE",
          "BG",
          "BO",
          "BR",
          "CA",
          "CH",
          "CL",
          "CO",
          "CR",
          "CY",
          "CZ",
          "DE",
          "DK",
          "DO",
          "EC",
          "EE",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "GT",
          "HK",
          "HN",
          "HU",
          "ID",
          "IE",
          "IL",
          "IS",
          "IT",
          "JP",
          "LI",
          "LT",
          "LU",
          "LV",
          "MC",
          "MT",
          "MX",
          "MY",
          "NI",
          "NL",
          "NO",
          "NZ",
          "PA",
          "PE",
          "PH",
          "PL",
          "PT",
          "PY",
          "RO",
          "SE",
          "SG",
          "SK",
          "SV",
          "TH",
          "TR",
          "TW",
          "US",
          "UY",
          "VN",
          "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 212652,
        "explicit": false,
        "external_ids": {
          "isrc": "USAT21800361"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/5ipjhrirlnBV7BMY7QV3H5"
        },
        "href": "https://api.spotify.com/v1/tracks/5ipjhrirlnBV7BMY7QV3H5",
        "id": "5ipjhrirlnBV7BMY7QV3H5",
        "is_local": false,
        "name": "Happy Hour - Eden Prince Remix",
        "popularity": 57,
        "preview_url": "https://p.scdn.co/mp3-preview/18af757e1ecf2d6503bff27406649db8d40d6389?cid=fe8362d03fae494c914dbed629a6f9f8",
        "track_number": 5,
        "type": "track",
        "uri": "spotify:track:5ipjhrirlnBV7BMY7QV3H5"
      }
    ]
  }