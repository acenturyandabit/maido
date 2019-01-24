quarterMaster.addinManager.registerAddin('tagman',function(){
    //stuff to do
    this.init=function(){
        //add the topbar item
        this.li=document.createElement("li");
        this.li.innerHTML=`
        <span>Open tagmanager</span>
        `
        quarterMaster.div.querySelector("ul.topbar ul.list").appendChild(this.li);
        quarterMaster.topbarManager.checkTopbars(quarterMaster.div);
        //add the dialog
        this.dialog=document.createElement("div");
        
        quarterMaster.div.appendChild();
        
        //hook on loadFromData

        //hook on tagbox value changed

        quarterMaster.events.on('', (d)=>{});
    }
    this.cleanup=function(){

    }

})