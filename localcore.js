function loadFromString(str) {
    data = JSON.parse(str);
    $("#todolist span:not(.pintotop)").remove()
    $("#todolist_db textarea:not(.template)").remove()
    for (d in data) {
        loadSingleEntry(d, data[d])
    }
    //make indented tasks
    for (d in data) {
        if (data[d].parent) {
            $("#todolist span[data-taskgroup='" + data[d].parent + "']").append($("#todolist span[data-taskgroup='" + d + "']"));
        }
    }
    if (data && Object.keys(data).length > 0) $("#nothingLeft").hide();
    else {
        $("#nothingLeft").show()
    }
}

function loadSingleEntry(id, data) {
    
    //console.log(id,data);
    newNode = $("#todolist span.template")[0].cloneNode(true)
    newNode.classList.remove('pintotop');
    newNode.classList.remove('template');
    $(newNode).find("button").text("Remove");
    newNode.dataset.taskgroup = id;

    //clone the description box as well. 
    dbox = $("#todolist_db .template")[0].cloneNode(true);
    dbox.classList.remove("template");
    dbox.dataset.taskgroup = id;
    $("#todolist_db").append(dbox);
    $(newNode).find("*").each((i, e) => {
        e.dataset.taskgroup = newNode.dataset.taskgroup
    })
    $("#todolist").append(newNode)
    for (p in data) {
        e = $("[data-taskgroup='" + id + "'][data-role*='" + p + "']")[0]
        if (e) e.value = data[p];
    }
    for (f in precheck) {
        precheck[f](newNode);
    }
    todolist.fire('add',newNode)
}



var autosave = false;

function toggleAutosave() {
    autosave = !autosave;
    if (autosave) {
        $("li:contains('Preferences')>div span")[0].innerText = "on";
    } else {
        $("li:contains('Preferences')>div span")[0].innerText = "off";
    }
}

setInterval(trimSave, 60000)

function trimSave() {
    lskeys = Object.keys(localStorage);
    mailist = {};
    for (i = 0; i < lskeys.length; i++) {
        if (lskeys[i].slice(0, 4) == "mai-") {
            if (!mailist[/-(.+)-/g.exec(lskeys[i])[1]]) mailist[/-(.+)-/g.exec(lskeys[i])[1]] = [];
            mailist[/-(.+)-/g.exec(lskeys[i])[1]].push(lskeys[i]);
        }
    }
    for (j in mailist) {
        mailist[j].sort((a, b) => {
            return Number(/\d+$/g.exec(b)[0]) - Number(/\d+$/g.exec(a)[0]);
        })
        if (mailist[j].length > 10) {
            for (i = 10; i < mailist[j].length; i++) {
                localStorage.removeItem(mailist[j][i]);
            }
        }
    }
};

var precheck = {};
var save_metadata = {};

function saveToBrowser(autosave = false) {
    savedata = {};
    timestamp = Date.now()
    // save everything that is relevant
    $("[data-taskgroup][data-role]").each((i, e) => {
        if (savedata[e.dataset.taskgroup] == undefined) savedata[e.dataset.taskgroup] = {};
        savedata[e.dataset.taskgroup][e.dataset.role] = e.value;
    });
    $("span[data-taskgroup]").each((i, e) => {
        if (e.parentElement.id != "todolist") savedata[e.dataset.taskgroup].parent = e.parentElement.dataset.taskgroup;
    });
    saveBlob = JSON.stringify({
        "name": $("#title")[0].innerText,
        "items": savedata,
        "meta": save_metadata,
        "v": "1.1"
    });
    window.localStorage.setItem('lastSave', saveBlob)
    if (!autosave) {
        window.localStorage.setItem("mai-" + $("#title")[0].innerText.toLowerCase().replace(/ /g, "_") + "-" + timestamp.toString(), saveBlob);
        console.log("saved ok")
    } else {
        console.log("autosaved ok")
    }


}

function loadFromBrowser(key = 'lastSave') {
    preDBTG = undefined;
    //fire the loading event
    save_metadata=JSON.parse(window.localStorage.getItem(key));
    if (!save_metadata)save_metadata={};
    todolist.fire("listMetaUpdate",save_metadata);
    if ($("#todolist_db textarea:visible").length > 0) preDBTG = $("#todolist_db textarea:visible")[0].dataset.taskgroup;
    loadFromString(JSON.stringify(JSON.parse(window.localStorage.getItem(key)).items));
    $("#title")[0].innerText = JSON.parse(window.localStorage.getItem(key)).name;
    if (preDBTG) $("#todolist_db textarea[data-taskgroup='" + preDBTG + "']").show()

    console.log(key)
}

function showLoader() {
    D = new Date();
    $("#loader_dialog_list").empty();
    lskeys = Object.keys(localStorage);
    mailist = {};
    for (i = 0; i < lskeys.length; i++) {
        if (lskeys[i].slice(0, 4) == "mai-") {
            ael = document.createElement("button");
            D.setTime(Number(lskeys[i].slice(lskeys[i].search(/\d+$/))))
            ael.innerText = lskeys[i]; //.slice(0,lskeys[i].search(/\d+$/)-1)+D.toLocaleString()
            ael.dataset.ref = lskeys[i];
            $("#loader_dialog_list").append(ael);
            $("#loader_dialog_list").append("<br>");
        }
    }
    $("#dialog_box").show();
    $("#loader_dialog").show();
}

function startLocal() {
    $(document).ready(() => {
        $("#title")[0].contentEditable = true;
        $("#loader_dialog_list").on("click", "button", (e) => {
            loadFromBrowser(e.currentTarget.dataset.ref)
            $("#loader_dialog").hide();
            $("#dialog_box").hide()
        })
        $("body").on("keyup", (e) => {
            if (autosave) {
                saveToBrowser(true);
            }
        });
        $("body").on("keydown", (e) => {
            if (e.ctrlKey && e.keyCode == 83) { // ctrl s
                saveToBrowser()
                return false
            }
        })
        loadFromBrowser();
        first_sort();
        //show autosave
        $("li:contains('Preferences')>div").append(
            `
            <a onclick="toggleAutosave()">Toggle autosave (<span>off</span>)</a>
        `
        )
    })
    //detect if another Mai instance is running; if so, alert the user, turn on autosave, and load from localstorage whenever the window is focused.

    if (Number(window.localStorage.getItem("maion")) == "1") {
        if (confirm(
                "Another window with Maido is open. If you keep this window open, Maido can try to automatically sync your local tasklist between tabs."
            ) == false) {
            setTimeout(() => {
                window.location.href = "about:blank";
            }, 1000);
        } else {
            startMultiTab();
            window.localStorage.setItem("maion", -1);
        }
    }

    function startMultiTab() {
        window.addEventListener("blur", (e) => {
            saveToBrowser(true);
        });
        window.addEventListener("focus", (e) => {
            loadFromBrowser();
        });
    }
    $(window).on('beforeunload', function () {
        window.localStorage.setItem("maion", 0);
    });
    window.addEventListener('storage', (e) => {
        if (e.key == "maion" && e.newValue != "1") {
            if (e.newValue == "0") {
                window.localStorage.setItem("maion", 1);
            }
            if (e.newValue == "-1") {
                startMultiTab()
                window.localStorage.setItem("maion", 1);
            }
        }
    })
    window.localStorage.setItem("maion", 1)
}