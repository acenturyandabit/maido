addins = {};
addinsList = ['addins/compain.js', /*'addins/timeline.js',*/'addins/template.js' , 'addins/tagbox.js', 'addins/qrosstalk/addin.js','addins/notify.js','addins/synergist.js'];
//add all scripts to page
//load addins from localStorage
$(() => {
    addinsList.forEach((v, i) => {
        ai = document.createElement("script");
        ai.src = v;
        $("head").append(ai);
    })
    if (localStorage.getItem("__maiactive_addins__")) {
        t_addinsList = JSON.parse(localStorage.getItem("__maiactive_addins__"));
    } else {
        localStorage.setItem("__maiactive_addins__", "[]");
        t_addinsList = [];
    }
    for (let i of t_addinsList) {
        if (addins[i]) {
            addins[i].init();
            addins[i].active = true;
        }
    }
    $("#accaddin").on("click", "button", (e) => {
        addins[e.currentTarget.innerText].cleanup();
        addins[e.currentTarget.innerText].active = false;
        $("#unaddin").append(e.currentTarget);
        $("#accaddin").append(e.currentTarget);
        t_addinsList = [];
        for (i in addins) {
            if (addins[i].active) t_addinsList.push(i);
        }
        window.localStorage.setItem('__maiactive_addins__', JSON.stringify(t_addinsList));
    })
    $("#unaddin").on("click", "button", (e) => {
        i = e.currentTarget.innerText;
        addins[i].active = true;
        addins[i].init();
        $("#accaddin").append(e.currentTarget);
        t_addinsList = [];
        for (i in addins) {
            if (addins[i].active) t_addinsList.push(i);
        }
        window.localStorage.setItem('__maiactive_addins__', JSON.stringify(t_addinsList));
    })
});

function showAddins() {
    $('#addins_dialog').show();
    $("#accaddin").empty();
    $("#unaddin").empty();
    for (i in addins) {
        b = document.createElement("button");
        b.innerText = i;
        if (addins[i].active) {
            $("#accaddin").append(b);
        } else {
            $("#unaddin").append(b);
        }
    }

}