"use strict";function getQueryString(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!==c?unescape(c[2]):null}$(document).ready(function(){var a=navigator.language;"en"==a.split("-")[0]&&(a="en");var b=$.cookie("lang");void 0!==b&&(a=b),b=getQueryString("lang"),null!==b&&(a=b),a=a.toLowerCase(),"en"!=a&&"zh-cn"!==a&&"zh-tw"!==a&&(a="en"),$("body").css({"font-family":a.toLowerCase()}),"en"!==a&&$("body").css({"font-weight":"normal"});var c={load:"current",lng:a,lowerCaseLng:!0,fallbackLng:!1,cookieName:"lang",useCookie:!0,detectLngQS:"lang"};i18n.init(c,function(a){$($(".title div")[0]).html(a("title")),$($(".title div")[1]).html(a("desc")),$(".download .btn-download h3").html(a("download")),$(".download .smaller").html(a("or")),$(".download .btn-offline-download").html(a("offline")),$.each($(".feature"),function(b,c){$(c).find(".desc").html(a("desc"+ ++b)),$(c).find(".content").attr("data-tooltip",a("feature"+b))}),$(".feature .learnmore").html(a("learn")),$(".middle a:nth-child(1) div").html(a("middle1")),$(".middle a:nth-child(2) div").html(a("middle2")),$(".footer li:nth-child(1) h2").html(a("support")),$(".footer li:nth-child(1) div p:nth-of-type(1)").html(a("feedback")),$(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(1)").html(a("contact")),$(".footer li:nth-child(1) div p:nth-of-type(2) a:nth-of-type(2)").html(a("author").toLowerCase()),$(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(2)").html(a("end").toLowerCase()),$(".footer li:nth-child(2) h2").html(a("author")),$(".footer li:nth-child(2) p:nth-child(2)").html(a("job")),$(".footer .copyright span:nth-child(1)").html(a("footer"))}),$(".btn-download").click(function(){window.location.href="https://chrome.google.com/webstore/detail/kbgmbmkhepchmmcnbdbclpkpegbgikjc?hl="+i18n.lng()}),$(".middle a:nth-child(1)").click(function(){var a=i18n.lng();window.location.href="https://github.com/kenshin/simptab/blob/master/README."+("en"===a?a:a.split("-")[1])+".md"})});