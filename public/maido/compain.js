function compainClock(){
    window.localStorage.setItem("compainTask",$("#todolist tr:not('.template') input[data-role='name']")[0].value);
    window.localStorage.setItem("compainDate",extractDate($("#todolist tr:not('.template') input[data-role='date'] ")[0]));
};


$(document).ready(() => {
    $("li:contains('View')>div").append(
        `
        <a onclick="NewWindow=window.open('compain.html','compain','width=300,height=100,toolbar=no,location=no,scrollbars=no,status=no,resizable=no');  NewWindow.focus(); void(0);">Open Companion</a>
    `
    )
   //set up a timer to update stuff
   setInterval(compainClock,500)
   
});