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
		stepcallback(self.list[currentposition]);
		if(self.hasNext())
		{
			//do nothing
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

