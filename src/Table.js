window.tables=[];

function Table(name)
{
	this.name=name;
	this.properties=[];
	this.foreignKeys=[];
        this.values=[];
        this.currentptr=0;
}

Table.prototype={
    current:0,
    add:function(property)
    {
    	this.properties.push(property);
    },
    getPrimaryKey:function()
    {
       for(var i=0;i<this.properties.length;i++)
       {
       	  if(this.properties[i].complement)
       	  {
       	  	return this.properties[i];
       	  }
       }
    },
    addRelation:function(table)
    {
    	this.foreignKeys.push(table);
    	// this.properties.push(table.getPrimaryKey());
    	try
    	{
    	if(table.getPrimaryKey())
    	{
    		var t=Object.create(table.getPrimaryKey());
    		t.relation="foreign";
    		this.properties.push(t);
    	}
    	else
    	{
    		throw table;
    	}
        }
        catch(e)
        {
        	console.log("The table doesn't have a primary key",e.name);
        }
    },
    toString:function()
    {
    	console.log(this.name+" "+this.properties+" "+this.foreignKeys+" "+this.values);
    },
    put:function(data){
       /*
        * validate the data being sent
        */
        try
        {
        var flag=false;
        var pts=this.properties;
        for(var key in data)
        {
            pts.forEach(function(property){
                if(key===property.name)
                {
                    if(property.type===typeof data[key])
                    {
                        flag=true;
                    }
                    else
                    {
                        throw data;
                    }
                }
            });
        }
        if(flag)
        {
             this.values.push(data);
        }
        }
        catch(e)
        {
            console.log(e);

        }
    },
}