var startT=Date.now();
var endT=Date.now()+1000*60*60*24;
$(document).ready(()=>{
    timelineSVG=SVG('timeline_svg').size("100%",50);
    w=timelineSVG.attr('w');
    timelineSVG.line(w,0).move(0,0);
})


function toggleTimeline(){
    $("#timeline_svg").toggle();
}