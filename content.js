// helper function //
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// receive activation message from popup.js and respond with data from webpage
	if(request.action == "Activate"){
		console.log("message receieved");

	    sendResponse({data: document.body.innerText});
	    console.log("webpage text has been pulled");
	}

});

