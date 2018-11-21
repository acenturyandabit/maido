addins.tagbox = new function () {
    this.init = function () {
        //create a bunch of boxes for each valid tag.
        $("#desc_sidebar").append(`<div class='tagboxbox' style="display:flex; flex: 1 0 200px"></div>`);
        $("body").append(`<style>.tagboxbox textarea{width:100%;}</style>`)
        $("#markerpicker tr:not(.template) input[placeholder='Tag name']").each((i, e) => {
            $(".tagboxbox").append(`<textarea class='tagbox' placeholder="` + e.value + `"></textarea>`);
        })
        $(".tagbox").hide();
        todolist.on('selected', (e) => {
            $(".tagbox").hide();
            tags = markercheck(e);
            tags.forEach((e, i) => {
                $("textarea.tagbox[placeholder=" + e + "]").show();
            })
        })
        todolist.on("save", (d) => {
            d.tagbox = {};
            $("textarea.tagbox").each((i, e) => {
                d.tagbox[e.placeholder] = e.value;
            })
        })
        /*todolist.on("load",(d)=>{
            if (d.tagbox){
                for (i in d.tagbox){
                    $("textarea [data-tagboxid="+i+"]")[0].value=d.tagbox[i];
                }
            }
        })*/
        todolist.registerAndTryLoad((d) => {
            console.log("fired!");
            if (d.tagbox) {
                for (i in d.tagbox) {
                    try {
                        $("textarea.tagbox[placeholder=" + i + "]")[0].value = d.tagbox[i];
                    } catch (e) {}
                }
            }
        })
    };
    //make it so that when i modify tag names the tagboxes remain
    this.cleanup = function () {};
};