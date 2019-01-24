var rootoptions = {
    root: {
        title: "Myriad",
        brief: "Radial relational data visualiser.",
        to: ["wikipedia", "custom"]
    },
    wikipedia: {
        title: "Wikipedia",
        brief: "Browse wikipedia with Myraid! \n Enter your search term below...",
        gendom: function gen(div) {
            var inp = document.createElement("input");
            div.appendChild(inp);
            var btn = document.createElement("button");
            btn.innerText = "Go";
            btn.onclick = (e) => {
                window.location.href = "?wiki=" + e.currentTarget.previousSibling.value;
            }
            div.appendChild(btn);
        },
        to: []
    },
    custom: {
        title: "Custom dataset",
        brief: "Visualise a custom dataset here...",
        gendom: function gen(div) {
            var inp = document.createElement("input");
            var k = new FileReader();
            inp.type = "file";
            div.appendChild(inp);
            inp.onchange = function (e) {
                k.onload = () => {
                    var customdata = JSON.parse(k.result);
                    render({
                        data: customdata,
                        root: 'root',
                        external: true
                    })
                }
                k.readAsText(e.currentTarget.files[0]);
            }
        },
        to: []
    }
}
var wikidata = {};
var ncalls = 0;

function wikidisplay(_query, first = false, cbmember) {
    let query = _query;
    //if query is a string, then convert it into a pageid
    if (first) {
        $("#wikistatus").text("Querying wikipedia for item number...")
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&callback=?&titles=" + query).done((data) => {
            ncalls++;
            wikidisplay(Number(Object.keys(data.query.pages)[0]));
        })
        return;
    } //Otherwise assume it is a number and be on our way.
    if (cbmember) {
        //check if it has already run linkreturn.
        if (wikidata[query].linkReturnCount != undefined) {
            let relevance = 0;
            for (i in wikidata[query].link500) {
                if (wikidata[cbmember].link500[i]) relevance++;
            }
            wikidata[cbmember].link500[query].relevance = relevance;
            wikidata[cbmember].linkReturnCount++;
            $("#wikistatus").text("Gathering relevance data for link " + wikidata[cbmember].linkReturnCount + " of " + Object.keys(wikidata[cbmember].link500).length);
        } else $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&generator=links&callback=?&gpllimit=max&gplnamespace=0&pageids=" + query).done((data) => {
            ncalls++;
            wikidata[query].link500 = {};
            let relevance = 0;
            if (data.query)
                for (i in data.query.pages) {
                    if (!wikidata[i]) wikidata[i] = {};
                    Object.assign(wikidata[i], {
                        title: data.query.pages[i].title
                    });
                    //dont subquery
                    wikidata[query].link500[i] = {
                        relevance: 0
                    };
                    if (wikidata[cbmember].link500[i]) relevance++;
                }
            wikidata[cbmember].link500[query].relevance = relevance;
            wikidata[cbmember].linkReturnCount++;
            $("#wikistatus").text("Gathering relevance data for link " + wikidata[cbmember].linkReturnCount + " of " + Object.keys(wikidata[cbmember].link500).length);
            return;
            //compare my overlap with the cmember
        })
        return;
    }
    if (!wikidata[query] || !(wikidata[query].brief)) {
        //get info 
        $("#wikistatus").text("Getting detail of current item...");
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=description&format=json&callback=?&pageids=" + query).done((data) => {
            ncalls++;
            if (!wikidata[query]) wikidata[query] = {};
            Object.assign(wikidata[query], {
                title: data.query.pages[Object.keys(data.query.pages)[0]].title,
                brief: data.query.pages[Object.keys(data.query.pages)[0]].description
            });
            if (!wikidata[query].brief) wikidata[query].brief = "No description provided ;-;";
            wikidisplay(Number(Object.keys(data.query.pages)[0]));
        })
        return;
    }
    if (!wikidata[query].link500) {
        $("#wikistatus").text("Finding links for current item...");
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&generator=links&callback=?&gpllimit=max&gplnamespace=0&pageids=" + query).done((data) => {
            ncalls++;
            wikidata[query].link500 = {};
            wikidata[query].linkReturnCount = 0;
            for (i in data.query.pages) {
                if (!wikidata[i]) wikidata[i] = {};
                Object.assign(wikidata[i], {
                    title: data.query.pages[i].title
                });
                wikidisplay(i, false, query);
                wikidata[query].link500[i] = {
                    relevance: 0
                };
            }
            wikidisplay(query);
        })
        return;
    }
    if (wikidata[query].linkReturnCount == undefined) {
        $("#wikistatus").text("Initiating relevance gathering...");
        wikidata[query].linkReturnCount = 0;
        for (i in wikidata[query].link500) {
            wikidisplay(i, false, query);
            wikidata[query].link500[i] = {
                relevance: 0
            };
        }
        wikidisplay(query);
        return;
    }
    if (Object.keys(wikidata[query].link500).length > wikidata[query].linkReturnCount + 1) {
        //wait a bit
        setTimeout(() => {
            wikidisplay(query)
        }, 5000);
        return;
    }
    if (!wikidata[query].to) {
        $("#wikistatus").text("Sorting links by relevance...");
        wikidata[query].to = [];
        let tempsorter = [];
        for (i in wikidata[query].link500) {
            tempsorter.push({
                title: i,
                relevance: wikidata[query].link500[i].relevance
            });
        }
        tempsorter.sort((a, b) => {
            return b.relevance - a.relevance
        });
        for (i = 0; i < 10; i++) {
            if (i == tempsorter.length) break;
            wikidata[query].to.push(tempsorter[i].title);
        }
    }
    $("#wikistatus").text("Done!");
    render({
        data: wikidata,
        root: query,
        external: true,
        filters: undefined
    })
}


var wikiquery;
$(document).ready(() => {
    //initialise the canvas
    width = document.body.offsetWidth
    height = document.body.offsetHeight
    svgroot = SVG("svgroot").size(width, height);
    cx = width / 2;
    cy = height / 2;
    let urlParams = new URLSearchParams(window.location.search);
    wikiquery = urlParams.get('wiki');
    setInterval(render, 00);
    if (wikiquery) {
        wikidisplay(wikiquery, true)
    } else {
        render({
            data: rootoptions,
            root: "root",
            external: true,
            filters: undefined
        })
    }
})




var _state;
var rendercache;

function render(state) {
    external_r = 400;
    if (!state || !state.data || !state.root) { // there will always be a root. distingquish between internal and external.
        //use the previous state and data. 
        if (rendercache) {
            for (var i = 0; i < rendercache.length; i++) {
                rcx = cx + rendercache[i].r * Math.cos(rendercache[i].angle);
                rcy = cy + rendercache[i].r * Math.sin(rendercache[i].angle);
                rendercache[i].angle += 0.0002;
                SVG.get(rendercache[i].id).cx(rcx).cy(rcy);
            }
        } else {
            //alert("No data specified!");
            return 0;
        }
    } else {
        if (external) {
            svgroot.clear();
            rendercache = [];
            _state = state; // copy state in as a reference.
            let rootpoint = state.data[state.root];
            //render root in the center, with description
            ckl = svgroot.circle(300).cx(cx).cy(cy);
            if (rootpoint.img) ckl.fill(rootpoint.img);
            fobj = svgroot.foreignObject(250, 250).cx(cx).cy(cy);
            div = document.createElement('div')
            div.style.width = "100%";
            div.style.color = 'white';
            div.style["text-align"] = "center";
            fobj.appendChild(div);
            h2 = document.createElement("h2");
            h2.innerText = rootpoint.title;
            div.appendChild(h2);
            p = document.createElement("p");
            p.innerText = rootpoint.brief;
            div.appendChild(p);
            //svgroot.text(rootpoint.title).cx(cx).cy(cy - 100).fill('white');
            //svgroot.text(rootpoint.brief).cx(cx).cy(cy).fill('white');
            if (rootpoint.to) {
                for (var i = 0; i < rootpoint.to.length; i++) {
                    rendercache.push({
                        r: external_r,
                        angle: i * 2 * Math.PI / rootpoint.to.length,
                        id: "exccl_" + rootpoint.to[i]
                    });
                    var group = svgroot.group().attr({
                        id: rendercache[i].id,
                        "data-itemName": rootpoint.to[i]
                    }).click(groupClickHandler);
                    target = rootpoint.to[i];
                    console.log(rendercache[i])
                    rcx = cx + rendercache[i].r * Math.cos(rendercache[i].angle);
                    rcy = cy + rendercache[i].r * Math.sin(rendercache[i].angle);
                    group.circle(200).cx(100).cy(100);
                    innerfobj = group.foreignObject(200, 200);
                    innerdiv = document.createElement('div')
                    innerdiv.style.width = "100%";
                    innerdiv.style.color = 'white';
                    innerdiv.style['line-height'] = '200px';
                    innerdiv.style["text-align"] = "center";
                    innerfobj.appendChild(innerdiv);
                    Object.assign(innerfobj.style, {
                        "display": "inline-block",
                        "vertical-align": "middle",
                        "line-height": "normal"
                    });

                    innerp = document.createElement("span");
                    innerp.innerText = state.data[target].title;
                    innerdiv.appendChild(innerp);
                    group.cx(rcx).cy(rcy)
                    //svgroot.text(state.data[target].brief).cx(rcx).cy(rcy).fill('white');
                }
            }
            if (!state.from) state.from = [];
            if (rootpoint.from || state.from[state.from.length - 1]) {
                fromfrom = rootpoint.from || state.from[state.from.length - 1];
                var group = svgroot.group().attr({
                    "data-itemName": fromfrom
                }).click(groupClickHandler).cx(cx).cy(cy * 2 - 100);
                group.rect(200, 100).fill('black').cx(0).cy(0);
                innerfobj = group.foreignObject(200, 100).cx(0).cy(0);
                innerdiv = document.createElement('div')
                innerdiv.style.width = "100%";
                innerdiv.style.color = 'white';
                innerdiv.style['line-height'] = '100px';
                innerdiv.style["text-align"] = "center";
                innerfobj.appendChild(innerdiv);
                Object.assign(innerfobj.style, {
                    "display": "inline-block",
                    "vertical-align": "middle",
                    "line-height": "normal"
                });
                innerdiv.innerText = "back to "+ state.data[fromfrom].title;
            }
            if (rootpoint.gendom) {
                rootpoint.gendom(div);
            }
        }
    }
}

function groupClickHandler(args) {
    for (i = 0; i < args.path.length; i++) {
        if (args.path[i].tagName.toLocaleLowerCase() == "g") {
            if (!wikiquery) {
                fromstack = _state.from;
                if (!fromstack) fromstack = [];
                if (fromstack[fromstack.length-1]==args.path[i].dataset.itemName){
                    fromstack.pop();
                }else{
                    fromstack.push(_state.root);
                }
                render({
                    data: _state.data,
                    root: args.path[i].dataset.itemName,
                    from: fromstack
                });
            } else {
                wikidisplay(args.path[i].dataset.itemName);
            }
            break;
        }
    }
}