const { DownloadItem, ipcRenderer } = require("electron");

// buttons
const search_bar = document.getElementById("SearchBar");
const search_button = document.getElementById("SearchButton");
const search_image_button = document.getElementById("SearchImageButton");
const next_button = document.getElementById("Next");
const prev_button = document.getElementById("Prev");

// result container
const results_container = document.getElementById("result_container");

// page counters
var page = 0;

// response and parser
var response;
var parser = new DOMParser();
var resultHTML;



next_button.style.display = "none";
prev_button.style.display = "none";

// This function is used to take in a URL and fill the result container with the scraped information.
// Once the HTML is fetched, I use a parser to find specific parts of each "g" class to scrape and
// add into the list of results. 
function fetchWeb(url){
    fetch(url, {
        headers: {
            'User-Agent': "Mozilla/5.0",
            'Access-Control-Allow-Origin': '*'
        }
    }).then(function(fetchResponse){
        return fetchResponse.text();
    }).then(function(text) {
            response = text;
            resultHTML = parser.parseFromString(text, "text/html");

            var result_list = resultHTML.getElementsByClassName("g");

            for(var i = 0; i < result_list.length; i++ ){
                if(result_list[i].className === "g"){
                    const link = result_list[i].querySelector("[href]");
                    const title = result_list[i].getElementsByTagName("H3");
                    const description = result_list[i].getElementsByClassName("aCOpRe");
                    
                    results_container.innerHTML += "<Li>" + title[0].innerText + "</Li> <dd></dd>" + 
                                                   '<a href="' + link.getAttribute("href") + '">' + link.getAttribute("href") + "</a> <dd></dd>" +
                                                   "<Li>" + description[0].innerText + "</Li> <br></br>";
                }
            }
        }).catch(function(error){
            console.log(error);
    }) 
}


// used to find standard web results
search_button.onclick = function(event) {
    event.preventDefault();
    next_button.style.display = "block";
    prev_button.style.display = "block";

    page = 1;
    const searchString = search_bar.value;
    results_container.innerHTML = "";
    const url = "https://www.google.com/search?q=" + searchString.replaceAll(" ", "+");

    fetchWeb(url);

}

// goes to the next page of web results
next_button.onclick = function(event) {
    event.preventDefault();

    page++;
    results_container.innerHTML = "";
    const next_html = resultHTML.getElementById('pnnext');
    const url = "https://www.google.com/" + next_html.getAttribute("href");
    
    fetchWeb(url);
    
}

// goes to previous page of web results 
prev_button.onclick = function(event) {
    event.preventDefault();

    if(page > 1){
        page--;
        results_container.innerHTML = "";
        const prev_html = resultHTML.getElementById('pnprev');
        const url = "https://www.google.com/" + prev_html.getAttribute("href");
        
        fetchWeb(url);
    }
    
}


// ----------------------------------------------------------------------------------------

// This function will be used when the user clicks the search images button. It will make an IPC
// communication call to the index.js class to load the url into the hidden window and get the
// dom tree returned back. Once that is returned, it is scraped for the objects that contain
// the needed HTML for the images and URLs to be added into the result container.
search_image_button.onclick = async function(event) {
    event.preventDefault();

    next_button.style.display = "none";
    prev_button.style.display = "none";

    const searchString = search_bar.value;
    results_container.innerHTML = "";
    const url = "https://www.google.com/search?q=" + searchString.replaceAll(" ", "+") + "&source=lnms&tbm=isch";
    
    const response = ipcRenderer.sendSync('synchronous-message', url);
    
    resultHTML = parser.parseFromString(response, "text/html");
    var result_list = resultHTML.querySelectorAll('[jsname="N9Xkfe"]');


    for(var i = 0; i < result_list.length; i++ ){
        try{
            const childWithImg = result_list[i].firstElementChild.firstElementChild.firstElementChild;
            if(childWithImg.hasAttribute("src")){
                results_container.innerHTML += result_list[i].outerHTML + "<br></br>";
            
            }
        }
        catch(error){
            console.log("Image not completely loaded");
        }
    }
}




