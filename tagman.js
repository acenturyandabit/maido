$(document).ready(() => {
    $("#todolist").on('keyup', "input[data-role='tags']", (e) => {
        precheck.markercheck(e.currentTarget.parentElement.parentElement);
    })
})

var colNames = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgrey': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkslategrey': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dimgrey': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'grey': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgrey': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightslategrey': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370d8',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#d87093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'slategrey': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
};

function ensureHexColor(col) {
    if (col[0] == "#") return col;
    else return colNames[col];
}

function getContrastYIQ(hexcolor) {
    hexcolor = ensureHexColor(hexcolor)
    hexcolor = hexcolor.slice(1);
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

$(document).ready(() => {
    $("body").append(
        `
        <div class="dialog" id="markerpicker">
        <div style="display: flex; height: 100%;">
        <div class="inner_dialog">
<h2>Tag editor</h2>
<table>
<tr class="template">
<td>
<input placeholder="Tag name"></input>
</td>
<td>
<input placeholder="Tag style"></input>
</td>
</tr>
</table>
</div></div>
    `
    )
    tagformats = JSON.parse(localStorage.getItem("maidoTagFormats"));
    if (!tagformats) tagformats = {};
    for (i in tagformats) {
        newrow = $("#markerpicker>table tr.template")[0].cloneNode(true);
        newrow.classList.remove("template");
        $(newrow).find("input[placeholder='Tag name']")[0].value = i;
        $(newrow).find("input[placeholder='Tag style']")[0].value = JSON.stringify(tagformats[i]);
        $("#markerpicker table").append(newrow);
    }
    $("#markerpicker").on("change", "input", () => {
        tagformats = {};
        $("#markerpicker tr:not(.template)").each((i, e) => {
            try {
                tagformats[$(e).find("input[placeholder='Tag name']")[0].value] = JSON.parse($(e).find("input[placeholder='Tag style']")[0].value);
            } catch (ex) {

            }
        })
        $("#todolist tr:not(.pintotop)").each((i, e) => {
            precheck.markercheck(e)
        });
        localStorage.setItem("maidoTagFormats", JSON.stringify(tagformats))
    });

    $("#markerpicker").on("keyup", ".template input", (e) => {
        if (e.keyCode == 13) {
            newNode = $("#markerpicker tr.template")[0].cloneNode(true)
            newNode.classList.remove('template');
            $("#markerpicker table").append(newNode)

            //$(newNode).find("." + e.currentTarget.classList[0]).focus()
            //$(newNode).find("." + e.currentTarget.classList[0])[0].setSelectionRange(1, 1)
            $("#markerpicker tr.template input").each((i, e) => {
                e.value = ""
            })
            $("#markerpicker tr:not(.template)").each((i, e) => {
                try {
                    tagformats[$(e).find("input[placeholder='Tag name']")[0].value] = JSON.parse($(e).find("input[placeholder='Tag style']")[0].value);
                } catch (ex) {

                }
            })
            $("#todolist tr:not(.pintotop)").each((i, e) => {
                precheck.markercheck(e)
            });
            localStorage.setItem("maidoTagFormats", JSON.stringify(tagformats))
        }
    })
    //tagformats = JSON.parse(e.currentTarget.value);
    //localStorage.setItem("maidoTagFormats", JSON.stringify(tagformats))
    $("li:contains('View')>div").append(
        `
<a onclick="$('#markerpicker').show()">Show tag configuration</a>
    `
    )
    precheck.markercheck = (tr) => {
        let cval = $(tr).find("[data-role='tags']")[0].value;
        bits = cval.split(" ");
        ismarker = false;
        color = "blue";
        for (i in bits) {
            if (bits[i][0] == "#") {
                tagname = bits[i].slice(1);
                if (tagformats[tagname]) {
                    //.background=color;e.style.color=getContrastYIQ(color)
                    $(tr).find("input").each((i, e) => {
                        Object.assign(e.style, tagformats[tagname]);
                    });
                }
                //ismarker=true;
                /*if (bits[i].split('#marker:').length>1){
                    color=bits[i].split('#marker:')[1];
                }*/
            }
        }
        /*
        if (ismarker){
            $(td).find("input").each((i,e)=>{e.style.background=color;e.style.color=getContrastYIQ(color)});
        }else{
            $(td).find("input").each((i,e)=>{e.style.background="white"});
        }*/
    }
    $("#todolist tr:not(.pintotop)").each((i, e) => {
        precheck.markercheck(e)
    });
});