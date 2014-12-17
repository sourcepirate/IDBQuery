function Queue()
{
	this.task=[];
}

Queue.prototype={
	addtoQueue:function(callback)
	{
		this.task.push(callback);
	},
	execute:function()
	{
		var length=this.task.length;
		while(length--)
		{
			this.task[length].apply(null);
		}
	},
	resolve:function()
	{
		this.execute();
	}
}


var queue=new Queue();
queue.addtoQueue(function(){
	console.log("hi");
});
queue.addtoQueue(function(){
	setTimeout(function(){
		console.log("hey");
	},1000);
});

queue.addtoQueue(function(){
	console.log("hi");
});

queue.resolve();