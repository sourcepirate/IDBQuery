function Property(name,type)
{
	this.name=name;
	this.type=type;
	this.complement=false;
	this.isAuto=false;
	this.values=[];
}
Property.prototype={
	put:function(value)
	{
		try
		{
		if(this.type==typeof value)
		{
			this.values.push(value)
		}
		else
		{
			throw value;
		}
	    }
	    catch(e)
     	{
     		console.log("Prototype Mismatch "+e);
     	}
	},
	setKey:function(bool)
	{
		if(bool)
		{
			//console.log("setting complement");
			this.isAuto=true;
			this.complement=true;
		}
		else
		{
			this.complement=true;
		}
	},
	get:function(number)
	{
		return this.values[number];
	},
	toString:function()
	{
		console.log(this.name+"  "+this.type+" "+this.values);
	}
}