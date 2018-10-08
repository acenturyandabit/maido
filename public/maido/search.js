$(document).ready(()=>{

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    table.searchfilter tr:not(.pintotop){
        display:none;
    }
    #todolist tr.searchvisible{
        display:table-row;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    $("#searchbar").on("keyup",()=>{
        cval=$("#searchbar")[0].value
        if (cval==""){
            $("#todolist").removeClass("searchfilter");
        }else{
            $("#todolist").addClass("searchfilter");
            $("#todolist tr").removeClass("searchvisible");
            cvals=cval.split(" ");
            for (i=0;i<cvals.length;i++)if (cvals[i]=="")cvals.splice(i,1)
            $("#todolist tr").each((i,e)=>{
                for (term of cvals){
                    term=term.toLowerCase()
                    innerText="";
                    $(e).find("input,textarea").each((_i,_e)=>{innerText+=_e.value})
                    if (innerText.toLowerCase().includes(term)){
                        $(e).addClass("searchvisible");
                    }
                }
            })
            
        }
    })
})