/**
 * This function performs artist search from the Spotify Web Api
 * Author: Kavitha Muthu
 */
(function ($) {
    'use strict';
    //load the page with default artist information and images
    window.onload = default_gallery();

    //populate the page with Bruno Mars images and info
    function default_gallery() {
        $('header').show();
        $('.mini-submenu').focus();
        $('.mini-submenu').blur();
        var search = 'Bruno Mars';
        searchArtists(
            search
        ).then(function (data) {
            if (data.artists && data.artists.items.length) {
                refreshInfo();
                getArtistInfo(data.artists.items[0]);
            }
        });

        var search_album = 'Bruno Mars';
        searchAlbums(
            search_album
        ).then(function (data) {
            if (data.albums && data.albums.items.length) {
                refreshGallery();
                getArtistAlbums(data.albums.items);
                $(".results_subtitle").empty();
                $(".results_subtitle").append('Albums');
            }
        });
    }
    //event listener to perform search for artists based on different criteria
    window.addEventListener('load', function () {

        var formArtist = document.getElementById('search-artist');
        var search_term = document.getElementById('artist-search');
        formArtist.addEventListener('submit', function (e) {

            e.preventDefault();
            // li list value
            var search_criteria = $('.input-group-btn .dropdown-menu li a').parents('.input-group-btn').find('.btn-search').text().trim();

             //event listener for searching artists based on albums and performing a general search for artists
            if (search_criteria == 'Albums' || document.getElementById('Albums').checked) {
                //api method call to search for artists based on album names
                searchAlbums(
                    search_term.value.trim()
                ).then(function (data) {
                    if (data.albums && data.albums.items.length) {
                        refreshInfo();
                        refreshGallery();
                        getArtistsByAlbums(data.albums.items);
                    } else {
                        //zero data check
                        refreshInfo();
                        refreshGallery();
                        $(".results_subtitle").append('Sorry, no artists found.');
                    }
                });

            }
             //event listener for searching artists based on tracks
            else if (search_criteria == 'Tracks' || document.getElementById('Tracks').checked) {
                //api method call to search for artists based on track names
                searchTracks(
                    search_term.value.trim()
                ).then(function (data) {
                    if (data.tracks && data.tracks.items.length) {
                        refreshInfo();
                        refreshGallery();
                        getArtistsByTracks(data.tracks.items);
                    } else {
                        //zero data check
                        refreshInfo();
                        refreshGallery();
                        $(".results_subtitle").append('Sorry, no artists found.');
                    }
                });

            }
            //event listener for searching artists based on related artists
            else if (search_criteria == 'Related Artists' || document.getElementById('Related_Artists').checked) {
                //api method call to search for artists based on related artists
                searchArtists(
                    search_term.value.trim()
                ).then(function (data) {
                    if (data.artists && data.artists.items.length) {
                        refreshInfo();
                        refreshGallery();
                        getArtistsByRelatedArtists(data.artists.items[0]);
                    } else {
                        //zero data check
                        refreshInfo();
                        refreshGallery();
                        $(".results_subtitle").append('Sorry, no artists found.');
                    }
                });
            }
            // event listener for searching artists based on 'no criteria'
            else {
                //api method call to search for artists
                searchArtists(
                    search_term.value.trim()
                ).then(function (data) {
                    if (data.artists && data.artists.items.length) {
                        refreshInfo();
                        getArtistInfo(data.artists.items[0]);
                    }
                    //zero data check
                    if (data.artists.items.length == 0) {
                        refreshInfo();
                        $('.main_search').append("Sorry, no artist found.");
                        refreshGallery();
                    }
                });
                //api method call to fetch artist's albums
                searchAlbums(
                    search_term.value.trim()
                ).then(function (data) {
                    if (data.albums && data.albums.items.length) {
                        refreshGallery();
                        getArtistAlbums(data.albums.items);
                        //zero data check
                    } else {
                        if (data.albums.items.length == 0) {
                            refreshGallery();
                            $(".results_subtitle").append('Sorry, no albums found.');
                        }
                    }
                });
            }

        });

    });
    /**
     *fetches and organizes the required artist's data
     * @param artist - artist json data
     */
    function getArtistInfo(artist) {
        $('header').show();

        if (!artist) {
            return;
        }

        var artist_name = artist.name;
        var imgSrc = '';
        if (artist.images.length) {
            imgSrc = artist.images[1].url;
        } else {
            imgSrc = "images/no_image.png";
        }
        var artist_id = artist.id;
        var artist_followers = artist.followers.total;
        var artist_popularity = artist.popularity;
        var artist_genres = artist.genres;
        createMainSearchDivElements(artist_name, imgSrc, artist_id, artist_followers, artist_popularity, artist_genres);
    }

    /**
     * fetches and organizes the required album's data
     * @param albums - album json data
     */

    function getArtistAlbums(albums) {

        if (!albums) {
            return;
        }
        $('header').show();
        $(".results_subtitle").val('');
        $(".results_subtitle").append('Albums');

        for (var i in albums) {
            if (albums[i].name != null && albums[i].images[0].url != null) {

                var imgUrl = albums[i].images[0].url;
                var imageCaption = albums[i].name;
                var imgId = albums[i].id;

                createGalleryDiv(imgUrl, imageCaption, imgId);

            }
        }
        //pagination
        $(".paginationContainer").customPaginate({

            itemsToPaginate: '.gallery'
        });
    }

    /**
     * fetches the album's name(user input)
     * @param albums - album json data
     */

    function getArtistsByAlbums(albums) {
        $('header').hide();
        $('.results_maintitle').hide();


        var artistId = [];
        for (var i in albums) {
            for (var j in albums[i].artists) {
                artistId.push(albums[i].artists[j].id);
            }
        }
        if(!artistId){
            console.log("no artist");
            //zero data check
            ('.header').hide();
            refreshInfo();
            refreshGallery();
            $(".results_subtitle").append('Sorry, no artists found.');
        }
        //removing duplicate values
        var uniqueIds = [];
        $.each(artistId, function(i, el){
            if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
        });


        getArtists(uniqueIds).then(function (data) {
            fetchArtists(data.artists);
            var caret = document.createElement("span");
            caret.className = 'caret';
            $('.input-group-btn .dropdown-menu li a').parents('.input-group-btn').find('.btn-search').html(caret);
            $("input:radio").attr("checked", false);

        });
    }
    /**
     * fetches the track's name(user input)
     * @param tracks - track json data
     */
    function getArtistsByTracks(tracks) {

        $('header').hide();
        $('.results_maintitle').hide();

        var artistId = [];
        for (var i in tracks) {
            for (var j in tracks[i].artists) {
                artistId.push(tracks[i].artists[j].id);
            }
        }
        if(!artistId){
            console.log("no artist");
            //zero data check
            ('.header').hide();
            refreshInfo();
            refreshGallery();
            $(".results_subtitle").append('Sorry, no artists found.');
        }
        var uniqueIds = [];
        $.each(artistId, function(i, el){
            if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
        });
        getArtists(uniqueIds).then(function (data) {

            fetchArtists(data.artists);
            var caret = document.createElement("span");
            caret.className = 'caret';
            $('.input-group-btn .dropdown-menu li a').parents('.input-group-btn').find('.btn-search').html(caret);
            $("input:radio").attr("checked", false);

        });

    }
    /**
     * fetches the related artist's name(user input)
     * @param artist - artist json data
     */

    function getArtistsByRelatedArtists(artist) {

        $('header').hide();
        $('.results_maintitle').hide();
        $(".results_subtitle").val('');
        $(".results_subtitle").append('Artists');
        
        getArtistRelatedArtists(artist.id).then(function (data) {

            for (var i in data.artists) {
                createGalleryDiv(data.artists[i].images[1].url, data.artists[i].name, data.artists[i].id);
            }
            $(".paginationContainer").customPaginate({

                itemsToPaginate: '.gallery'
            });
            var caret = document.createElement("span");
            caret.className = 'caret';
            $('.input-group-btn .dropdown-menu li a').parents('.input-group-btn').find('.btn-search').html(caret);
            $("input:radio").attr("checked", false);
        });
    }

    /**
     * the fecthed artist data is organized and passed to another method to create UI elements
     * @param artists
     */

    function fetchArtists(artists) {
        if (artists) {
            for (var k in artists) {
                var artist_name = artists[k].name;
                var imgSrc = '';
                if (artists[k].images.length) {
                    imgSrc = artists[k].images[1].url;
                } else {
                    imgSrc = "images/no_image.png";
                }

                var artist_id = artists[k].id;
                $(".results_subtitle").empty();
                $(".results_subtitle").append('Artists');
                createGalleryDiv(imgSrc, artist_name, artist_id);

            }
        }
        $(".paginationContainer").customPaginate({

            itemsToPaginate: '.gallery'
        });

    }

    /**
     * Creates the DOM HTML elements to display the artist information
     * @param artist_name
     * @param imgSrc
     * @param artist_id
     * @param artist_followers
     * @param artist_popularity
     * @param artist_genres
     */

    function createMainSearchDivElements(artist_name, imgSrc, artist_id, artist_followers, artist_popularity, artist_genres) {

        var main_searchResultsDiv = $('.main_search');

        if (artist_name) {

            $(".results_maintitle").empty();
            $(".results_maintitle").append('Artist');


            var galleryContainerDiv = document.createElement('div');
            galleryContainerDiv.className = 'col-md-3 col-sm-6';

            var thumbnail = document.createElement('div');
            thumbnail.id = artist_id;
            thumbnail.className = 'thumbnail';

            var img = $("<img class='img-responsive'/>").attr("src", imgSrc);
            img.appendTo(thumbnail);

            galleryContainerDiv.append(thumbnail);
            $('.main_search_image').append(galleryContainerDiv);


            var imgDiv = $("<img class='img-circle img-responsive' />").attr("src", imgSrc);
            main_searchResultsDiv.append(imgDiv);

            var infoContainerDiv = document.createElement("div");
            infoContainerDiv.className = 'info';

            var nameDiv = document.createElement("h2");
            nameDiv.className = 'results_title';
            nameDiv.append(artist_name);

            var spanDiv = document.createElement("span");


            var followers = artist_followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var followersDiv = document.createElement("p");
            followersDiv.className = 'followers';
            followersDiv.append("Followers: " + followers);


            var popularityDiv = document.createElement("p");
            popularityDiv.className = 'popularity';
            popularityDiv.append("Spotify Popularity: " + artist_popularity + " /100");


            var genresDiv = document.createElement("p");
            genresDiv.className = 'genres';
            if (artist_genres.length) {
                genresDiv.append("Genres: " + artist_genres.join(",  "));

            } else {
                genresDiv.append("Genres: " + 'no genres');
            }

            infoContainerDiv.append(nameDiv);
            spanDiv.append(followersDiv);
            spanDiv.append(popularityDiv);
            spanDiv.append(genresDiv);
            infoContainerDiv.append(spanDiv);
            main_searchResultsDiv.append(infoContainerDiv);

        }

        $('#artist-search').val('');
        $('#artist-search').blur();
    }

    /**
     * Creates a thumbnail gallery to display the albums and artists
     * @param imgUrl
     * @param imageCaption
     * @param imgId
     */

    function createGalleryDiv(imgUrl, imageCaption, imgId) {
        
        var galleryMainDiv = document.createElement('div');
        galleryMainDiv.className = 'gallery';

        var galleryContainerDiv = document.createElement('div');
        galleryContainerDiv.className = 'col-md-3 col-sm-6';

        var thumbnailDiv = document.createElement('div');
        thumbnailDiv.id = imgId;
        thumbnailDiv.className = 'thumbnail';
        var img = $("<img class='img-responsive'/>").attr("src", imgUrl);
        img.appendTo(thumbnailDiv);

        var textDiv = document.createElement('div');
        textDiv.className = 'caption';
        var text = imageCaption;
        textDiv.append(text);

        thumbnailDiv.append(textDiv);
        galleryContainerDiv.append(thumbnailDiv);
        galleryMainDiv.append(galleryContainerDiv);

        $('.row-images').append(galleryMainDiv);

        $('#artist-search').val('');
        $('#artist-search').blur();

    }

    //refresh the header div
    function refreshInfo() {

        $('.main_search').empty();
        $('.main_search_image').empty();
    }

    //refresh the image thumbails
    function refreshGallery() {

        $('.row-images').empty();
        $(".paginationContainer").empty();
        $('.results_subtitle').empty();

    }
    //dropdown menu - positions text next to the search bar on selection.
    $(function () {
        $(".input-group-btn .dropdown-menu li a").click(function () {
            var selectedText = $(this).html();
            $(this).parents('.input-group-btn').find('.btn-search').html(selectedText);

        });
    });

}(jQuery));



