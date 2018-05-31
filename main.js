const YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = "AIzaSyA1t6WOmG1OcLBTdSqCJAWRAokIEj0jmyM";
const YT_WATCH_URL = "https://www.youtube.com/watch?v=";

//declaring global variables to pass values into with the functions to store between requests
let QUERY;
let nextPageToken = "";
let prevPageToken = "";

function dataRequest(query, pageToken) {
    //set parameters and ajax request, call displayResults() from within ajax request function
    let parameters = {
        part: 'id, snippet',
        key: API_KEY,
        q: query,
        pageToken: pageToken,
    }
    $.getJSON(YT_SEARCH_URL, parameters, function(data){
        console.log(data);

        //if data has nextPageToken, show the button and store value
        if(data.nextPageToken) {
            $('.btn-next').show();
            nextPageToken = data.nextPageToken;
        }

        //if data has prevPageToken, show the button and store value
        if(data.prevPageToken) {
            $('.btn-prev').show();
            prevPageToken = data.prevPageToken;
        }
        displayResults(data.items);
    });
}

function displayResults(results) {
    //Appends data to js-results div in DOM
    //use for each to iterate through
    //store values for img ref and a ref
    //generate string literal with thumbnail img wrapped in a link (<a>)

    //empty html string that will be updated in the for each function
    let resultsHTML = "";
    $.each(results, function(index, value){
        let thumbnailLink = YT_WATCH_URL + value.id.videoId;
        let thumbnailImg = value.snippet.thumbnails.default.url;
        let thumbnailAlt = value.snippet.title;
        resultsHTML += `<div class="js-thumbnail"><a href="${thumbnailLink}" 
        role="link"><img src="${thumbnailImg}" 
        title="${thumbnailAlt}"></a></div>`; 
    });
    $('.js-results').html(resultsHTML); ;
}

function watchSubmit() {
    //triggers actions when submit button is clicked
    //need text input value saved
    //call ajax function
    $('#js-search-form').submit(function(event) {
        event.preventDefault();
        let query = $(event.currentTarget).find('input[name="search-query"]').val().trim();
        QUERY = query;
        dataRequest(query, "");
    });

    //triggers dataRequest function when clicked
    $('.btn-next').click(function(event) {
        dataRequest(QUERY, nextPageToken);
    });

    $('.btn-prev').click(function(event) {
        dataRequest(QUERY, prevPageToken);
    });
}

$(function() {
    watchSubmit();
});