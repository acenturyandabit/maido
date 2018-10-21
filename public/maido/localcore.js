var autosave = false;

function toggleAutosave() {
    autosave = !autosave;
    if (autosave) {
        $("li:contains('Preferences')>div span")[0].innerText = "on";
    } else {
        $("li:contains('Preferences')>div span")[0].innerText = "off";
    }
}

function _maidocore() {
    //var self = this;
    /*
    this.savecache = [];
    this.logSaveTime = [];
    this.logSaveDelta = [60000]
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
    setInterval(function () {
        lskeys = Object.keys(localStorage);
        mailist = {};
        for (i = 0; i < lskeys.length; i++) {
            if (lskeys[i].slice(0, 4) == "mai-") {
                if (!mailist[/-(.+)-/g.exec(lskeys[i])[2]]) mailist[/-(.+)-/g.exec(lskeys[i])[2]] = [];
                mailist[/-(.+)-/g.exec(lskeys[i])[2]].push(lskeys[i]);
            }
        }
        for (j in mailist) {
            mailist[j].sort((a, b) => {
                return Number(a.slice(a.search(/\d+$/))) - Number(a.slice(a.search(/\d+$/)));
            })
            if (mailist[j].length > 10) {
                for (i = 10; i < mailist.length; i++) localStorage.remove(mailist[j][j]);
            }
        }
    }, 60000);
}

var precheck = {};

function saveToBrowser() {
    savedata = {};
    Object.assign(maidocore, JSON.parse(window.localStorage.getItem('maido-core')))
    timestamp = Date.now()
    // save everything that is relevant
    $("input[data-taskgroup], textarea[data-taskgroup]").each((i, e) => {
        if (savedata[e.dataset.taskgroup] == undefined) savedata[e.dataset.taskgroup] = {};
        savedata[e.dataset.taskgroup][e.dataset.role] = e.value;
    });
    window.localStorage.setItem('lastSave', JSON.stringify({
        "name": $("#tasklist>h2")[0].innerText,
        "items": savedata
    }))
    window.localStorage.setItem("mai-" + $("#tasklist>h2")[0].innerText.toLowerCase().replace(/ /g, "_") + "-" + timestamp.toString(), JSON.stringify({
        "name": $("#tasklist>h2")[0].innerText,
        "items": savedata
    }))
    console.log("saved ok")
}

function loadFromBrowser(key = 'lastSave') {
    loadFromString(JSON.stringify(JSON.parse(window.localStorage.getItem(key)).items));
    $("#tasklist>h2")[0].innerText = JSON.parse(window.localStorage.getItem(key)).name;
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
        $("#tasklist>h2")[0].contentEditable = true;
        $("#loader_dialog_list").on("click", "button", (e) => {
            loadFromBrowser(e.currentTarget.dataset.ref)
            $("#loader_dialog").hide();
            $("#dialog_box").hide()
        })
        $("body").on("keyup", (e) => {
            if (autosave) {
                saveToBrowser();
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
}

function unloadAll(){
    //also incorporate disconnecting from the network.
    $("#todolist tr:not(.pintotop)").remove()
    $("#todolist_db textarea:not(.template)").remove()
    $("#tasklist>h2")[0].innerText="Untitled list";
}