//load all images
//load UI
bits=["Ears",
"Forehead",
"Eyes",
"Frill",
"Body",
"Tail"
]

eevees=[
    "Eevee",
    "Jolteon",
    "Flareon",
    "Umbreon",
    "Leafeon",
    "Sylveon",
    "Glaceon",
    "Espeon",
    "Vaporeon"
];

currentEevee={};
var evctx;

$(()=>{
    eeveeOpts="";
    evctx=$(".imagur")[0].getContext('2d');
    eevees.forEach((v,i)=>{
        eeveeOpts+="<option value='"+v+"'>"+v+"</option>";
        //also load the images
        bits.forEach((_v,i)=>{
            $(".storage").append(`<img src="`+v+_v+`"></img>`);
        })
    })
    bits.forEach((v,i)=>{
        $(".controls").append("<p>"+v+": <select class='"+ v +"'>"+eeveeOpts+"</select></p>");
        currentEevee[v]="Eevee";
    })
    $("select").on("change",(_e)=>{
        e=_e.currentTarget
        currentEevee[e.class]=e.value;
        rerender();
    })
    rerender();
})

function rerender(){
    evctx.fillRect(0,0,$(".imagur")[0].width,$(".imagur")[0].height);
    for (e in currentEevee){
        evctx.drawImage($("img[src*="+currentEevee[e]+e+"]")[0]);
    }
}