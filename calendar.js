$(()=>{
    $("#calendarView").fullCalendar({
        events:(start,end,timezone, callback)=>{
            let allList=[];
            $("#todolist>span:not(.pintotop)").each((i,e)=>{
                let thisdate=extractDate(e);
                let tzd=new Date();
                if (thisdate){
                    //correct for timezone
                    let isostring=new Date(Number(thisdate)-tzd.getTimezoneOffset()*60*1000);
                    let eisostring=new Date(isostring.getTime()+60*60*1000);
                    isostring=isostring.toISOString();
                    eisostring=eisostring.toISOString();
                    allList.push({id: e.dataset.taskgroup,
                    title:$(e).find("[data-role='name']")[0].value,
                    backgroundColor:$(e).find("input")[0].style.backgroundColor,
                    textColor:$(e).find("input")[0].style.color || "black",
                    start: isostring,end:eisostring});
                }
            })
            callback(allList);
        },
        defaultView:"agendaWeek"
    });
});