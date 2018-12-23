addins.compain = new function () {
  this.init = function () {
    this.compainwindow = undefined;
    window.name = "maido";
    window.addEventListener("beforeunload", e => {
      if (compainwindow) compainwindow.close();
      return;
    });
    $("li:contains('View')>div").append(
      `
                <a id="compainButton" onclick="compainwindow=window.open('addins/compain.html','compain','width=300,height=100,toolbar=no,location=no,scrollbars=no,status=no,resizable=no');  compainwindow.focus(); void(0);">Open Companion</a>
            `
    );
    //set up a timer to update stuff
    this.itv = setInterval(addins.compain.compainClock, 500);
    //resizing and whatnot
  };

  this.cleanup = function () {
    if (this.compainwindow) compainwindow.close();
    $("#compainButton").remove();
    clearInterval(this.itv);
  };


  this.compainClock = function () {
    let nextItems = [];
    let tnext;
    for (
      i = 0; i < $("#todolist span:not('.pintotop') input[data-role='name']").length; i++
    ) {
      if (
        !$("#todolist span:not('.pintotop') input[data-role='tags']")[
          i
        ].value.includes("#nocompain")
      ) {
        if (extractDate($("#todolist span:not('.pintotop')")[i]) < Date.now()) {
          nextItems.push(
            $("#todolist span:not('.pintotop') input[data-role='name']")[i].value
          );
          if (!tnext)
            tnext = extractDate($("#todolist span:not('.pintotop')")[i]);
        } else {
          if (!tnext)
            tnext = extractDate($("#todolist span:not('.pintotop')")[i]);
          nextItems.push(
            $("#todolist span:not('.template') input[data-role='name']")[i].value
          );
          break;
        }
      }
    }
    try {
      window.localStorage.setItem("compainTask", JSON.stringify(nextItems));
      window.localStorage.setItem("compainDate", tnext);
    } catch (e) {}
  }
};