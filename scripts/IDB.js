function DataBase(dbname)
{
    var self=this;
    
    if(window.IDBDriver===undefined)
    {
      window.IDBDriver=this;
    }
    self.version=2; //version is 2 if we want to override it we should user window.IDBDriver.version=desired value
    self.DB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    //self.databases=[];
    self.dbname=dbname;
    /*
     *Tables hold the schema object 
     *
     */
    this.tables=[];
    /*
    Getting the database namelist and populating it and creating a database length
    */
    this.createSchemas=function()
    {
        var Schema=self.tables;
         var request=self.DB.open(self.dbname,self.version);

            request.onsuccess=function(event)
            {
                var database=event.target.result;
                var version=parseInt(database.version);
                console.log(version);
                database.close();
                var req=self.DB.open(self.dbname,version+1);
                console.log(version+1);
                req.onupgradeneeded=function(event)
                {
                    var db=event.target.result;
                    if(Schema.hasOwnProperty('length'))
                    {
                    Schema.forEach(function(scheme){
                        var store=db.createObjectStore(scheme.tabel.name,{keyPath:scheme.tabel.getPrimaryKey().name});
                        scheme.tabel.properties.forEach(function(prop){
                            if(!prop.key)
                            {
                            store.createIndex(prop.name,prop.name,{unique:false});
                            }
                            else
                            {
                            store.createIndex(prop.name,prop.name,{unique:true});
                            }
                        });
                    });
                   }
                   else
                   {
                       var store=db.createObjectStore(Schema.tabel.name,{keyPath:Schema.tabel.getPrimaryKey().name});
                       Schema.tabel.forEach(function(prop){
                          if(!prop.key)
                            {
                            store.createIndex(prop.name,prop.name,{unique:false});
                            }
                            else
                            {
                            store.createIndex(prop.name,prop.name,{unique:true});
                            }
                       });
                   }
                }
                req.onsuccess=function(event)
                {
                    event.target.result.close();
                }
            }         

    }

}

DataBase.prototype={
    addTable:function(tabledata){
        var schema=new Schema(tabledata);
        this.tables.push(schema);
    },
    //Initialize function is used to convert the all the schema to table data
    Initialize:function(){
       this.createSchemas();
    },
    //this function function is usefull while binding the gui event with db events.
    OnSave:function(event){

    },
    getTable:function(name)
    {
        var table;
        for(var index in this.tables)
        {
            var schema=this.tables[index];
            if(schema.tabel.name==name)
            {
                table=schema.tabel;
            }
        }
        return table;
    },
    Save:function(tablename,data)
    {
        // var event;
        // event.tablename=tablename;
        // event.addedData=data;
        //codes goes here.
        try
        {
        var table=this.getTable(tablename);
        table.put(data);
        this.Store(table.name);
        }
        catch(e)
        {
            console.log("Error Commiting to database");
        }
        //save goes here
        this.OnSave(event);
    },
    Store:function(tablename)
    {
        var dbname=self.dbname;
        self.version=self.version;
        var table=this.getTable(tablename);
        var request=self.DB.open(dbname,self.version);
        request.onerror=function(error){
            console.log("Error Occured While Opening the Table "+e);
        };
        request.onsuccess=function(event)
        {
            var db=event.target.result;
            var transaction=self.DB.transaction(tablename,"readwrite");
            var store=transaction.objectStore(tablename);
            while(table.values.length>0)
            {
                store.add(table.values.shift());
            }
        }
    }
}

;function Property(name,type)
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
};function Schema(data)
{
	var self=this;
    self.data=data;

    (function validate(data)
    {
    	try
    	{
    		/*
    		parsing the table name
    		*/
    		var pkeycount=0;
    		if(self.data.name)
    		{
    			self.tablename=self.data.name;
    		}
    		else
    		{
    			self.tablename="SchemaUndefined";
    		}
    		self.tabel=new Table(self.tablename);

    		/*
    		 *parsing properties
    		 */
    		 if(self.data.properties)
    		 {
    		 	self.data.properties.forEach(function(property){
    		 		var p=new Property(property.name,property.type);
    		 		if(p.type==undefined)
    		 		{
    		 			throw p;
    		 		}
    		 		if(property.key && property.auto)
    		 		{
    		 			p.setKey(true);
    		 			pkeycount++;
    		 		}
    		 		else
    		 		{
    		 			if(property.key)
    		 			{
    		 				p.setKey(false);
    		 				pkeycount++;
    		 			}
    		 		}
    		 		self.tabel.add(p);
    		 		if(pkeycount<=1)
    		 		{
    		 			p.code=001;
    		 			//throw p;
    		 		}
    		 	});
    		 }
    		 /*
    		 *parsing foreign keys
    		 */
    		 if(self.data.foreignKeys)
    		 {
    		 	window.tables.forEach(function(table){
    		 		self.data.foreignKeys.forEach(function(key){
    		 			if(key.name===table.name)
    		 			{
    		 				self.tabel.addRelation(table);
    		 			}
    		 		});
    		 	});
    		 }
    	}
    	catch(e)
    	{
    		switch(e.code)
    		{
    			case 1:
    			    console.log("Table cannot have more than one primary key");
    			    return;
    			    break;
    		}
    		console.log(e);
    	}
    	return true;
    })(self.data);
    /*
    Adding Primary Key if does not -exist
    */

    if(!self.tabel.getPrimaryKey())
    {
       var primarykey=new Property(self.tabel.name+"_id","number");
       primarykey.setKey(true);
       self.tabel.add(primarykey);
    }

    window.tables.push(self.tabel);
    console.log(self.tabel);
};window.tables=[];

function Table(name)
{
	this.name=name;
	this.properties=[];
	this.foreignKeys=[];
    this.values=[];
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