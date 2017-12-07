function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

//send message to content.js to begin parsing article in the event that the 
//extension was clicked
chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "Activate"}, function (response) {
      // Check for error
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
      else {
        // Set bias score and leand score to received message from content.js
        let bias_score = score(response.data);
        // Call bias score function 
        Display_Bias_Score_Word(bias_score);
        let lean_score = lean(response.data);
        console.log("lean_score");
        console.log(lean_score); 
        // Call political lean function
        Display_Political_Lean(lean_score);
        chrome.storage.sync.get('lean', function (items) {
          console.log(items.lean);
          // Check whether user has a history of read pages
          if (!items.lean) {
            chrome.storage.sync.set({'lean': [lean_score]});
            // Notify that we saved.
            console.log('lean saved, storage no longer empty');
            console.log(items.lean);
          }
          else {
            // Create empty variables
            let conservative_count = 0;
            let liberal_count = 0;
            // Increment 
            var arraylength = items.lean.length;
            for (let i = 0; i < arraylength; i ++) {
              if ('1' == items.lean[i]) {
                liberal_count += 1;
              }
              else if ('-1' == items.lean[i]) {
                conservative_count += 1;
              }
            }
            // Display search history percentages
            Display_Search_History(conservative_count, liberal_count);
            // Add new search result to storage
            let copy = items.lean.slice();
            copy.push(lean_score);
            chrome.storage.sync.set({'lean': copy});
          };
        }
      )};
    });
});

//function which takes a string and returns bias score
function score(text){

  //for text, interpret any non letter character besides hyphen as the end of a word
  //javascript split to parse accordingly
  let words_article = text.split(" ");

  //make set of words in webpage
  let set_article = new Set(words_article);

  //text from bias txt file: interpret new line as the end of a word
  let words_polarizing = bias_array;

  //make set of words in txt file
  let set_polarizing = new Set(words_polarizing);

  //find intersection between set from webpage and set of biased words
  let intersection = new Set([...set_article].filter(x => set_polarizing.has(x)));
  console.log(intersection)

  //count number of biased words and compare to wordcount of article, return tier underwhich ratio falls
  let bias = intersection.size;
  console.log("number of bias words");
  console.log(bias);
  let total = words_article.length;
  let bias_score = bias / total;
  console.log("ratio of bias words to total worlds");
  console.log(bias_score);

  return bias_score;
}

// Function to identify the political lean of the article
function lean(text){

  // For text, interpret any non letter character besides hyphen as the end of a word
  // Javascript split to parse accordingly
  let words_article = text.split(" ");

  // Make set of words in webpage
  let set_article = new Set(words_article);

  // Text from conservative txt file: interpret new line as the end of a word
  let words_conservative = conservative_array;

  // Text from liberal txt file: interpret new line as the end of a word
  let words_liberal = liberal_array;

  // Make set of words in txt file
  let set_conservative = new Set(words_conservative);

  // Make set of words in txt file
  let set_liberal = new Set(words_liberal);

  // Find intersection between set from webpage and set of conservative words
  let intersection_conservative = new Set([...set_article].filter(x => set_conservative.has(x)));
  console.log("conservative words");
  console.log(intersection_conservative);

  // Find intersection between set from webpage and set of liberal words
  let intersection_liberal = new Set([...set_article].filter(x => set_liberal.has(x)));
  console.log("liberal words");
  console.log(intersection_liberal);

  // Count number of biased words and compare to wordcount of article, return tier underwhich ratio falls
  let conservative_bias = intersection_conservative.size;
  let liberal_bias = intersection_liberal.size;
  
  // Compare number of liberal words with number of conservative words, return +1 if outcome
  // Skews liberal, -1 if outcome skews conservative, and 0 if the numbers of conservative and
  // Liberal words are equal
  let outcome = liberal_bias - conservative_bias;
  if(outcome > 0)
  {
    return 1;
  }

  if(outcome < 0)
  {
    return -1;
  }

  if(outcome == 0)
  {
    return 0;
  }
}

// Display bias score within box of corresponding color
function Display_Bias_Score_Word(bias_score){
  if (0 <= bias_score && bias_score <= 0.01)
  {
    document.getElementById("bias").innerHTML = 'Neutral';
    document.getElementById("biaslevel").style.background = "PaleGreen";

  }
  else if (0.01 < bias_score && bias_score <= 0.025)
  {
    document.getElementById("bias").innerHTML = 'Skewed';
    document.getElementById("biaslevel").style.background = "Orange";
  }
  else
  {
    document.getElementById("bias").innerHTML = 'Biased';
    document.getElementById("biaslevel").style.background = "OrangeRed";
  }
}

// Display political lean within box of corresponding color
function Display_Political_Lean(political_lean){
  if (political_lean < 0)
  {
    document.getElementById("lean").innerHTML = 'Conservative';
    document.getElementById("politicallean").style.background = "LightCoral";
  }
  if (political_lean == 0)
  {
    document.getElementById("lean").innerHTML = 'Neutral';
    document.getElementById("politicallean").style.background = "LightGoldenRodYellow";
  }
  if (political_lean > 0)
  {
    document.getElementById("lean").innerHTML = 'Liberal';
    document.getElementById("politicallean").style.background = "DodgerBlue";
  }
}

// Display counts of read articles within liberal box and conservative box
function Display_Search_History(conservative_count, liberal_count) {
  document.getElementById("conservative").innerHTML = (conservative_count);
  document.getElementById("searchhistory_conservative").style.background = "LightCoral";

  document.getElementById("liberal").innerHTML = (liberal_count);
  document.getElementById("searchhistory_liberal").style.background = "DodgerBlue";
}
