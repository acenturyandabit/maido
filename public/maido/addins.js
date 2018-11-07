addins = {};
addinsList = {
    compain: {
        url: 'addins/compain.js'
    },
    timeline: {
        url: 'addins/timeline.js'
    },
};
//load addins from localStorage
$(() => {
    if (localStorage.getItem("__maiactive_addins__")) {
        t_addinsList = JSON.parse(localStorage.getItem("__maiactive_addins__"));
    } else {
        localStorage.setItem("__maiactive_addins__", "[]");
        t_addinsList = [];
    }
    for (i of t_addinsList) {
        ai = document.createElement("script");
        ai.src = addinsList[i].url;
        addinsList[i].active = true;
        addinsList[i].loaded = true;
        $("head").append(ai);
        addins[i].init();
    }
    $("#accaddin").on("click", "button", (e) => {
        addins[e.currentTarget.innerText].cleanup();
        addinsList[e.currentTarget.innerText].active=false;
        $("#unaddin").append(e.currentTarget);
        $("#accaddin").append(e.currentTarget);
        t_addinsList=[];
        for (i in addinsList){
            if (addinsList[i].active)t_addinsList.push(i);
        }
        window.localStorage.setItem('__maiactive_addins__',JSON.stringify(t_addinsList));
    })
    $("#unaddin").on("click", "button", (e) => {
        i=e.currentTarget.innerText;
        if(!addinsList[i].loaded){
            ai = document.createElement("script");
            ai.src = addinsList[i].url;
            addinsList[i].loaded = true;
            $("head").append(ai);
        }
        addinsList[i].active = true;
        addins[i].init();
        $("#accaddin").append(e.currentTarget);
        t_addinsList=[];
        for (i in addinsList){
            if (addinsList[i].active)t_addinsList.push(i);
        }
        window.localStorage.setItem('__maiactive_addins__',JSON.stringify(t_addinsList));
    })
});

function showAddins() {
    $('#addins_dialog').show();
    $("#accaddin").empty();
    $("#unaddin").empty();
    for (i in addinsList) {
        b = document.createElement("button");
        b.innerText = i;
        if (addinsList[i].active) {
            $("#accaddin").append(b);
        } else {
            $("#unaddin").append(b);
        }
    }

}