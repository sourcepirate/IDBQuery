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