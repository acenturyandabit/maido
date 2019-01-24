
function _addinManager(obj, userSettings) {
    let me = this;
    me.addins={};
    me.settings = {
        dataGetter:function(key,callback){
            let d=localStorage.getItem(key);
            try{
                d=JSON.parse(d);
            }catch(e){
            }
            callback(d);
        },
        dataSetter:function(key,data){
            let d=localStorage.setItem(key,data);
            try{
                d=JSON.parse(d);
            }catch(e){
            }
            callback(d);
        },
        savePrefix:"",
    }
    Object.assign(this.settings, userSettings);
    //NON-DOM initialisation

    //Maintain a list of active and inactive addins.
    me.div=document.createElement("div");
    me.div.innerHTML=`
    <div style="display:flex; flex-direction:row; width: 40vw">
      <div style="flex: 1 1 50%">
        <p>Currently active addins</p>
        <div id="accaddin"></div>
      </div>
      <div style="flex: 1 1 50%">
        <p>Available addins</p>
        <div id="unaddin"></div>
      </div>
    </div>
    `
    me.activeAddinDiv=me.div.querySelector("#accaddin");
    me.activeAddinDiv.addEventListener("click",(e)=>{
        if (e.target.tagName.toLowerCase()=="button"){
            //clean it up
            me.addins[e.target.dataset.ref].cleanup();
            //remove it from the list of stuff and add it.
            me.activeList.splice(me.activeList.indexOf(e.target.dataset.ref),1);
            me.settings.dataSetter(me.settings.savePrefix+"__addins_active_",me.activeList);
            //move the button across
            me.availAddinDiv.appendChild(e.target);
        }
    })
    //available div; initalising addins
    me.availAddinDiv=me.div.querySelector("#unaddin");
    me.availAddinDiv.addEventListener("click",(e)=>{
        if (e.target.tagName.toLowerCase()=="button"){
            //clean it up
            me.addins[e.target.dataset.ref].init();
            //remove it from the list of stuff and add it.
            me.activeList.push(e.target.dataset.ref);
            me.settings.dataSetter(me.settings.savePrefix+"__addins_active_",me.activeList);
            //move the button across
            me.activeAddinDiv.appendChild(e.target);
        }
    })
    //DOM initalisation
    
    this._init = function () {
        for(i in me.addins){
            let b=document.createElement("button");
            b.ref=i;
            b.innerText="i";
            me.availAddinDiv.appendChild(b);
        }
        me.settings.dataGetter(me.settings.savePrefix+"__addins_active_",(d)=>{
            me.activeList=d;
            if(d){
                for (let i=0;i<d.length;i++) {
                    if (me.addins[i]) {
                        addins[i].init();
                        me.activeAddinDiv.append(me.availAddinDiv.querySelector("[data-ref='"+i+"']"));
                    }
                }
            }
        })
    };

    if (document.readyState != "loading") this._init();
    else document.addEventListener("DOMContentLoaded", () => this._init());


    this.registerAddin=function(name,item){
        me.addins[name]=new item();
    }
}


/*
Sample addins file
quarterMaster.addinManager.registerAddin('addinName',function(){
    //stuff to do
    this.init=function(){
        quarterMaster.events.on('', (d)=>{});
    }
    this.cleanup=function(){

    }

})
*/
