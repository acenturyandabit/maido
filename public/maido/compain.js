function compainClock() {
    let nextItems=[];
    let tnext;
    for (i = 0; i < $("#todolist tr:not('.pintotop') input[data-role='name']").length; i++) {
        if (!$("#todolist tr:not('.pintotop') input[data-role='tags']")[i].value.includes("#nocompain")) {
            if (extractDate($("#todolist tr:not('.pintotop')")[i]) < Date.now()) {
                nextItems.push($("#todolist tr:not('.pintotop') input[data-role='name']")[i].value);
                if (!tnext)tnext=extractDate($("#todolist tr:not('.pintotop')")[i]);
            }else{
                if (!tnext)tnext=extractDate($("#todolist tr:not('.pintotop')")[i]);
                nextItems.push($("#todolist tr:not('.template') input[data-role='name']")[i].value);
                break;
            }
        }
    }
    try {
        window.localStorage.setItem("compainTask", JSON.stringify(nextItems));
        window.localStorage.setItem("compainDate", tnext);
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