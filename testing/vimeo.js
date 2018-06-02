// https://api.vimeo.com/videos?query=surfing
// client identifier be5d6a256d73366bd96187fca2f027ebe6e5695d
// Client Secrets: wdhlXe2lFZLSLYQ/fmrZC7Ul3ndKbvsEhAfPwQ2hzJg4sDGlncR1NiX+IyLtLv3XykD9TRg8OwCxYf9a54bk7P21/PZw64NlVFyQ7lCVNJsSTEnj6KgGbRUfHr1ihnTR
var client_id="be5d6a256d73366bd96187fca2f027ebe6e5695d";
var client_secret="wdhlXe2lFZLSLYQ/fmrZC7Ul3ndKbvsEhAfPwQ2hzJg4sDGlncR1NiX+IyLtLv3XykD9TRg8OwCxYf9a54bk7P21/PZw64NlVFyQ7lCVNJsSTEnj6KgGbRUfHr1ihnTR"
$.ajax({
    url: "https://api.vimeo.com/oauth/authorize/client",
    method: "POST",
    grant_type:"authorization_code",
    beforeSend: function (xhr) {
        /* Authorization header */
        xhr.setRequestHeader("Authorization : basic " + base64(client_id + ":" + client_secret));
    },
    success: function (data) {
        console.log(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {

    }
});