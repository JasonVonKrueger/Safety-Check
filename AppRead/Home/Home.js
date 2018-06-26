/// <reference path="../App.js" />
// global app

(function () {
    'use strict';

    // The Office initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
			
			// start this baby....
			sendRequest();
        });
    };

    function sendRequest() {
        // Create a local variable that contains the mailbox.
        var mailbox = Office.context.mailbox;

        mailbox.makeEwsRequestAsync(getBodyRequest(mailbox.item.itemId), callback);
    }
	
	function displayGood() {
		var msg = "This email has not been reported as malicious, but it should be reported if the content looks suspicious. " +
				  "What to look for: <ul><li>Poor grammar and spelling</li>" +
			      "<li>Requests for financial information</li>" +
                  "<li>Requests for personal information such as a social security number or password</li>" +
				  "<li>Links to sites that ask for the above information</li></ul>";
				  
		$('#statusImage').html('<img src="../../Images/tick.png" width="20" />');
		$('#statusText').html(msg);		
	}

	function displayBad() {
		$('#statusImage').html('<img src="../../Images/stop-ico-3a53fc3.png" />');
		$('#statusText').text(" This e-mail contains known malicious content. You should disregard it!");		
	}
	
	function getBodyRequest(id) {
	   // Return a GetItem operation request for the body of the specified item. 
	   var result = 
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
		'               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
		'               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
		'               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
		'  <soap:Header>' +
		'    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
		'  </soap:Header>' +
		'  <soap:Body>' +
		'    <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">' +
		'      <ItemShape>' +
		'        <t:BaseShape>IdOnly</t:BaseShape>' +
		'        <t:AdditionalProperties>' +
		'            <t:FieldURI FieldURI="item:Body"/>' +
		'        </t:AdditionalProperties>' +
		'      </ItemShape>' +
		'      <ItemIds><t:ItemId Id="' + id + '"/></ItemIds>' +
		'    </GetItem>' +
		'  </soap:Body>' +
		'</soap:Envelope>';
	
	   return result;
	}	
	
	function callback(asyncResult) {
	   var result = asyncResult.value;
	   var context = asyncResult.context;

	   $.ajax({
	       type: 'POST',
	       url: '/officeapps/safetycheck/AppRead/Home/handler.ashx',
	       data: {
	           msg: encodeURIComponent(result),
	       },
	       success: function (returnvalue) {	           
	           var isMal = returnvalue;

	           if (isMal == 'Y') {
	               displayBad();
	           }
	           else {
	               displayGood();
	           }
	       }
	   });
	}


})();