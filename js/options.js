
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    /*********************************************
     * Data Structure
     *********************************************/

    var storage = ( function () {
            var key      = "simptab-options",
                _storage = {
                    version: chrome.runtime.getManifest().version,
                    topsites: {
                        enable: false,
                        custom: "",
                    },
                    css: "",
                    search: [
                        '{"key":"g",  "title":"谷歌搜索",    "query": "https://www.google.com/search?q={query}"}',
                        '{"key":"b",  "title":"必应搜索",    "query": "https://bing.com/search?q={query}"}',
                        '{"key":"d",  "title":"DuckDuckGo", "query": "https://duckduckgo.com/?q={query}"}',
                        '{"key":"bd", "title":"百度搜索",    "query": "https://www.baidu.com/s?wd={query}"}',
                    ],
                };

            function Storage() {
                this.db = localStorage[ key ];
                if ( !this.db ) {
                    this.db = $.extend( {}, _storage );
                    localStorage.setItem( key, JSON.stringify( this.db ));
                } else this.db = JSON.parse( this.db );
                this.key = key;
            }

            Storage.prototype.Set = function() {
                localStorage.setItem( key, JSON.stringify( this.db ));
            }

            Storage.prototype.Get = function() {
                return this.db;
            }

            Storage.prototype.Clear = function() {
                localStorage.removeItem( key );
            }

            return new Storage();

        })();

    /*********************************************
     * Custom style
     *********************************************/

    function customStyleView() {
        var tmpl = '<textarea class="md-textarea"></textarea>';
        return tmpl;
    }

    function customStyleModel() {
        $( ".options .custom-style" ).find( "textarea" ).text( storage.db.css );
        $( ".options" ).on( "keyup", ".custom-style textarea", function( event ) {
            storage.db.css = event.target.value;
            storage.Set();
            custom();
        });
    }

    function custom() {
        if ( $( "#simptab-options" ).length >= 0 ) $( "#simptab-options" ).remove();
        $( "head" ).append( '<style id="simptab-options" type="text/css">' + storage.db.css + '</style>' );
    }

    /*********************************************
     * Custom topsites
     *********************************************/

    function customTpView() {
        var tmpl = '<div class="switche">\
                        <div class="label">' + i18n.GetLang( "options_custom_tp_cbx" ) + '</div>\
                        ' + comps.Switches( "custom-tp-cbx" ) + '\
                   </div>\
                   <div class="custom-tp-fields">\
                        <textarea class="md-textarea"></textarea>\
                        <div class="notice">' + i18n.GetLang( "options_custom_tp_notice" ) + '</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function customTpModel() {
        var textareaState = function( state ) {
            state ? $( ".options .custom-tp-fields" ).removeClass( "hide" ).addClass( "show" ) : $( ".options .custom-tp-fields" ).removeClass( "show" ).addClass( "hide" );
        };
        $( ".options .custom-tp" ).find( "input[id=custom-tp-cbx]" ).prop( "checked", storage.db.topsites.enable );
        $( ".options .custom-tp" ).find( "textarea" ).text( storage.db.topsites.custom );
        textareaState( storage.db.topsites.enable );
        $( ".options" ).on( "change", ".custom-tp input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            textareaState( value );
            storage.db.topsites.enable = value;
            storage.Set();
        });
        $( ".options" ).on( "keyup", ".custom-tp textarea", function( event ) {
            storage.db.topsites.custom = event.target.value;
            storage.Set();
        });
    }

    /*********************************************
     * Custom Search
     *********************************************/

    function customSearchView() {
        var tmpl = '<textarea class="md-textarea"></textarea>';
        return tmpl;
    }

    function customSearchModel() {
        $( ".options .custom-search" ).find( "textarea" ).text( storage.db.search.join( "\n" ) );
        $( ".options" ).on( "keyup", ".custom-search textarea", function( event ) {
            storage.db.search = event.target.value.split( "\n" );
            storage.Set();
        });
    }

    /*********************************************
     * Footer
     *********************************************/

    function footerView() {
        var tmpl = '<div class="footer">\
                        <div class="waves-effect button import">' + i18n.GetLang( "zen_mode_setting_import" ) + '</div>\
                        <div class="waves-effect button export">' + i18n.GetLang( "zen_mode_setting_export" ) + '</div>\
                        <div class="waves-effect button clear">'  + i18n.GetLang( "options_footer_clear" )    + '</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function footerModel() {
        $( ".options" ).on( "click", ".footer .import", function( event ) {
            var input  = document.createElement( "input" ),
                $input = $(input),
                onload = function( event ) {
                    if ( event && event.target && event.target.result ) {
                        try {
                            storage.db = JSON.parse( event.target.result );
                            storage.Set();
                            new Notify().Render( i18n.GetLang( "notify_zen_mode_import_success" ));
                        } catch ( error ) {
                            new Notify().Render( 2, i18n.GetLang( "notify_zen_mode_import_failed" ));
                        }
                    }
                };
            $input.attr({ type : "file", multiple : "false" })
                .one( "change", function( event ) {
                    var reader = new FileReader();
                    reader.onload = onload;
                    reader.readAsText( event.target.files[0] );
            });
            $input.trigger( "click" );
        });
        $( ".options" ).on( "click", ".footer .export", function( event ) {
            var data = "data:text/json;charset=utf-8," + encodeURIComponent( localStorage[ storage.key ] ),
                $a   = $( '<a style="display:none" href='+ data + ' download="simptab-config.json"></a>' ).appendTo( "body" );
            $a[0].click();
            $a.remove();
        });
        $( ".options" ).on( "click", ".footer .clear", function( event ) {
            new Notify().Render( "snackbar", i18n.GetLang( "notify_options_clear" ), i18n.GetLang( "notify_options_agree" ), () => {
                storage.Clear();
                new Notify().Render( i18n.GetLang( "notify_options_clear_success" ));
            });
        });
    }

    /*********************************************
     * Dialog
     *********************************************/

    function render() {
        var tmpl = '\
                    <div class="close"><span class="close"></span></div>\
                    <div class="options">\
                        <div class="head">选项</div>\
                        <div class="content">\
                            <div class="title">' + i18n.GetLang( "options_custom_style" ) + '</div>\
                            <div class="group custom-style">' + customStyleView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_search" ) + '</div>\
                            <div class="group custom-search">' + customSearchView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_tp" ) + '</div>\
                            <div class="group custom-tp">' + customTpView() + '</div>\
                        </div>\
                        ' + footerView() + '\
                    </div>\
                    ';
        $( ".dialog" ).html( tmpl );
        customTpModel();
        customStyleModel();
        customSearchModel();
        footerModel();
    }

    function close() {
        $( ".dialog .close" ).click( function( event ) {
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Init: function() {
            storage.db.css != "" && custom();
        },

        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                render();
                close();
            }, 10 );
        },

        Storage: storage,
    }

});