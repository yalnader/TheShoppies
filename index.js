// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=a0ddb910
//emaple for single serach reults: http://www.omdbapi.com/?apikey=a0ddb910&t=Star+Wars
//emaple for multi  serach reults: http://www.omdbapi.com/?apikey=a0ddb910&s=Star+Wars

//stuff about api doesnt seem to take special characters

var API_KEY = 'a0ddb910'
var currentSearch = [];
var currentNominations = [];

function searchArray(value, prop, searchArray){
    console.log(searchArray , "   Search Array" );
    for(let i = 0; i < searchArray.length; i++){

        if(searchArray[i][prop] === value){
            return searchArray[i];
        }
    }
}

function disableButton(movieId){
    $(`button[value=${movieId}]`).attr({disabled: true});
}

function addNomination(movieId){
    //cant double nominate
    //only add if nomination is new
    if(searchArray(movieId, 'imdbID', currentNominations) || currentNominations.length === 5){
        return ;
    }
    currentNominations.push(searchArray(movieId, 'imdbID', currentSearch));
    disableButton(movieId);
}

function createListItems(data){
    //make sure nominated buttons show up greyed and unclickable
    //use disabled: true to grey button
    $.each(data.Search, function(i, movie) {
        let btnIsDisabled = searchArray(movie.movieId, 'imdbID', currentNominations) ? true : false;
        console.log(searchArray(movie.movieId, 'imdbID', currentNominations));
        let nominateButton = $('<button>').attr({ type: 'button', name:`btn${i}`, value:`${movie.imdbID}`, disabled:btnIsDisabled}).append('Nominate');
        nominateButton.click(function(){
            let movieId = $(this).val();
            // console.log(currentSearch);
            addNomination(movieId);
        });
        $('<li>').append(movie.Title)
        .append(nominateButton)
        .appendTo('#searchList');
    });
}

function clearSearchResults(){
    currentSearch = {};
    $('#searchList').empty();
}

function getSearchResults(query){
    let sourceURL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURI(query)}`;
    $.getJSON(sourceURL)
    .done(function(data){
        currentSearch = data.Search;
        createListItems(data);
    });
}

$(document).ready(function(){
    //trigger search query
    $('#searchForm').submit(function(e){
        e.preventDefault();
        //clear old search reults
        clearSearchResults();
        var searchQuery = $('#searchQuery').val();

        //replace spaces with + tomatch API format
        var cleanedQuery = searchQuery.trim().replace(/\s/g, '+');

        getSearchResults(cleanedQuery);
    });
});

//this fucntion will trigger when the user seraches for a movie title or ID
// function search(){
//     let searchQuery = document.getElementById("searchQuery").value;
//     console.log(searchQuery);
// }

//this function will make the call to the OMDb API and return the JSON given by the API 
// function getmovieJson(){
//     //use Jquery getJson fucntion
// }

