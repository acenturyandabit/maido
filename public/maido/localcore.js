var autosave = false;

function toggleAutosave() {
    autosave = !autosave;
    if (autosave) {
        $("span:contains('Preferences')>div span")[0].innerText = "on";
    } else {
        $("span:contains('Preferences')>div span")[0].innerText = "off";
    }
}

function _maidocore() {
    //var self = this;
    /*
    this.savecache = [];
    this.logSaveTime = [];
    this.logSaveDelta = [60000];
    this.logSavePattern = [10, 6, 24, 7, 4, 12];
    // initialise on first run-these will be overwritten from cache.
    for (i in this.logSavePattern) {
        this.savecache.push([]);
        this.logSaveTime.push(Date.now())
        if (i > 0) this.logSaveDelta[i] = this.logSaveDelta[i - 1] * this.logSavePattern[i - 1]
    }
    Object.assign(this, JSON.parse(window.localStorage.getItem('maido-core')))
    this.pushSaveCache = function (timeStamp) {
        this.savecache[0].push(timestamp);
        while (this.savecache[0].length > this.logSavePattern[0]) {
            it = this.savecache[0].shift();
            localStorage.removeItem(it);
        }
    }
    this.saveCacheUpdate = function () {
        for (i = 1; i < self.logSavePattern.length; i++) {
            if (Date.now() - self.logSaveTime[i] >= self.logSaveDelta[i]) {
                self.savecache[i].push(self.savecache[i - 1][0])
                if (self.savecache[i].length > self.logSavePattern[i]) {
                    it = self.savecache[i].shift();
                    localStorage.removeItem(it);
                }
                self.logSaveTime[i] = Date.now()
            }
        }
        localStorage.setItem('maido-core', JSON.stringify(this))
        console.log("maidocore updated save cache");
    }*/
    setInterval(trimSave, 60000)
}

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
            for (i = 10; i < mailist.length; i++) localStorage.remove(mailist[j][j]);
        }
    }
};

var precheck = {};

function saveToBrowser(autosave=false) {
    savedata = {};
    Object.assign(maidocore, JSON.parse(window.localStorage.getItem('maido-core')))
    timestamp = Date.now()
    // save everything that is relevant
    $("[data-taskgroup][data-role]").each((i, e) => {
        if (savedata[e.dataset.taskgroup] == undefined) savedata[e.dataset.taskgroup] = {};
        savedata[e.dataset.taskgroup][e.dataset.role] = e.value;
    });
    $("span[data-taskgroup]").each((i, e) => {
        if (e.parentElement.id!="todolist")savedata[e.dataset.taskgroup].parent=e.parentElement.dataset.taskgroup;
    });
    window.localStorage.setItem('lastSave', JSON.stringify({
        "name": $("#title")[0].innerText,
        "items": savedata
    }))
    if (!autosave){
        window.localStorage.setItem("mai-" + $("#title")[0].innerText.toLowerCase().replace(/ /g, "_") + "-" + timestamp.toString(), JSON.stringify({
            "name": $("#title")[0].innerText,
            "items": savedata
        }))
        console.log("saved ok")
    }else{
        console.log("autosaved ok")
    }
    
    
}

function loadFromBrowser(key = 'lastSave') {
    preDBTG=undefined;
    if ($("#todolist_db textarea:visible").length>0)preDBTG=$("#todolist_db textarea:visible")[0].dataset.taskgroup;
    loadFromString(JSON.stringify(JSON.parse(window.localStorage.getItem(key)).items));
    $("#title")[0].innerText = JSON.parse(window.localStorage.getItem(key)).name;
    if (preDBTG)$("#todolist_db textarea[data-taskgroup='"+preDBTG+"']").show()

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
    maidocore = new _maidocore();
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
        $("span:contains('Preferences')>div").append(
            `
            <a onclick="toggleAutosave()">Toggle autosave (<span>off</span>)</a>
        `
        )
    })
}

function unloadAll(){
    //also incorporate disconnecting from the network.
    $("#todolist span:not(.pintotop)").remove()
    $("#todolist_db textarea:not(.template)").remove()
    $("#title")[0].innerText="Untitled list";
}