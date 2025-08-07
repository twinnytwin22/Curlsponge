(() => { 
    $('.image-liquid')
    .on('mouseenter', (event) => {
        var parentOffset = $(event.currentTarget).offset(),
            relX = event.pageX - parentOffset.left,
            relY = event.pageY - parentOffset.top;

        $(event.currentTarget).find('.hover').css({top:relY, left:relX,"transition": "all .6s ease"})
    })
    .on('mouseout', (event) => {
        var parentOffset = $(event.currentTarget).offset(),
            relX = event.pageX - parentOffset.left,
            relY = event.pageY - parentOffset.top;

        $(event.currentTarget).find('.hover').css({top:relY, left:relX,"transition": "all .6s ease"})
    })
})();