console.log("hi");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("before if");
	if(request.action == "Activate"){
		console.log("message receieved");

	    sendResponse({data: document.body.innerText});
	    console.log("webpage text has been pulled");
	}

});

