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
    $(`#tableBody button[value=${movieId}]`).attr({disabled: true});
}

function createLimitBanner(){
    let div = $('<div>');
    div.attr({class:'banner'});

    div.append($('<div>')
    .attr({class:'bannerHeader'})
    .append('Notice')
    
    );

    div.append($('<span>')
    .attr({class:'closeBtn'})
    .click(function(){
        $('#bannerDivId').empty();
    })
    .append('&times;')
    );

    div.append($('<div>')
    .attr({class:'bannerBody'})
    .append('Hey! You have made five nominations.')
    );

    div.appendTo('#bannerDivId');
}

function removeNomination(movieId){
    currentNominations = removeItemFromArray(movieId, 'imdbID', currentNominations);
    console.log(currentNominations);

    //update UI

    //remove from Nomination List
    $(`#tableBodyNomination`).empty();
    $.each(currentNominations, function(i, movie) {
        createNominatedListItem(movie.imdbID);
    });
    //enable button in Search List
    $(`#tableBody button[value=${movieId}]`).attr({disabled: false});
    $('#bannerDivId').empty();
}

function createNominatedListItem(movieId){
    let movie = searchArray(movieId, 'imdbID', currentNominations);
    //might have to add class remove to button to idenfity 
    let removeButton = $('<button>').attr({ type: 'button', name:`btn${currentNominations.length + 1}`, value:`${movieId}`, disabled:false}).append('Remove');

    removeButton.click(function(){
        let movieId = $(this).val();
        removeNomination(movieId);
    });
    let tr = $('<tr>');

    let img = `<td> <img src=${movie.Poster} height ='90px' width = '60px' /> </td>`

    tr.append(img);
    tr.append($('<td>').append(movie.Title));
    tr.append($('<td>').append(movie.Year));
    tr.append($('<td>').attr({class:'clickMe'}).append(removeButton));
    tr.appendTo('#tableBodyNomination');


}

function addNomination(movieId){
    if(searchArray(movieId, 'imdbID', currentNominations)){
        return ;
    }
    if(currentNominations.length === 5){
        alert("You have five nominations in your list already!");
        return ;
    }

    currentNominations.push(searchArray(movieId, 'imdbID', currentSearch));
    createNominatedListItem(movieId);
    disableButton(movieId);

    if(currentNominations.length === 5){
        //create callout box here
        createLimitBanner();
    }
}

function createListItems(){
    
    $('#messageError').empty();

    $.each(currentSearch, function(i, movie) {
        let btnIsDisabled = searchArray(movie.imdbID, 'imdbID', currentNominations) === false ? false : true;
        let nominateButton = $('<button>').attr({ type: 'button', name:`btn${i}`, value:`${movie.imdbID}`, disabled:btnIsDisabled}).append('Nominate');
        let img = `<td> <img src=${movie.Poster} height ='90px' width = '60px' /> </td>`;

        nominateButton.click(function(){
            let movieId = $(this).val();
            addNomination(movieId);
        });

        let tr = $('<tr>');
        tr.append(img);
        tr.append($('<td>').append(movie.Title));
        tr.append($('<td>').append(movie.Year));
        tr.append($('<td>').attr({class:'clickMe'}).append(nominateButton));
        tr.appendTo('#tableBody');
        
    });

    //check if search is empty
    if(currentSearch.length === 0){
        $('#messageError').append('No results found');
    }
}

function clearResults(id){
    currentSearch = [];
    $(`#${id}`).empty();
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
        clearResults('tableBody');
        var searchQuery = $('#searchQuery').val();

        //replace spaces with + tomatch API format
        var cleanedQuery = searchQuery.trim().replace(/\s/g, '+');

        getSearchResults(cleanedQuery);
    });
});

