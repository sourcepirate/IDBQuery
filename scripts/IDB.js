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
                self.version=self.version+1;
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
        var dbname=this.dbname;
        var version=this.version;
        var self=this;
        var customobj={};
        customobj["eventorigin"]=tablename;
        try
        {
        var table=this.getTable(tablename);
        var name=table.getPrimaryKey().name;
         if(!(name in data))
        {
           data[name]=table.currentptr+1;
           console.log("at if");
           table.currentptr=table.currentptr+1;
        }
        else
        {
            console.log("at else");
            
          if(data[name]>=table.currentptr+1 || data[name]<=table.currentptr-1 ){
             console.log("at else if");
             data[name]=table.currentptr+1;
              table.currentptr=table.currentptr+1;
          }
        }
        //checking for foreign keys
        var util;
        var foreignkey=table.getForeignKeys();
        if(foreignkey.length>0)
        {
            for(var index in foreignkey)
            {
            for(var key in foreignkey[index])
            {
                util=new Util(dbname,foreignkey[index][key], version);
                var def=util.isThere(data[key]);
            }
            }
            setTimeout(function(){      
            if(util.flag)
            { 
            customobj["data"]=data;
            console.log(data);
            table.put(data);
            self.Store(table.name);
            self.OnSave(customobj);
            }
            else
            {
                throw data;
            }
            },100);
        }
        else
        {
            customobj["data"]=data;
            console.log(data);
            table.put(data);
            self.Store(table.name);
            self.OnSave(customobj); 
        }
        }
        catch(e)
        {
            console.error(e);
            console.log("Error Commiting to database");
        }
        //save goes here
       // this.OnSave(customobj);
    },
    Store:function(tablename)
    {
        var table=this.getTable(tablename);
        console.log("Storing on "+this.version+"of database");
       while(table.values.length>0)
       {
           var util=new Util(this.dbname,tablename,this.version);
           var data=table.values.shift();
           console.log(data);
           util.add(data);
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
    }
};
function Util(dbname,tablename,version)
{
    this.dbname=dbname;
    this.tablename=tablename;
    this.version=version;
    this.results=[];
    this.flag=false;
}

Util.prototype.add=function(data)
{
    console.log("the current version of database is "+this.version);
    var datatobe=data;
    var indexDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request=indexDB.open(this.dbname,this.version);
    var tablename=this.tablename;
    request.onerror=function(event){
        console.error("error opening the database");
    }
    request.onsuccess=function(event){
        var db=event.target.result;
        var transaction=db.transaction(tablename,"readwrite");
        var store=transaction.objectStore(tablename);
        store.put(datatobe);
    }
}

Util.prototype.read=function(tablename,columnname,offset)
{
   var indexDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
   var request=indexDB.open(this.dbname,this.version);
   var tablename=this.tablename;
   var result=[];
   var value=0;
}
Util.prototype.readColoumn=function(tablename,columnname)
{

}
Util.prototype.onDataAdded=function()
{
  console.log(this.results);    
}

Util.prototype.GetAll=function(tablename)
{
    this.results=[];
    var result=this.results;
    var indexDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request=indexDB.open(this.dbname,this.version);
    var tablename=this.tablename;
    var callback=this.onDataAdded;
     request.onerror=function(event)
   {
       console.error("error opening the database for reading");
   }
   request.onsuccess=function(event){
       var db=event.target.result;
       var transaction=db.transaction(tablename,"readwrite");
       console.log(tablename);
       var Store=transaction.objectStore(tablename);
       Store.openCursor().onsuccess=function(event){
           var cursor=event.target.result;
           if(cursor)
           {
               result.push(cursor.value);  
               cursor.continue();
           }
           else
           {
               //do nothing
               console.log("cursor has done");
               callback();
           }
       }
   }
}
//check whether the give primary key is there are not.
Util.prototype.isThere=function(id)
{
    var val;
    var self=this;
    var indexDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request=indexDB.open(this.dbname,this.version);
    var tablename=this.tablename;
    request.onerror=function(event)
    {
      console.log("error opening the database");
    }
    request.onsuccess=function(event)
    {
      var db=event.target.result;
      var transaction=db.transaction(tablename,"readwrite");
      var Store=transaction.objectStore(tablename);
      val=Store.get(id);
    }
    setTimeout(function(){
      if(val.result!==undefined){
        self.flag=true;

      }
      else
      {
        self.flag=false;

      }
    },100);
}
;function Deferred(){
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
  resolve: function(){
    this.execute(this._done, arguments);
  },
  reject: function(){
    this.execute(this._fail, arguments);
  }, 
  done: function(callback){
    this._done.push(callback);
  },
  fail: function(callback){
    this._fail.push(callback);
  }  
}