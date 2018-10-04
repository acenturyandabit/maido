var data = {
    sliu: {
        title: "Steven Liu",
        brief: "Driven. Curious. Spontaneous.",
        img: "liu2k19.jpg",
        to: ["sliu_programming", "sliu_mechatronics","sliu_projman"],
        core: [
            //{element:"rootsub1"},
            //{element:"rootsub2"},
        ]
    },
    sliu_programming: {
        title: "Programming",
        brief: "Full stack experience, plus some \ninformatics and python on \nthe side.",
        to: ["sliu"],
        core: [{
                element: "htmlcssjs"
            },
            //{element:""},
        ]
    },
    sliu_mechatronics: {
        title: "Mechatronics",
        brief: "Currently studying a bachelor \nof Mechatronics (double degree) \nat the University of Sydney.",
        to:["sliu"],
        core: [{
                element: "htmlcssjs"
            },
            //{element:""},
        ]
    },
    sliu_projman: {
        title: "Project management",
        brief: "Currently studying a bachelor of \nProject management (double degree)\nat the University of Sydney.",
        to: ["sliu"]
    },
    htmlcssjs: {
        title: "Front end development",
        brief: "I've worked with HTML, CSS, and \nJavascript. I've used JQuery profusely, \nbut haven't yet delved into React.js or Angular.js. I do like my SVG as well, as you can see here."
    }
}

$(document).ready(() => {
    //initialise the canvas
    width = document.body.offsetWidth
    height = document.body.offsetHeight
    svgroot = SVG("svgroot").size(width, height);
    cx = width / 2;
    cy = height / 2;
    setInterval(render, 00);
    render({
        data: data,
        root: "sliu",
        external: false,
        filters: undefined
    })
})




var _state;
var rendercache;

function render(state) {
    external_r = 400;
    if (!state || !state.data || !state.root) { // there will always be a root. distingquish between internal and external.
        //use the previous state and data. 
        if (rendercache) {
            for (var i=0;i<rendercache.length;i++){
                rcx = cx + rendercache[i].r * Math.cos(rendercache[i].angle);
                rcy = cy + rendercache[i].r * Math.sin(rendercache[i].angle);
                rendercache[i].angle+=0.0002;
                SVG.get(rendercache[i].id).cx(rcx).cy(rcy);
            }
        } else {
            alert("No data specified!");
            return 0;
        }
    } else {
        if (external) {
            svgroot.clear();
            rendercache=[];
            //render root in the center, with description
            ckl=svgroot.circle(300).cx(cx).cy(cy);
            if (state.data[state.root].img)ckl.fill(state.data[state.root].img);
            svgroot.text(state.data[state.root].title).cx(cx).cy(cy - 100).fill('white');
            svgroot.text(state.data[state.root].brief).cx(cx).cy(cy).fill('white');
            
            for (var i = 0; i < state.data[state.root].to.length; i++) {
                rendercache.push({r:external_r, angle:i * 2 * Math.PI / state.data[state.root].to.length,id:"exccl_"+state.data[state.root].to[i]});
                var group=svgroot.group().attr({
                    id:rendercache[i].id,
                    "data-itemName": state.data[state.root].to[i]
                }).click((args) => {
                    for (i=0;i<args.path.length;i++){
                        if  (args.path[i].tagName.toLocaleLowerCase()=="g"){
                            render({data:data,root:args.path[i].dataset.itemName});
                        }
                    }
                });
                target = state.data[state.root].to[i];
                console.log(rendercache[i])
                rcx = cx + rendercache[i].r * Math.cos(rendercache[i].angle);
                rcy = cy + rendercache[i].r * Math.sin(rendercache[i].angle);
                group.circle(200).cx(100).cy(100);
                group.text(state.data[target].title).cx(100).cy(100).fill('white');
                group.cx(rcx).cy(rcy)
                //svgroot.text(state.data[target].brief).cx(rcx).cy(rcy).fill('white');
            }
        }
    }
}