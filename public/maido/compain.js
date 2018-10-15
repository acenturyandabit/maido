function compainClock() {
    let tcur = -1;
    let pseudonext;
    for (i = 0; i < $("#todolist tr:not('.template') input[data-role='name']").length; i++) {
        if (tcur == -1 && !$("#todolist tr:not('.template') input[data-role='tags']")[i].value.includes("#nocompain")) {
            tcur = i;
            if (extractDate($("#todolist tr:not('.pintotop')")[i]) > Date.now()) {
                pseudonext = i;
                break;
            }
        } else if (!$("#todolist tr:not('.template') input[data-role='tags']")[i].value.includes("#nocompain") && extractDate($("#todolist tr:not('.pintotop')")[i]) > extractDate($("#todolist tr:not('.pintotop')")[tcur])) {
            pseudonext = i;
            break;
        }
    }
    let tnext;
    for (i = 0; i < $("#todolist tr:not('.template') input[data-role='name']").length; i++) {
        if (extractDate($("#todolist tr:not('.pintotop')")[i]) > Date.now() && !$("#todolist tr:not('.template') input[data-role='tags']")[i].value.includes("#nocompain")) {
            tnext = i;
            break;
        }
    }
    bescared = false;
    if (tnext != pseudonext) bescared = true;
    try {
        window.localStorage.setItem("compainTask", $("#todolist tr:not('.template') input[data-role='name']")[tcur].value);
        window.localStorage.setItem("compainTaskPlus", $("#todolist tr:not('.template') input[data-role='name']")[tnext].value);
        window.localStorage.setItem("compainDate", extractDate($("#todolist tr:not('.pintotop')")[tcur]));
        window.localStorage.setItem("compainDatePlus", extractDate($("#todolist tr:not('.pintotop')")[tnext]));
        window.localStorage.setItem("compainAlert", bescared);
    } catch (e) {

    }
};

window.addEventListener("beforeunload",(e)=>{
    compainwindow.close();
    return;
});

$(document).ready(() => {
    $("li:contains('View')>div").append(
        `
        <a onclick="compainwindow=window.open('compain.html','compain','width=300,height=100,toolbar=no,location=no,scrollbars=no,status=no,resizable=no');  compainwindow.focus(); void(0);">Open Companion</a>
    `
    )
    //set up a timer to update stuff
    setInterval(compainClock, 500)
});