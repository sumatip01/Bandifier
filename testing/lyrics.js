var albumID;
var trackID;
var track;
var artistName;
var APIkey="003b119f7901034749c7fd78d8ea9bfc";

$(".track-submit").on("click",function(){
    track=$(".lyric-input").val();
    //must replace space with %20 for query
    track=track.replace(/ /g,"%20");
    console.log(track);

    var queryUrl="https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track="+track+"&quorum_factor=1&apikey="+APIkey;
    $.ajax({
        url:queryUrl,
        dataType:"jsonp",
        method:"GET",
        
    })
    .then(function(response){
    
        trackID=response.message.body.track_list[0].track.track_id;
    })
    .then(function(){
        url2="https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id="+trackID+"&apikey="+APIkey;
    
        $.ajax({
            url:url2,
            method:"GET",
            dataType:"jsonp"
        }).then(function(response){
            var str=response.message.body.lyrics.lyrics_body;
            str=str.substring(0,str.length-"******* This Lyrics is NOT for Commercial use ******* (1409617737497)".length)
            $("<p>").text(str).prependTo(".lyric-result");
            
        })
    
    });
    $("lyric-input").text("");



})
//get tracks
//http://api.musixmatch.com/ws/1.1/track.search?q_artist=justin bieber&page_size=3&page=1&s_track_rating=desc
$(".artist-submit").on("click",function(){
    artist=$(".artist-input").val();
    //must replace space with %20 for query
    artist=artist.replace(/ /g,"%20");

    var queryUrl="https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist="+artist+"&apikey=003b119f7901034749c7fd78d8ea9bfc";
    $.ajax({
        url:queryUrl,
        dataType:"jsonp",
        method:"GET",
        
    })
    .then(function(response){
        var arr=response.message.body.track_list
        for(i=0;i<arr.length;i++){
            console.log(arr[i].track.track_name);
        }
    })

})

/* 
<select name="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>
*/