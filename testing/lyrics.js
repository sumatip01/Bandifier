$('.dropdown-trigger').dropdown();

var setLyrics = {
    trackID: "",
    APIkey: "003b119f7901034749c7fd78d8ea9bfc",
    artist: "the strokes",
    getArtist: function () {
        if(sessionStorage.getItem("searchedTerm")){
        setLyrics.artist = sessionStorage.getItem("searchedTerm");
        setLyrics.artist = artist.replace(/ /g, "%20");
        }
    },
    getTracks: function () {
        $.ajax({
            url: "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&page_size=100&q_artist=" + setLyrics.artist + "&apikey=" + setLyrics.APIkey,
            dataType: "jsonp",
            method: "GET",
        })
            .then(function (response) {
                var arr = response.message.body.track_list;
                
                
                for (i = 0; i < arr.length; i++) {
                    
                    var s = $("<span>").addClass("track");
                    var t = $("<li>");
                    s.appendTo(t);
                    t.appendTo(".tracks-dropdown");
                    s.text(arr[i].track.track_name).appendTo(s);
                }
            })
    },
    getLyrics: function () {

        $(".tracks-dropdown").on("click", "span", function () {
            var track = $(this).text();
            track = track.replace(/ /g, "%20");
            console.log(track);
            var trackUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=" + track + "&quorum_factor=1&apikey=" + setLyrics.APIkey;
            $.ajax({
                url: trackUrl,
                dataType: "jsonp",
                method: "GET",

            })
                .then(function (response) {

                    setLyrics.trackID = response.message.body.track_list[0].track.track_id;
                })
                .then(function () {
                    url2 = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=" + setLyrics.trackID + "&apikey=" + setLyrics.APIkey;

                    $.ajax({
                        url: url2,
                        method: "GET",
                        dataType: "jsonp"
                    })
                        .then(function (response) {
                            var str = response.message.body.lyrics.lyrics_body;
                            str = str.substring(0, str.length - "******* This Lyrics is NOT for Commercial use ******* (1409617737497)".length)
                            $("<h5>").text(track).appendTo(".lyrics");
                            $("<p>").text(str).appendTo(".lyrics");
                        })
                });
        });
    }
}

//run function
setLyrics.getArtist();
setLyrics.getTracks();
setLyrics.getLyrics();
