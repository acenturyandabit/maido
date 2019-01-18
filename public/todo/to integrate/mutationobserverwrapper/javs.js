function javs(){
    let me=this;
    this.mutationCache=[];
    this.mo=MutationObserver((mutations)=>{
        mutations.forEach((m)=>{
            if (me.filterMutation(m)){
                me.mutationCache.push({date:Date.now(),mutation:m});
            }
        })
    });
    this.start=function(){
        this.mo.observe($("body")[0],{
            
        });
    }
    
}

// literally hook onto body

//fire all the events up to a certain point