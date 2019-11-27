$(document).ready(function(){
    var buttons = ".buttons .nav-link:nth-child";
    $(buttons + '(1) .icon').hover(
        //hover function
        function(){
            $(this).css({
                "border-radius" : "30px",
                "padding" : "20px 10px"
            });

            $(buttons + '(1) .icon-text').css({
                "width" : "130px",
                "padding" : "6px 39px"
            });
        },

        //hover over function
        function(){
            $(this).css({
                "border-radius": "20px 10px",
                "padding" : "10px 13px"
            });

            $(buttons + '(1) .icon-text').css({
                "width" : "0px",
                "padding" : "6px 0px"
            });
        }
    );

    $(buttons + '(2) .icon').hover(
        //hover function
        function(){
            $(this).css({
                "border-radius" : "30px",
                "padding" : "20px 10px"
            });

            $(buttons + '(2) .icon-text').css({
                "width" : "130px",
                "padding" : "6px 39px"
            });
        },

        //hover over function
        function(){
            $(this).css({
                "border-radius": "20px 10px",
                "padding" : "10px 13px"
            });

            $(buttons + '(2) .icon-text').css({
                "width" : "0px",
                "padding" : "6px 0px"
            });
        }
    );

    $(buttons + '(3) .icon').hover(
        //hover function
        function(){
            $(this).css({
                "border-radius" : "30px",
                "padding" : "20px 10px"
            });

            $(buttons + '(3) .icon-text').css({
                "width" : "130px",
                "padding" : "6px 39px"
            });
        },

        //hover over function
        function(){
            $(this).css({
                "border-radius": "20px 10px",
                "padding" : "10px 13px"
            });

            $(buttons + '(3) .icon-text').css({
                "width" : "0px",
                "padding" : "6px 0px"
            });
        }
    );

    $(buttons + '(4) .icon').hover(
        //hover function
        function(){
            $(this).css({
                "border-radius" : "30px",
                "padding" : "20px 10px"
            });

            $(buttons + '(4) .icon-text').css({
                "width" : "130px",
                "padding" : "6px 39px"
            });
        },

        //hover over function
        function(){
            $(this).css({
                "border-radius": "20px 10px",
                "padding" : "10px 13px"
            });

            $(buttons + '(4) .icon-text').css({
                "width" : "0px",
                "padding" : "6px 0px"
            });
        }
    );
});