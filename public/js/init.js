(function($){
    $(function(){
        //form stuff
        $('.infoText').click(function(){
            $(this).next('P').slideToggle();
        });

        //buttons
        $('#btnCancel').click(function(){
            parent.history.back();
            return false;
        });
        $('.button-collapse').sideNav();
        $('.dropdown-button').dropdown({
                constrain_width: false,
                belowOrigin: true,
                alignment: 'left'
            }
        );
        var $search = $('#search');
        $search.hide();
        $('#searchClose').click(function(){
            if($search.is(':visible')){
                $search.hide();
            }
        });
        $('#searchActivate').click(function(){
            if($search.is(':visible')){
                $search.hide();
            }
            else{
                $search.show();
            }
        });

        //parallax for home page
        $('.parallax').parallax();

    });
})(jQuery);