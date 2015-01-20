function Iterator(list)
{
	this.list=list;
	this.currentposition=0;
	var self=this;
	if(self.list.hasOwnProperty('length'))
	{
		self.length=self.list.length-1;
	}
	else
	{
		self.list=[self.list];
		self.length=0;
	}
}

Iterator.prototype.hasNext=function()
{
	var self=this;
	var flag=false;
	if(self.list[self.currentposition+1]!==undefined && self.list[self.currentposition+1]!==null)
	{
		flag=true;
	}
	return flag;
}

Iterator.prototype.Next=function()
{
	var self=this;
	var pos=self.currentposition;
	self.currentposition=self.currentposition+1;
	return self.list[pos];
}

Iterator.prototype.Prev=function()
{
	var self=this;
	var pos=self.currentposition-1;
	return self.list[pos];
}

Iterator.prototype.IterateOver=function(totalcallback,stepcallback)
{
	var self=this;
	if(stepcallback==null ||stepcallback==undefined)
		{
			stepcallback=function(data){};
		}
	function closure()
	{
		stepcallback(self.list[self.currentposition]);
		if(self.hasNext())
		{
			//do nothing
                        self.Next();
		}
		else
		{
			totalcallback(self.list);
		}
	}
	self.list.forEach(function(item){
		closure();
	});
}

function Deferred(){
  this._done = [];
  this._fail = [];
}
Deferred.prototype = {
  execute: function(list, args){
    var i = list.length;
   console.log(list);
    // convert arguments to an array
    // so they can be sent to the
    // callbacks via the apply method
    args = Array.prototype.slice.call(args);
    console.log(args);
    while(i--) list[i].apply(null, args);
  },
  resolve: function(arguments){
    this.execute(this._done, arguments);
  },
  reject: function(arguments){
    this.execute(this._fail, arguments);
  }, 
  done: function(callback){
    this._done.push(callback);
  },
  fail: function(callback){
    this._fail.push(callback);
  }  
}


function Condition(value)
{
  var self=this;
  self.value=value;
}

Condition.prototype={
   
   isLesserThan:function(val)
   {
    return this.val<val;
   },

   isGreaterThan:function(val)
   {
      return this.val>val;
   },

   isEqualto:function(val)
   {
      return this.value==val;
   },

   isGreaterAndEqual:function(val)
   {
      return this.value>=val;
   },

   isLesserAndEqual:function(val)
   {
     return this.value<=val;
   },

}


function Collections()
{
	this.args=arguments;
	this.sequence={};

	this.sequence["gt"]=">";
	this.sequence["lt"]="<";
	this.sequence["ge"]=">=";
	this.sequence["le"]="<=";
	this.sequence["eq"]="==";

}
Collections.prototype={
    
    Max:function(field)
    {
       if(field!=undefined) 
       	{
       		return Math.max.apply(null,this.args[field]);
       	}
       else
        {
            return Math.max.apply(null,this.args);
        }
    },
    Min:function(field)
    {
    	if(field!=undefined) 
       	{
       		return Math.min.apply(null,this.args[field]);
       	}
       else
        {
            return Math.min.apply(null,this.args);
        }
    },
    Map:function(callback)
    {
    	var values=[];
    	for(var i=0;i<this.args.length;i++)
    	{
    		values.push(callback(this.args[i]));
     	}
     	return values;
    },
    /*
    For Object Collections
    */
    Pluck:function(fieldname)
    {
    	var values=[];
    	this.args.forEach(function(arg){
    		values.push(arg[fieldname]);
    	});
    	return values;
    },
    getBy:function(fieldname,conditiontype,value)
    {
    	var operation;
    	if(this.sequence[conditiontype]!=undefined)
    	{
    		operation=this.sequence[conditiontype];
    	}
    	else
    	{
    		throw "Condition not Present";
    	}
    	var values=[];
    	this.args.forEach(function(arg){
    		if(eval(arg+operation+value))
    		{
    			values.push(arg);
    		}
    	});
    	return values;
    },

}


function Task(fn,params)
{
   this.job=fn;
   this.job.started=false;
   this.job.paused=false;
   this.job.stopped=false;
   this.job.end=false;
   this.arg=params
   this.result=undefined;
}

Task.prototype={

   execute:function(){
    this.job.apply(this,this.arg);
    this.OnEnd();
   },
   OnEnd:function(){
   	this.job.end=true;
   },
   Oncomplete:function(callback)
   {
   	this.job.end=true;
   	callback();
   },
   checkOnComplete:function()
   {
   	 var flag=false;
   	 while(true)
   	 {
   	 	
   	 }
   },
   pause:function()
   {
   	this.job.paused=true;
   },
   stop:function()
   {
   	this.job.stopped=true;
   },
   start:function()
   {
   	this.job.started=true;
   	this.execute();
   }
}




function SemaPhore()
{
   this.timeout=200;
   this.tasks=[];
   this.activity={};
}

SemaPhore.prototype={
	addTask:function(fn,params)
	{
		var task=new Task(fn,params);
		this.tasks.push(task);
	},
	start:function()
	{
		var self=this;
		for(var task in this.tasks)
		{
			
			self.tasks[task].execute();
			//used for locking the process till a process is completly finished.
			while(true)
			{
			  if (this.tasks[task].job.end) {
				break;
			  }
			}
		}
	},
	
}