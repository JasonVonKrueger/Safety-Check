/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
 
(() => {
  // The initialize function must be run each time a new page is loaded
  Office.initialize = (reason) => {
    $(document).ready(() => {    
      var item = Office.context.mailbox.item;
      getBody();
    });
  };
 
  function getBody() {
    var _item = Office.context.mailbox.item;
    body = _item.body;
   
    // Get the body asynchronous as text
    body.getAsync(Office.CoercionType.Text, function (asyncResult) {
        if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
            // TODO: Handle error
        }
        else {
            // Show data
            var bodytext = asyncResult.value.trim();
 
            checkBody(bodytext);
        }
    });
   }
 
   function checkBody(bodytext) {
        $.ajax({
            type: 'POST',
            url: 'https://webservices.clayton.edu/officeapps/SafetyCheck/AppRead/Home/Handler.ashx',
            data: {
                task: 'checkBody',
                msg: encodeURIComponent(bodytext),
            },
            success: function (returnvalue) {              
                var isMal = returnvalue;
 
                if (isMal == 'Y') {
                    displayBad();
                }
                else {
                    $('#run').show();
                    displayGood();
                }
            }
        });
    }
 
  function displayGood() {
        var msg = "This email has not been reported as malicious but that doesn't mean it's not. " +
                  "What to look for: <br /><br /><ul><li>Poor grammar and spelling</li>" +
                  "<li>Requests for financial information</li>" +
                  "<li>Requests for personal information such as a social security number or password</li>" +
                  "<li>Links to sites that ask for the above information</li></ul>";
                   
        $('#statusImage').html('<img src="assets/tick.png" width="50" />');
        $('#statusText').html(msg);     
    }
 
  function displayBad() {
         
        $('#statusImage').html('<img src="assets/stop-ico.png" width="50"/>');
        $('#statusText').text(" This e-mail contains known malicious content. You should disregard it!");       
  }
   
 
})();