$(document).ready(()=>{

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    table.searchfilter tr{
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
            $("#todolist tr").each((i,e)=>{
                for (term of cvals){
                    innerText="";
                    $(e).find("input,textarea").each((_i,_e)=>{innerText+=_e.value})
                    if (innerText.includes(term)){
                        $(e).addClass("searchvisible");
                    }
                }
            })
            
        }
    })
})