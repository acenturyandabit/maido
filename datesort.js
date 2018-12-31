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
            if (!isNaN(bits[1])) {
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
        if (idcheck && idcheck.length>1 && !isNaN(idcheck[1])){
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

function date_reparse(e, callByAuto = false) {
    bits = /(.*?)(?:\[.*?\])(.*)/g.exec(e.value);
    if (bits == null) {
        dvchain = e.value;
    } else {
        dvchain = bits[1] + bits[2];
    }
    dlist=date_parse(dvchain);
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