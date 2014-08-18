"use strict";
$( document ).ready( function() {

    var lang = navigator.language;

    // set 'en-XX' to 'en'
    if ( lang.split("-")[0] == "en" ) {
        lang = "en";
    }

    // set cookie
    var newLang = $.cookie( "lang" );
    if ( newLang !== undefined ) {
        lang = newLang;
    }

    // get http://xxxx.index.html?lang=xxx
    newLang = getQueryString( "lang" );
    if ( newLang !== null ) {
        lang = newLang;
    }

    // set lower case
    lang = lang.toLowerCase();

    // set default language
    if ( lang != "en" && lang !== "zh-cn" && lang !== "zh-tw" ) {
        lang = "en";
    }

    // set body font-family
    $( "body" ).css({ "font-family": lang.toLowerCase() });
    if ( lang !== "en" ) {
        $( "body" ).css({ "font-weight": "normal" });
    }

    // set options
    var options = {
        load         : "current",
        lng          : lang,
        lowerCaseLng : true,
        fallbackLng  : false,
        cookieName   : "lang",
        useCookie    : true,
        detectLngQS  : "lang"
    };

    // i18n init
    i18n.init( options, function( t ) {

        $(".title h1 div").html( t( "title" ));
        $(".download .btn-download h3").html( t( "download" ));
        $(".download .smaller").html( t( "or" ));
        $(".download .btn-offline-download").html( t( "offline" ));

        $(".main li:nth-of-type(1) span").html( t( "feature1" ));
        $(".main li:nth-of-type(2) span").html( t( "feature2" ));
        $(".main li:nth-of-type(3) span").html( t( "feature3" ));

        $(".footer li:nth-child(1) h2").html( t( "support" ));
        $(".footer li:nth-child(1) div p:nth-of-type(1)").html( t( "feedback" ));
        $(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(1)").html( t( "contact" ));
        $(".footer li:nth-child(1) div p:nth-of-type(2) a:nth-of-type(2)").html( t( "author" ).toLowerCase() );
        $(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(2)").html( t( "end" ).toLowerCase() );

        $(".footer li:nth-child(2) h2").html( t( "author" ));
        $(".footer li:nth-child(2) p:nth-child(2)").html( t( "job" ));

        $(".footer .copyright span:nth-child(1)").html( t( "footer" ));
    });

});

function getQueryString( name ) {
    var reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)", "i" );
    var r = window.location.search.substr(1).match( reg );
    if (r !== null) return unescape(r[2]); return null;
}