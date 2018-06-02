
      function start() {
          // 2. Initialize the JavaScript client library.
          gapi.client.init({
              'apiKey': 'AIzaSyAZRFBBX9Rt_eIDegWubAFlGg1JeDdtk9s',
             
          }).then(function () {
              // 3. Initialize and make the API request.
              return gapi.client.request({
                  'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
              })
          }).then(function (response) {
              console.log(response.result);
          }, function (reason) {
              console.log('Error: ' + reason.result.error.message);
          });
      };
      // 1. Load the JavaScript client library.
      gapi.load('client', start);
