function loadFromString(str) {
    data = JSON.parse(str);
    $("#todolist tr:not(.pintotop)").remove()
    $("#todolist_db textarea:not(.template)").remove()
    for (d in data) {
        loadSingleEntry(d,data[d])
    }
    if (data && Object.keys(data).length>0)$("#nothingLeft").hide();
    else{
        $("#nothingLeft").show()
    }
}

function loadSingleEntry(id, data) {
    //console.log(id,data);
    newNode = $("#todolist tr.template")[0].cloneNode(true)
    newNode.classList.remove('pintotop');
    newNode.classList.remove('template');
    $(newNode).find("button").text("Remove");
    newNode.dataset.taskgroup = id;

    //clone the description box as well. 
    dbox=$("#todolist_db .template")[0].cloneNode(true);
    dbox.classList.remove("template");
    dbox.dataset.taskgroup = id;
    $("#todolist_db").append(dbox);
    $(newNode).find("*").each((i, e) => {
        e.dataset.taskgroup = newNode.dataset.taskgroup
    })
    $("#todolist").append(newNode)
    for (p in data) {
        e = $("[data-taskgroup='"+id+"'][data-role*='" + p + "']")[0]
        if (e)e.value = data[p];
    }
    for (f in precheck) {
        precheck[f](newNode);
    }
    
}