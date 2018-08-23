$(document).ready(()=>{
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerHeight>window.innerWidth){
		$("#divider").on("click",()=>{
			if ($("#problem_box")[0].style.display=="none"){
				$("#problem_box")[0].style.display="flex";
				$("#solution_box")[0].style.display="none";
				$("#divider p").text("View solutions >>>");
				
			}else{
				$("#problem_box")[0].style.display="none";
				$("#solution_box")[0].style.display="flex";
				$("#divider p").text("View problems <<<");
			}
			resetLinking();
		});
		$(".listbox").on("click",".discussionItem",(e)=>{
			if(!e.target.classList.contains("ico")){
				if (linkingID!="")showLinks(e.currentTarget.id);
				else showEdit(e.currentTarget.id);
			}			
		});
		$(".listbox").on("click",".linkIco",function(e){
			phoneShowLinks(e.currentTarget.parentNode.id);
		})
	}else{
		$(".listbox").on("click",".linkIco",function(e){
			showLinks(e.currentTarget.parentNode.id);
		})
		$(".listbox").on("click",".discussionItem",function(e){
			showLinks(e.currentTarget.id);
		})
	}
});

function phoneShowLinks(id){
	if (linkingID==""){
		$(".linkIco").hide();
		if ($("#problem_box")[0].style.display=="none"){
			$("#problem_box")[0].style.display="flex";
			$("#solution_box")[0].style.display="none";
			$("#divider p").text("Done >>>");		
			$("#linkShadow").text("Select items to link to your solution. Press done when you're finished.");
		}else{
			$("#problem_box")[0].style.display="none";
			$("#solution_box")[0].style.display="flex";
			$("#divider p").text("Done <<<");
			$("#linkShadow").text("Select items to link to your problem. Press done when you're finished.");
		}
	}
	showLinks(id);
}