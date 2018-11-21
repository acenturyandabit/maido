function itemComparer(a, b) {
    if (a.done != b.done) return b.done - a.done;
    else if (a.done * b.done) {
        return -(b.date - a.date);
    } else {
        return (b.date - a.date);
    }

}

function extractDate(e) {
    if (el = $(e).find("[data-role='date']")[0]) {
        //if (el.value.includes("auto")) date_reparse(el, true);
        if ((bits = /\[(.+?)\]/g.exec(el.value)) != null) {
            if (!isNaN(Date.parse(bits[1]))) {
                return Date.parse(bits[1]);
            }
        }
    }
    return -1;
}

function extractID(e) {
    if (el = $(e).find("[data-role='date']")[0]) {
        //if (el.value.includes("auto")) date_reparse(el, true);
        if ((bits = /id:(\d+)/g.exec(el.value)) != null) {
            if (!isNaN(bits[i])) {
                return Number(bits[1]);
            }
        }
    }
    return -1;
}

function first_sort() {
    items = [];
    $("#todolist>span:not(.pintotop)").each((i, e) => {
        ti = {
            id: e.dataset.taskgroup,
            date: 9999999999999,
            done: 0
        };
        if (el = $(e).find("[data-role='date']")[0]) {
            if (el.value.includes("auto")) date_reparse(el, true);
            if ((bits = /\[(.+?)\]/g.exec(el.value)) != null) {
                if (!isNaN(Date.parse(bits[1]))) {
                    ti.date = Date.parse(bits[1])
                }
            }
            if (el.value.includes("done")) {
                ti.done = 1;
            }
        }
        items.push(ti)
    })
    items.sort(itemComparer)
    for (i = 0; i < items.length; i++) {
        $("#todolist>span.template").after($("span[data-taskgroup=" + items[i].id + "]"));
        //console.log(items[i].id)
    }

    //dataset all IDs
    $("#todolist>span:not(.template) [data-role='date']").each((i,e)=>{
        idcheck=/id\:(\d+)/g.exec(e.value);
        if (idcheck && idcheck.length>1){
            e.dataset.timeid=idcheck[1];
        }else e.dataset.timeid=undefined;
    })

    //handle !before and !after tags
    $("#todolist>span:not(.template) [data-role='date']").each((i,e)=>{
        b4=/before\:(\d+)/g.exec(e.value);
        if (b4 && b4.length>1){
            $("#todolist tr [data-role='date'][data-timeid='"+b4[1]+"']").parent().parent().before(e.parentElement.parentElement);
        }
    })
    $("#todolist>span:not(.template) [data-role='date']").each((i,e)=>{
        af=/after\:(\d+)/g.exec(e.value);
        if (af && af.length>1){
            $("#todolist tr [data-role='date'][data-timeid='"+af[1]+"']").parent().parent().after(e.parentElement.parentElement);
        }
    })
}

var regexes = {
    time: /(?:(?:(\d+)\/(\d+)(?:\/(\d+))?)|(?:(\d+):(\d+)(?::(\d+))?\s*|(am|pm)))/g,
    hourOnlyTime: /^(\d+)(am|pm)/g,
    dayofweek: /(?:(mon)|(tue)s*|(?:(wed)(?:nes)*)|(?:(thu)r*s*)|(fri)|(sat)(?:ur)*|(sun))(?:day)*/ig,
    plusTime: /\+(\d+)(?:(m)(?:in)*|(h)(?:ou)*(?:r)*|(d)(?:ay)*|(w)(?:ee)*(?:k)*|(M)(?:o)*(?:nth)*|(y(?:ea)*(?:r)*))/g,
    done: /done/g,
    auto: /auto/g,
    now: /now/g,
    waiting: /waiting/g,
    someday: /someday/g,
    id: /id\:(\d+)/g,
    before: /before\:(\d+)/g,
    after: /after\:(\d+)/g,
    free: /free:(\d+)(?:(m)(?:in)*|(h)(?:ou)*(?:r)*|(d)(?:ay)*|(w)(?:ee)*(?:k)*|(M)(?:o)*(?:nth)*|(y(?:ea)*(?:r)*))/g
}

function date_reparse(e, callByAuto = false) {
    //remove []
    bits = /(.*?)(?:\[.*?\])(.*)/g.exec(e.value);
    if (bits == null) {
        dvchain = e.value;
    } else {
        dvchain = bits[1] + bits[2];
    }
    dvchain = dvchain.split("&");
    let dlist = [];
    let d;
    for (k = 0; k < dvchain.length; k++) {
        dv = dvchain[k];
        d = new Date();
        d_cmp = dv.split(" ");
        d.setMinutes(0);
        d.setSeconds(0);
        hr = 9;
        freeamt = 0;
        found = false;
        noDateSpecific = true;
        for (j in regexes) {

            for (i in d_cmp) {
                while ((regres = regexes[j].exec(d_cmp[i])) != null) {
                    found = true;
                    switch (j) {
                        case "time":
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
                            if (regres[4]) hr = Number(regres[4]);
                            if (regres[5]) d.setMinutes(Number(regres[5]))
                            if (regres[6]) d.setSeconds(Number(regres[6]))
                            if (regres[7] == 'pm') hr += 12;
                            d.setHours(hr);
                            break;
                        case "hourOnlyTime":
                            if (regres[1]) hr = Number(regres[1]);
                            if (regres[2] == 'pm') hr += 12;
                            d.setHours(hr);
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
                        case "plusTime":
                            freeamt = 1;
                            for (i = 2; i < regres.length; i++) {
                                if (regres[i] != undefined) {
                                    factor = i;
                                }
                            }
                            switch (factor) { /// this can be improved.
                                case 2:
                                    freeamt = 1000 * 60;
                                    break;
                                case 3:
                                    freeamt = 1000 * 60 * 60;
                                    break;
                                case 4:
                                    freeamt = 1000 * 60 * 60 * 24;
                                    break;
                                case 5:
                                    freeamt = 1000 * 60 * 60 * 24 * 7;
                                    break;
                                case 6:
                                    freeamt = 1000 * 60 * 60 * 24 * 30;
                                    break;
                                case 7:
                                    freeamt = 1000 * 60 * 60 * 24 * 365;
                                    break;
                            }
                            freeamt *= Number(regres[1]);
                            break;
                        case "done":
                            break;
                        case "auto":
                            break;
                        case "now":
                            d.setTime(Date.now());
                            break;
                        case "waiting":
                            d.setTime(Date.now() + 1000 * 60 * 60 * 24);
                            break;
                        case "someday":
                            d.setTime(Date.now() + 365 * 24 * 60 * 60 * 1000);
                            break;
                        case "free":
                            freeamt = 1;
                            for (i = 2; i < regres.length; i++) {
                                if (regres[i] != undefined) {
                                    factor = i;
                                }
                            }
                            switch (factor) { /// this can be improved.
                                case 2:
                                    freeamt = 1000 * 60;
                                    break;
                                case 3:
                                    freeamt = 1000 * 60 * 60;
                                    break;
                                case 4:
                                    freeamt = 1000 * 60 * 60 * 24;
                                    break;
                                case 5:
                                    freeamt = 1000 * 60 * 60 * 24 * 7;
                                    break;
                                case 6:
                                    freeamt = 1000 * 60 * 60 * 24 * 30;
                                    break;
                                case 7:
                                    freeamt = 1000 * 60 * 60 * 24 * 365;
                                    break;
                            }
                            freeamt *= Number(regres[1]);
                            lastdate = Date.now();
                            pass = false;
                            $('input[data-role="date"').each((i, el) => {
                                if (!pass)
                                    if ((bits = /\[(.+?)\]/g.exec(el.value)) != null) {
                                        if (!isNaN(Date.parse(bits[1]))) {
                                            thendate = Date.parse(bits[1]);
                                            if (thendate - lastdate > freeamt+100) {
                                                pass = true;
                                            }else{
                                                lastdate=thendate;
                                            }
                                        }
                                    }
                            });
                            d.setTime(lastdate + freeamt);
                    }
                }
            }
        }
        if (found) {
            d.setTime(d.getTime() + freeamt);
            while (noDateSpecific && Date.now() - d.getTime() > 0) d.setDate(d.getDate() + 1); // increment to tomorrow if too late today. kinda like postpone but not really
            dlist.push({
                date: d.getTime(),
                part: dv
            });
        }
    }
    dlist.sort((a, b) => {
        return a.date - b.date;
    });
    if (dlist.length > 0) {
        ndarr = [];
        for (i = 0; i < dlist.length; i++) {
            ndarr.push(dlist[i].part);
        }
        e.value = ndarr.join("&") + "[" + new Date(dlist[0].date).toString().split("GMT")[0] + "]"
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