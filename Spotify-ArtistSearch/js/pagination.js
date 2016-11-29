/**
 * Pagination function to display 12 results on the screen.
 */

(function($){
    $.fn.customPaginate = function(options)
    {
        var paginateContainer = this;
        var itemsToPaginate;

        var default_val = {
            itemsPerPage : 12
        };

        var settings = {};

        $.extend(settings,default_val,options);

        itemsToPaginate = $(settings.itemsToPaginate);
        var numofPaginationLinks = Math.ceil((parseInt(itemsToPaginate.length )/parseInt(settings.itemsPerPage)));

        $("<ul class='pagination'></ul>").prependTo(paginateContainer);

        for(var i = 0;i<numofPaginationLinks;i++){
            paginateContainer.find("ul").append("<li> <a>"+ (i+1) +"</a></li>");

        }
        itemsToPaginate.filter(":gt(" + (parseInt(settings.itemsPerPage) -1) +")").hide();
        paginateContainer.find("ul li a").on("click", function(){

            var linkNumber = $(this).text();

            var itemsToHide = itemsToPaginate.filter(":lt(" + (parseInt(linkNumber-1) * parseInt(settings.itemsPerPage)) +")");
            $.merge(itemsToHide, itemsToPaginate.filter(":gt(" + (parseInt(linkNumber * settings.itemsPerPage) -1) +")"));
            itemsToHide.hide();

            var itemsToShow = itemsToPaginate.not(itemsToHide);
            itemsToShow.show();
        });

    };

}(jQuery));