//TODO: Work on fullCalendar.


function listItem(_quarterMaster, id, data) {
    let me = this;
    this.quarterMaster = _quarterMaster;

    //Initialise DOM
    this.span = this.quarterMaster.template.cloneNode(true);
    this.quarterMaster.taskList.appendChild(this.span);


    bindDOM(this, this.span.querySelector("[data-role='name']"), 'name');
    bindDOM(this, this.span.querySelector("[data-role='tags']"), 'tags');
    bindDOM(this, this.span.querySelector("[data-role='date']"), 'dateString');
    bindDOM(this, this.span.querySelector("[data-role='id']"), 'id');

    this.span.querySelector("button").innerText = 'X';
    this.id = id;

    this.loadFromData = function (data) {
        this.name = data.name;
        this.tags = data.tags;
        this.dateString = data.dateString;
        this.dates=data.dates;
        this.taskDescriptions = [];
        if (data.taskDescriptions && data.taskDescriptions.length) {
            for (let i = 0; i < data.taskDescriptions.length; i++) {
                this.taskDescriptions.push(new _quarterMaster.taskDescriptionManager.descriptionHandlers[data.taskDescriptions[i].type](me.quartermaster, data.taskDescriptions[i].data));
            }
        } else {
            this.taskDescriptions.push(new _quarterMaster.taskDescriptionManager.descriptionHandlers.textbox(_quarterMaster));
        }
    }

    this.toSaveData = function () {
        let obj = {};
        obj.name = this.name;
        obj.tags = this.tags;
        obj.dateString = this.dateString;
        obj.taskDescriptions = [];
        for (let i = 0; i < this.taskDescriptions.length; i++) {
            obj.taskDescriptions.push({
                type: this.taskDescriptions[i].type,
                data: this.taskDescriptions[i].toSaveData()
            })
        }
        obj.dates=this.dates;
        return obj;
    }

    this.remove = function () {
        try {
            this.span.remove();
            for (let i = 0; i < this.taskDescriptions.length; i++) {
                this.taskDescriptions[i].remove();
            }
        } catch (e) {
            console.log(e);
        }
    }
    //TODO: Task indenting
    if (data) {
        this.loadFromData(data);
    }

    this.focus = function () {
        this.taskDescriptions[0].div.style.display = "block";
    }

    this.defocus = function () {
        this.taskDescriptions[0].div.style.display = "none";
    }

}


function _quarterMaster() {
    let me = this;
    this.items = {};
    //----------Event API + misc functions----------//
    addEventAPI(this);
    //file external stuff!
    addDateSorter(this);

    //////////////////Component managers//////////////////
    this.addinManager = new _addinManager({
        savePrefix: "quarterMaster"
    });
    this.taskDescriptionManager = new _taskDescriptionManager(this);

    this.guid = function () {
        let pool = "1234567890qwertyuiopasdfghjklzxcvbnm";
        tguid = "";
        for (i = 0; i < 4; i++) tguid += pool[Math.floor(Math.random() * pool.length)];
        return tguid;
    }

    this.pwaManager = new _pwaManager();

    //----------UI libraries----------//
    this.topbarManager = new _topbarManager();
    this.filescreen = new _filescreen({
        onlineEnabled: false,
        documentQueryKeyword: "list",
        tutorialEnabled: false,
        savePrefix: "quartermaster"
    });
    //this.dialogManager=new _dialogManager();


    //----------DOM insertion----------//

    me.div = document.createElement("div");
    me.div.innerHTML = `
<style>

</style>
<div style="display:flex; flex-direction:column; height: 100%;">
<ul class="topbar">
    <li class="noHover listName">Quartermaster</li>
    <li>
        File
        <ul>
            <li></li>
            <li></li>
        </ul>
    </li>

    <li>
        List
        <ul class="list">
            <li>Tag manager</li>
        </ul>
    </li>
</ul>

<div style="flex: 1 1 100%; width:100%; display:flex;flex-direction:row">
    <div class="taskListBar" style="flex: 1 0 auto;">
        <span style="display:block">
            <span class="ids" style="display: inline-block;width: 60px;">ID:<span data-role='id'>none</span></span>
            <input data-role="name" placeholder="Task name" />
            <input data-role="tags" placeholder="Tags" />
            <input data-role="date" placeholder="Date" />
            <button class="remove">&gt;</button>
        </span>
        <hr/>
        <div class="taskList">
        </div>
    </div>
    <div style="flex: 1 1 100%; position:relative">
        <div class="descbox"></div>
        <div id="calendarView" style="
        position: absolute;
        height: 100%;
        ">
        </div>
    </div>
</div>
</div>
`;

    me.topbarManager.checkTopbars(me.div);
    bindDOM(me, me.div.querySelector(".topbar .listName a"), "id");
    me.title = document.createElement("title");
    document.head.appendChild(me.title);
    me.taskList = me.div.querySelector(".taskList");
    me.template = me.div.querySelector(".taskListBar>span");
    me.descbox = me.div.querySelector(".descbox");

    document.addEventListener("DOMContentLoaded", function () {
        me.registerNewItemEvent();
        document.body.append(me.div);
        $("#calendarView").fullCalendar({
            events: (start, end, timezone, callback) => {
                let allList = [];
                let tzd = new Date();
                for (i in me.items){
                    if (me.items[i].dates && me.items[i].dates.length){
                        thisdate=me.items[i].dates[0].date;
                        let isostring = new Date(Number(thisdate) - tzd.getTimezoneOffset() * 60 * 1000);
                        let eisostring = new Date(isostring.getTime() + 60 * 60 * 1000);
                        isostring = isostring.toISOString();
                        eisostring = eisostring.toISOString();
                        allList.push({
                            id: i,
                            title: me.items[i].name,
                            //backgroundColor: $(e).find("input")[0].style.backgroundColor,
                            //textColor: $(e).find("input")[0].style.color || "black",
                            start: isostring,
                            end: eisostring
                        });   
                    }
                }
                callback(allList);
            },
            defaultView: "agendaWeek",
            height: "parent"
        });

        me.firebaseDoc = undefined;
        me.fireman = new _fireman({
            documentQueryKeyword: "list",
            offlineKeyword: "offline",
            blank: function () {
                me.filescreen.showSplash();
            },
            load: (doc, id) => {
                me.filescreen.saveRecentDocument(id, false);
                //hide local stuff
                //TODO: fix this for switching between different files? 
                let style = document.createElement("style");
                style.innerHTML = `
            .oLocalOnly{
                display:none;
            }
            `;
                document.head.appendChild(style);
                doc.onSnapshot(shot => {
                    me.loadFromStaticData(shot.data());
                })

                me.firebaseDoc = doc;
                me.id = id;
                me.doc.collection('items').onSnapshot(shot => {
                    shot.docChanges().forEach(function (change) {
                        if (change.doc.metadata.hasPendingWrites) return; //dont update on local changes.
                        if (change.type == "added") {
                            me.loadSingleListItem(change.doc.id, change.doc.data());
                        } else if (change.type == "removed") {
                            me.removeItem(change.doc.id);
                        } else if (change.type == "modified") {
                            me.loadSingleListItem(change.doc.id, change.doc.data());
                        }
                    });
                });
                //TODO: update items on change
            },
            autocreate: true,
            makeNewDocument: (doc, id) => {
                doc.update({
                    name: id
                });
                me.fireman.settings.load(doc, id);
            },
            passwall: true,
            autopass: true,
            offlineLoad: (id) => {
                me.filescreen.saveRecentDocument(id);
                me.id = id;
                localforage.getItem(me.id).then((d) => {
                    if (d) me.loadFromStaticData(d);
                });
                //TODO: some means of retrieving by ID
                /*
                 */
            },
            config: {
                apiKey: "AIzaSyA-sH4oDS4FNyaKX48PSpb1kboGxZsw9BQ",
                authDomain: "backbits-567dd.firebaseapp.com",
                databaseURL: "https://backbits-567dd.firebaseio.com",
                projectId: "backbits-567dd",
                storageBucket: "backbits-567dd.appspot.com",
                messagingSenderId: "894862693076"
            },
            generateDoc: function (db, id) {
                return db.collection("quartermaster").doc(id);
            }
        });
    })
    //////////////////Loading options//////////////////
    //----------Firebase----------//


    ///////////////////Actual loading//////////////////
    this.loadFromStaticData = function (data) {
        //unload everything.
        for (i in me.items) {
            me.items[i].remove();
            delete(me.items[i]);
        }
        me.fire('load', data);
        // given an object, load it.
        me.title.innerText = data.name;
        for (i in data.items) {
            me.loadSingleListItem(i, data.items[i]);
        }

        /*if (data && Object.keys(data).length > 0) $("#nothingLeft").hide();
        else {
            $("#nothingLeft").show()
        }*/
        me.sort();
        $("#calendarView").fullCalendar('refetchEvents');
        me.fire('loaded', data);
    }

    this.loadSingleListItem = function (id, data) {
        //Ensure to check if item already exists. Otherwise leave it to the item itself.
        if (id && me.items[id]) {
            me.items[id].loadFromData(data);
        } else {
            if (!id) id = me.guid();
            me.items[id] = new listItem(me, id, data);
        }
        return me.items[id];
    }

    //----------More item manipulation----------//
    this.removeItem = function (id) {
        me.items[id].remove();
        me.fire("removeTask", me.items[id]);
        delete me.items[id];
    }



    //----------UI item creation----------//
    this.registerNewItemEvent = function () {
        me.template.addEventListener("keydown", function (e) {
            if (e.key == "Enter") {
                let data = {
                    name: me.template.querySelector("[data-role='name']").value,
                    tags: me.template.querySelector("[data-role='tags']").value,
                    dateString: me.template.querySelector("[data-role='date']").value
                }
                let newItem = me.loadSingleListItem(undefined, data);
                me.fire("newTask", data);
                //Also clear the values
                me.template.querySelector("[data-role='name']").value = "";
                me.template.querySelector("[data-role='tags']").value = "";
                me.template.querySelector("[data-role='date']").value = "";
                //and sort everything
                me.dateParse(newItem);
                me.sort();
                newItem.span.scrollIntoViewIfNeeded();
                newItem.span.querySelector("input").focus();
            }
        })
        //----------UI item removal----------//
        me.taskList.addEventListener("click", function (e) {
            if (e.target.matches("button")) {
                me.removeItem(e.target.parentElement.querySelector("[data-role='id']").innerText);
            }
        })

        //----------Date changing (delegated for efficiency)----------//
        me.taskList.addEventListener("keyup", function (e) {
            if (e.key == "Enter") {
                if (e.target.matches("[data-role='date']")) {
                    me.dateParse(me.items[e.target.parentElement.querySelector("[data-role='id']").innerText]);
                    me.sort();
                }
            }
        })
        //////////////////Focus (delegated for efficiency)//////////////////
        me.taskList.addEventListener("focusin", function (e) {
            if (e.target.tagName.toLowerCase() == "input") {
                for (let i in me.items) me.items[i].defocus();
                me.items[e.target.parentElement.querySelector("[data-role='id']").innerText].focus();
            }
        })
        //----------Focus on topbar----------//
        me.template.addEventListener("focusin", function (e) {
            for (i in me.items){
                me.items[i].defocus();
            }
        })
    }
    ///////////////////Save//////////////////
    this.toSaveData = function () {
        let obj = {};
        obj.items = {};
        for (i in me.items) {
            obj.items[i] = me.items[i].toSaveData();
        }
        return obj;
    }

    this.saveToBrowser = function () {
        let data = me.toSaveData();
        me.fire("save", data);
        localforage.setItem(me.id, data);
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("keydown", (e) => {
            if (e.key == "s" && e.ctrlKey) {
                me.saveToBrowser();
                e.preventDefault();
            }
        });
    });

}











var quarterMaster = new _quarterMaster();