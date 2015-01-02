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
            t.complement=false;
            t.isAuto=false;
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
    getForeignKeys:function()
    {
        var keycollection=[];
        this.foreignKeys.forEach(function(key){
            var obj={};
            obj[key.getPrimaryKey().name]=key.name;
            keycollection.push(obj);
        });
        return keycollection;
    },
    delete:function(utilobj,primarykey)
    {
        utilobj.delete(this.name,primarykey);
    }
}