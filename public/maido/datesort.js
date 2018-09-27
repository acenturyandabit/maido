function itemComparer(a, b) {
    return (b.date - a.date) + 1e15 * (b.done - a.done);
}

function first_sort() {
    items = [];
    $("tr:not(.initial)").each((i, e) => {
        ti = {
            id: e.dataset.taskgroup,
            date: 9999999999999,
            done: 0
        };
        if (el = $(e).find(".date")[0]) {
            if ((bits = /\[(.+?)\]/g.exec(el.value)) != null) {
                if (!isNaN(Date.parse(bits[1]))) {
                    ti.date = Date.parse(bits[1])
                }
            }
        }
        if (el = $(e).find("button")[0]) {
            if (el.innerText == "Redo") {
                ti.done = 1;
            }
        }
        items.push(ti)
    })
    items.sort(itemComparer)
    for (i = 0; i < items.length; i++) {
        $("tr.initial").after($("tr[data-taskgroup=" + items[i].id + "]"));
        //console.log(items[i].id)
    }
    //console.log(items)
}

function date_reparse(e) {
    bits=/(.*?)(?:\[.*?\])(.*)/g.exec(e.value);
    if (bits==null){
        dv=e.value;
    }else{
        dv=bits[1]+bits[2];
    }
    var d = new Date();
    switch (dv) {
        case "":
            e.value = dv + "[" + d.toString().split("GMT")[0] + "]"
            break;
        case "now":
            d.setTime(Date.now());
            e.value = dv + "[" + d.toString().split("GMT")[0] + "]"
            break;
        case "waiting":
            d.setTime(Date.now() + 1000 * 60 * 60 * 24);
            e.value = dv + "[" + d.toString().split("GMT")[0] + "]"
            break;
        case "someday":
            d.setTime(Date.now() + 365* 24 * 60 * 60 * 1000);
            e.value = dv + "[" + d.toString().split("GMT")[0] + "]"
            break;
        default:
            regexes = [/(?:(?:(\d+)\/(\d+)(?:\/(\d+))?)|(?:(\d+):(\d+)(?::(\d+))?\s*|(am|pm)))/g, /(?:(mon)|(tue)s*|(?:(wed)(?:nes)*)|(?:(thu)r*s*)|(fri)|(sat)(?:ur)*|(sun))(?:day)*/ig,/\+(\d+)(?:(m)(?:in)*|(h)(?:ou)*(?:r)*|(d)(?:ay)*|(w)(?:ee)*(?:k)*|(M)(?:o)*(?:nth)*|(y(?:ea)*(?:r)*))/g]
            d_cmp = dv.split(" ");
            //d_cmp=d_cmp.map(x=>x.toLowerCase())
            d = new Date()
            d.setMinutes(0);
            d.setSeconds(0);
            hr = 9;
            found=false;
            for (j = 0; j < regexes.length; j++) {
                noDateSpecific = true;
                addamt=0;
                for (i in d_cmp) {
                    while ((regres = regexes[j].exec(d_cmp[i])) != null) {
                        found=true;
                        switch (j) {
                            case 0:
                                if (regres[1]) {
                                    d.setDate(Number(regres[1]))
                                    noDateSpecific = false;
                                }
                                if (regres[2]) d.setMonth(Number(regres[2]) - 1)
                                if (regres[3]) d.setFullYear(Number(regres[3]))
                                if (regres[4]) hr = Number(regres[4]);
                                if (regres[5]) d.setMinutes(Number(regres[5]))
                                if (regres[6]) d.setSeconds(Number(regres[6]))
                                if (regres[7] == 'pm') hr += 12;
                                d.setHours(hr);
                                break;
                            case 1:
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
                            case 2:
                                addamt=1;
                                for (i = 2; i < regres.length; i++) {
                                    if (regres[i] != undefined) {
                                        factor=i;
                                    }
                                }
                                switch(factor){ /// this can be improved.
                                    case 2:
                                        addamt=1000*60;
                                        break;
                                    case 3:
                                        addamt=1000*60*60;
                                        break;
                                    case 4:
                                        addamt=1000*60*60*24;
                                        break;
                                    case 5:
                                        addamt=1000*60*60*24*7;
                                        break;
                                    case 6:
                                        addamt=1000*60*60*24*30;
                                        break;
                                    case 7:
                                        addamt=1000*60*60*24*365;
                                        break;
                                }
                                addamt*=Number(regres[1]);
                                break;
                        }
                    }
                }
            }
            if (found){
                d.setTime(d.getTime()+addamt)
                while (noDateSpecific && Date.now() - d.getTime() > 0) d.setDate(d.getDate() + 1) // increment to tomorrow if too late today. kinda like postpone but not really
                e.value = dv + "[" + d.toString().split("GMT")[0] + "]"
            }else{
                e.style.background = "red";
                setTimeout(() => {
                    e.style.background = "white";
                }, 200)
            }
            /*deprecated. who even types out long dates anyways
            if (isNaN(Date.parse(dv))) {
                
            } else {
                var d = new Date();
                d.setTime(Date.parse(dv));
                e.value = dv+"["+d.toString().split("GMT")[0]+"]"
            }*/
    }
    first_sort();
}

dates_aligned=false;
function alignDates(){
    $("tr:not(.initial) .date").each((i,e)=>{
        bits=/(.*?)(\[.*?\])(.*)/g.exec(e.value);
        if (bits!=null){
            if (dates_aligned){
                e.value=bits[2]+bits[1]+bits[3];
            }else{
                e.value=bits[1]+bits[3]+bits[2];
            }
        }
    })
    dates_aligned=!dates_aligned;
}