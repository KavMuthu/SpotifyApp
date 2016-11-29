/**
 * Created by Kavi on 11/15/16.
 */
//search artist api call
var search_url = 'https://api.spotify.com/v1/search';
var searchArtists = function(query) {
    var url = search_url;
    return $.ajax({
        url: url,
        data: {
            q:query,
            type:'artist'
        }
    })
};
//search album api call
var searchAlbums = function(query) {
    var url = search_url;
    return $.ajax({
        url: url,
        data: {
            q:query,
            type:'album'
        }
    })
};
//search tracks api call
var searchTracks = function(query) {
    var url = search_url;
    return $.ajax({
        url: url,
        data: {
            q:query,
            type:'track'
        }
    })
};
//search for related artists api call
var getArtistRelatedArtists = function(query){

    return $.ajax({

        url:'https://api.spotify.com/v1/artists/' + query + '/related-artists',

    });
};
//get several artists 
var getArtists = function (query) {
   return $.ajax({
       url: 'https://api.spotify.com/v1/artists?'+'ids='+query.join(','),

    });
};
