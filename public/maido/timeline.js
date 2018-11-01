function maido_extension_timeline() {
    this.onload = function () {
        if (!vis) {
            $("head").append(
                `
            <link href="vis.min.css" rel="stylesheet" type="text/css">
            `
            )
            $.getScript("vis.min.js", () => {
                //Create a dataset with all current tasks

                //

                //add event handlers for clicking the 
                
            });
        }
    }
}


var startT = Date.now();
var endT = Date.now() + 1000 * 60 * 60 * 24;
$(document).ready(() => {
    timelineSVG = SVG('timeline_svg').size("100%", 50);
    w = timelineSVG.attr('w');
    timelineSVG.line(w, 0).move(0, 0);
})


function toggleTimeline() {
    $("#timeline_svg").toggle();
}