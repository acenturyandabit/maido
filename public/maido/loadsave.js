function saveToBrowser() {
    savedata = {};
    Object.assign(maidocore, JSON.parse(window.localStorage.getItem('maido-core')))
    timestamp = Date.now()
    maidocore.pushSaveCache(timestamp)
    // collapse the description so that we save it
    retract_description(true);
    $("#todolist tr:not(.initial) * ").each((i, e) => {
        if (savedata[e.dataset.taskgroup] == undefined) savedata[e.dataset.taskgroup] = {};
        if (e.className.length > 0) {
            if (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA') savedata[e.dataset.taskgroup][e.className] =
                e.value;
            if (e.tagName == 'BUTTON') savedata[e.dataset.taskgroup][e.className] = e.innerText;
        }
    })
    window.localStorage.setItem('lastSave', JSON.stringify(savedata))
    window.localStorage.setItem(timestamp.toString(), JSON.stringify(savedata))
    window.localStorage.setItem('maido-core', JSON.stringify(maidocore))
}

function loadFromBrowser(key = 'lastSave') {
    data = JSON.parse(window.localStorage.getItem(key))
    $("#todolist tr:not(.initial)").remove()
    for (d in data) {
        newNode = $(".initial")[0].cloneNode(true)
        newNode.classList.remove('initial');
        newNode.dataset.taskgroup = d;
        $(newNode).find("*").each((i, e) => {
            e.dataset.taskgroup = newNode.dataset.taskgroup
        })
        for (p in data[d]) {
            e = $(newNode).find("." + p)[0]
            if (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA') e.value = data[d][p];
            if (e.tagName == 'BUTTON') e.innerHTML = data[d][p];
        }
        $("#todolist").append(newNode)
    }
    console.log(key)
}

function showLoader() {
    D=new Date();
    $("#loader_dialog_list").empty()
    for (i of maidocore.savecache){
        for (j of i){
            if(j!=null){
                ael=document.createElement("button");
                D.setTime(Number(j))
                ael.innerText=D.toLocaleString()
                ael.dataset.ref=j;
                $("#loader_dialog_list").append(ael);
                $("#loader_dialog_list").append("<br>");
            }
        }
    }
    $("#loader_dialog").show();
}

$(document).ready(()=>{
    $("#loader_dialog_list").on("click","button",(e)=>{ 
        loadFromBrowser(e.currentTarget.dataset.ref)
        $("#loader_dialog").hide()
    })
    
})