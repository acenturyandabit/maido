//////////////////Handling all things ID related//////////////////
var _item_id_cache = {};

function lookupId(id) {
    if (_item_id_cache[id]) return _item_id_cache[id];
    else {
        $("[data-role='date']").each((i, e) => {
            _id = extractID(e);
            if (_id != -1) _item_id_cache[_id] = e.dataset.taskgroup;
        })
        return _item_id_cache[id];
    }
}

function extractID(e) {
    if ((el = $(e).find("[data-role='date']")[0]) || $(el = e).is("[data-role='date']")) {
        //if (el.value.includes("auto")) date_reparse(el, true);
        if ((bits = /id:(\w+)/g.exec(el.value)) != null) {
            return bits[1];
        }
    }
    return -1;
}

function assertID(span) {
    assdID = extractID(span);
    if (assdID == -1) {
        assdID = Date.now();
        $(span).find("[data-role='date']")[0].value += " id:" + assdID;
    }
    return assdID;
}

///////////////////All things date related//////////////////
var isDateSortReversed=false;
function reverseSort(){
    isDateSortReversed=!isDateSortReversed;
    first_sort();
}

//ordered for priority and overwriting
var date_parser_regexes = [{
        name: "time",
        regex: /(?:(?:(\d+)\/(\d+)(?:\/(\d+))?)|(?:(\d+):(\d+)(?::(\d+))?))/g
    },
    {
        name: "ampm",
        regex: /(am|pm)/gi
    },
    {
        name: "dayofweek",
        regex: /(?:(mon)|(tue)s*|(?:(wed)(?:nes)*)|(?:(thu)r*s*)|(fri)|(sat)(?:ur)*|(sun))(?:day)*/ig
    },
    //put today here
    //put ID parsing here!
    //setters
    {
        name: "today",
        regex: /today/g
    },
    {
        name: "now",
        regex: /now/g
    },
    {
        name: "atid",
        regex: /@(\w+)/g
    },
    {
        name: "delTime",
        regex: /(\+|-)(\d+)(?:(m)(?:in)*|(h)(?:ou)*(?:r)*|(d)(?:ay)*|(w)(?:ee)*(?:k)*|(M)(?:o)*(?:nth)*|(y(?:ea)*(?:r)*))/g
    }
    /*{ auto free might be cool in the future...
        name: "free",
        regex: /free:(\d+)(?:(m)(?:in)*|(h)(?:ou)*(?:r)*|(d)(?:ay)*|(w)(?:ee)*(?:k)*|(M)(?:o)*(?:nth)*|(y(?:ea)*(?:r)*))/g
    }*/
]

function date_parse(dvchain, recursive) {
    dvchain = dvchain.split("&");
    let dlist = [];
    for (let k = 0; k < dvchain.length; k++) {
        let dv = dvchain[k];
        let d = new Date();
        let hr = 9;
        let seen = false;
        let regres;
        let noDateSpecific = false;
        for (let z = 0; z < date_parser_regexes.length; z++) {
            date_parser_regexes[z].regex.lastIndex = 0; //force reset regexes
            while ((regres = date_parser_regexes[z].regex.exec(dv)) != null) {
                seen = true;
                switch (date_parser_regexes[z].name) {
                    case "time":
                        d.setMinutes(0);
                        d.setSeconds(0);
                        noDateSpecific = true;
                        if (regres[1]) {
                            d.setDate(Number(regres[1]))
                            noDateSpecific = false;
                        }
                        if (regres[2]) d.setMonth(Number(regres[2]) - 1)
                        if (regres[3]) {
                            yr = Number(regres[3]);
                            if (yr < 100) yr += 2000;
                            d.setFullYear(yr)
                        }
                        if (regres[4]) {
                            hr = Number(regres[4]);
                            if (hr < 6) hr += 12;
                        }
                        d.setHours(hr);
                        if (regres[5]) d.setMinutes(Number(regres[5]))
                        if (regres[6]) d.setSeconds(Number(regres[6]))
                        break;
                    case "ampm":
                        if (regres[1] == "am") {
                            if (d.getHours() > 12) {
                                d.setHours(d.getHours() - 12);
                            }
                        } else {
                            if (d.getHours() < 12) {
                                d.setHours(d.getHours() + 12);
                            }
                        }
                        break;
                    case "dayofweek":
                        nextDay = 0;
                        for (i = 0; i < regres.length; i++) {
                            if (regres[i] != undefined) {
                                nextDay = i;
                            }
                        }
                        if (d.getDay() == nextDay % 7 && Date.now() - d.getTime() > 0) {
                            d.setDate(d.getDate() + 7);
                        } else {
                            d.setDate(d.getDate() + (nextDay + 7 - d.getDay()) % 7);
                        }
                        break;
                    case "now":
                        d = new Date();
                        noDateSpecific = false;
                        break;
                    case "today":
                        today = new Date();
                        d.setDate(today.getDate());
                        d.setMonth(today.getMonth());
                        noDateSpecific = false;
                        break;
                    case "atid":
                        if (!recursive) d = new Date(Number(extractDate(lookupId(regres[1]), true)));
                        else d = new Date();
                        break;
                    case "delTime":
                        freeamt = 1;
                        for (i = 3; i < regres.length; i++) {
                            if (regres[i] != undefined) {
                                factor = i;
                            }
                        }
                        switch (factor) { /// this can be improved.
                            case 3:
                                freeamt = 1000 * 60;
                                break;
                            case 4:
                                freeamt = 1000 * 60 * 60;
                                break;
                            case 5:
                                freeamt = 1000 * 60 * 60 * 24;
                                break;
                            case 6:
                                freeamt = 1000 * 60 * 60 * 24 * 7;
                                break;
                            case 7:
                                freeamt = 1000 * 60 * 60 * 24 * 30;
                                break;
                            case 8:
                                freeamt = 1000 * 60 * 60 * 24 * 365;
                                break;
                        }
                        freeamt *= Number(regres[2]);
                        if (regres[1] == "-") freeamt *= -1;
                        d = new Date(d.getTime() + freeamt);
                        break;
                }
            }
        }
        while (noDateSpecific && Date.now() - d.getTime() > 0) d.setDate(d.getDate() + 1);
        if (seen) {
            dlist.push({
                date: d.getTime(),
                part: dv
            });
        }
    }
    dlist.sort((a, b) => {
        return a.date - b.date;
    });
    return dlist;
}


function first_sort() {
    items = [];
    //parse IDs

    //parse id+-'s

    $("#todolist>span:not(.pintotop)").each((i, e) => {
        ti = {
            id: e.dataset.taskgroup,
            done: 0
        };
        let el;
        if (el = $(e).find("[data-role='date']")[0]) {
            if (el.value.includes("auto")) date_reparse(el, true);
            ti.date = Number(extractDate(el, true));
            if (isNaN(ti.date)) ti.date = 9e15;
        }
        items.push(ti);
    })
    items.sort(itemComparer)
    for (i = 0; i < items.length; i++) {
        $("#todolist>span.template").after($("span[data-taskgroup=" + items[i].id + "]"));
        //console.log(items[i].id)
    }

    //dataset all IDs
    $("#todolist>span:not(.template) [data-role='date']").each((i, e) => {
        idcheck = /id\:(\d+)/g.exec(e.value);
        if (idcheck && idcheck.length > 1 && !isNaN(idcheck[1])) {
            e.dataset.timeid = idcheck[1];
        } else e.dataset.timeid = undefined;
    })

    //handle !before and !after tags
    $("#todolist>span:not(.template) [data-role='date']").each((i, e) => {
        b4 = /before\:(\d+)/g.exec(e.value);
        if (b4 && b4.length > 1) {
            $("#todolist tr [data-role='date'][data-timeid='" + b4[1] + "']").parent().parent().before(e.parentElement.parentElement);
        }
    });
    $("#todolist>span:not(.template) [data-role='date']").each((i, e) => {
        af = /after\:(\d+)/g.exec(e.value);
        if (af && af.length > 1) {
            $("#todolist tr [data-role='date'][data-timeid='" + af[1] + "']").parent().parent().after(e.parentElement.parentElement);
        }
    });
    $("#calendarView").fullCalendar('refetchEvents');
}

function date_reparse(e, callByAuto = false, recursive = false) { // date reparsing for a single item.
    //strip existing date
    let innerText = e.value;
    innerText = innerText.replace(/\[(.+)?\]/, "");
    //get sorted list of dates.
    dlist = date_parse(innerText, recursive);
    // returns an array of struct: date, part.
    if (dlist.length > 0) {
        ndarr = [];
        for (i = 0; i < dlist.length; i++) {
            ndarr.push(dlist[i].part);
        }
        e.value = ndarr.join("&"); // + "[" + new Date(dlist[0].date).toString().split("GMT")[0] + "]"
        e.dataset.date = dlist[0].date; //store it with dom cos y not
    } else {
        e.dataset.date = "no_date";
    }
    if (!callByAuto) first_sort();
}

dates_aligned = false;

function alignDates() {
    $("tr:not(.template) [data-role='date']").each((i, e) => {
        bits = /(.*?)(\[.*?\])(.*)/g.exec(e.value);
        if (bits != null) {
            if (dates_aligned) {
                e.value = bits[2] + bits[1] + bits[3];
            } else {
                e.value = bits[1] + bits[3] + bits[2];
            }
        }
    })
    dates_aligned = !dates_aligned;
}

function extractDate(e, assert) {
    if (typeof e == "string") {
        e = $("[data-taskgroup='" + e + "'][data-role='date']")[0];
    }
    let el;
    if ((el = $(e).find("[data-role='date']")[0]) || $(el = e).is("[data-role='date']")) {
        let ret;
        if (el.dataset.date) ret= el.dataset.date;
        else if (assert) date_reparse(el, true);
        if (el.dataset.date) ret= el.dataset.date;
        if (!isNaN(ret))return ret;
    }
    return undefined;
}

function itemComparer(a, b) {
    let result;
    if (a.done != b.done) result= b.done - a.done;
    else if (a.done * b.done) {
        result= -(b.date - a.date);
    } else {
        result= (b.date - a.date);
    }
    if (isDateSortReversed){
        result=-result;
    }
    return result;
}

$(() => {
    var dateContextedTarget;
    contextMenuManager.registerContextMenu(`
<div>
    <li class="rectify">Convert to fixed date</li>
</div>
`, "body", "input[data-role='date']", (e) => {
        dateContextedTarget = e.currentTarget;
        //find currentTarget
    });
    $(".rectify").on("click", () => {
        let date = new Date(Number(extractDate(dateContextedTarget, true)));
        dateContextedTarget.value = date.toLocaleString();
        $(".contextMenu").hide();
    })
});