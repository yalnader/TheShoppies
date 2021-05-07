// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=a0ddb910
//emaple for single serach reults: http://www.omdbapi.com/?apikey=a0ddb910&t=Star+Wars
//emaple for multi  serach reults: http://www.omdbapi.com/?apikey=a0ddb910&s=Star+Wars

//stuff about api doesnt seem to take special characters

var API_KEY = 'a0ddb910'
var currentSearch = [];
var currentNominations = [];

function searchArray(value, prop, searchArray){
    for(let i = 0; i < searchArray.length; i++){

        if(searchArray[i][prop] === value){
            return searchArray[i];
        }
    }
    return false;
}

function removeItemFromArray(value, prop, searchArray){
    return searchArray.filter(movie => movie[prop] !== value);
}

function disableButton(movieId){
    $(`#searchList button[value=${movieId}]`).attr({disabled: true});
}

function removeNomination(movieId){
    currentNominations = removeItemFromArray(movieId, 'imdbID', currentNominations);
    console.log(currentNominations);

    //update UI

    //remove from Nomination List
    $(`#noimtationsList`).empty();
    $.each(currentNominations, function(i, movie) {
        createNominatedListItem(movie.imdbID);
    });
    //enable button in Search List
    $(`#searchList button[value=${movieId}]`).attr({disabled: false});
}

function createNominatedListItem(movieId){
    let movie = searchArray(movieId, 'imdbID', currentNominations);
    let removeButton = $('<button>').attr({ type: 'button', name:`btn${currentNominations.length + 1}`, value:`${movieId}`, disabled:false}).append('Remove');

    removeButton.click(function(){
        let movieId = $(this).val();
        removeNomination(movieId);
    });
    let poster = $('<img>')
    .attr('src', movie.Poster)
    .height('90px')
    .width('60px');

    $('<li>').append(poster)
    .append(movie.Title)
    .append(`, ${movie.Year}`)
    .append(removeButton)
    .appendTo('#noimtationsList');

}

function addNomination(movieId){
    //cant double nominate
    //only add if nomination is new
    if(searchArray(movieId, 'imdbID', currentNominations)){
        return ;
    }
    if(currentNominations.length === 5){
        alert("You have five nominations in your list already!");
        return ;
    }
    currentNominations.push(searchArray(movieId, 'imdbID', currentSearch));
    createNominatedListItem(movieId);
    //disable button in search list
    disableButton(movieId);
}

function createListItems(){
    //make sure nominated buttons show up greyed and unclickable
    //use disabled: true to grey button
    $('#errorMessage').empty();
    $.each(currentSearch, function(i, movie) {
        let btnIsDisabled = searchArray(movie.imdbID, 'imdbID', currentNominations) === false ? false : true;
        let nominateButton = $('<button>').attr({ type: 'button', name:`btn${i}`, value:`${movie.imdbID}`, disabled:btnIsDisabled}).append('Nominate');
        let poster = $('<img>')
                    .attr('src', movie.Poster)
                    .height('90px')
                    .width('60px');
                    

        nominateButton.click(function(){
            let movieId = $(this).val();
            addNomination(movieId);
        });

        $('<li>').append(poster)
        .append(movie.Title)
        .append(`, ${movie.Year}`)
        .append(nominateButton)
        .appendTo('#searchList');
    });
    //check if search is empty
    if(currentSearch.length === 0){
        $('#errorMessage').append('No results found');
    }
}

function clearSearchResults(){
    currentSearch = [];
    $('#searchList').empty();
}

function getSearchResults(query){
    let sourceURL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURI(query)}`;
    $.getJSON(sourceURL)
    .done(function(data){
        currentSearch = data.Search? data.Search: [];
        createListItems();
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

