// ==UserScript==
// @name          Starwood Omniture Detector
// @namespace     http://lacek.com/starwood/
// @description   Shows a popup that tells what omniture codes are on the page
// @include       https://local.spgpromos.com/*
// @include       https://qa.spgpromos.com/*
// @include       http://dev.spgpromos.com/*
// @include       https://dev.spgpromos.com/*
// @include       http://staging.spgpromos.com/*
// @include       https://staging.spgpromos.com/*
// @include       http://www.spgpromos.com/*
// @include       https://www.spgpromos.com/*
// @exclude
// @exclude
// ==/UserScript==

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function run(){
    var omni_imgs = xpath("//img[@name='s_i_swhstarwoodver2dev' or @name='s_i_swhstarwoodver2']");

    var omni_vals = {};
    var omni_display = {'c20' : 'Page Name', 'ch' : 'Channel'};

    if( omni_imgs.snapshotLength > 0){
        for(var i=0; i < omni_imgs.snapshotLength; i++){
            var lnk = omni_imgs.snapshotItem(i).src;
            var ary = lnk.split("&");
            for(var j=0; j < ary.length; j++){
                var str = ary[j];
                if(str.indexOf('=') != -1){
                    var pair = str.split('=');
                    var key = pair[0];
                    var val = unescape(pair[1]);
                    omni_vals[key] = val;
                }
            }
        }
        /*
        for( var i in omni_vals ){
            GM_log(i + ' : ' + omni_vals[i]);
        }
        */

        var html = ''
        for(var k in omni_display){
            if(k in omni_vals){
                html += '<div>' + omni_display[k] + '  =  ' + omni_vals[k] + '</div>';
            } else {
                html += '<div>' + omni_display[k] + '  =  Not Found' + '</div>';
            }

        }
        htmlnode = document.createElement('div');
        htmlnode.setAttribute("style", "cursor: pointer; z-index: 9999999999; padding: 8px 15px; font-family: monospace; background-color: white; color: black; position: fixed; left: 0px; bottom: 0px; display: -moz-groupbox;");
        htmlnode.addEventListener('click', function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            htmlnode.parentNode.removeChild(htmlnode);
        }, true);
        htmlnode.innerHTML = html;
        document.body.appendChild(htmlnode);
    }
}

window.addEventListener(
    'load',
    function() { run(); },
    true);
