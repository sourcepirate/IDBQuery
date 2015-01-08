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
    /*
       Adding Listeners.
    */
    self.Listeners={};
    //
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
    OnDelete:function(event){

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
        var customobj={};
        var self=this;
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
            console.error(e.toString());
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
    },

    Query:function(tablename,type,callback){
        var self=this;
        self.queryresult=[];
        if(callback===undefined){callback=function(data){}}
        switch(type){
            case "object":
                   var util=new Util(self.dbname,tablename,self.version);
                   var table=self.getTable(tablename);
                   util.getObjects(table,function(data){
                    console.log("on get object callback");
                    self.queryresult.push(data);
                    callback(data);
                   });
                   break;
            case "relation":
                  var util=new Util(self.dbname,tablename,self.version);
                  var table=self.getTable(tablename);
                  util.getRelational(table,function(data){
                    self.queryresult.push(data);
                    callback(data);
                  });
                  break;
        }
    },
    get:function(tablename,primarykey,callback)
     {
        var self=this;
        self.queryresult=[];
        var tableutil=new TableUtil(self.dbname,tablename,self.version);
        tableutil.onGetObject=function(data)
        {
            self.queryresult.push(data);
            callback(data);
        }
        tableutil.getObject(primarykey);
     },
    addListener:function(type,callback)
    {
        var self=this;
        var listener=self.Listeners[type];
        if(listener==undefined)
        {
           self.Listeners[type]=callback;
        }
        switch(type)
        {
            case "save":
                self.OnSave=callback;
                break;
            case "delete":
                self.OnDelete=callback;
                break;
        }
    },
    Delete:function(tablename,primarykey)
    {
        var self=this;
        var util=new Util(self.dbname,tablename,self.version);
        var data;
        var foreigns;
        var table=self.getTable(tablename);
        function startBranchDelete()
        {
            var itemfrom=foreigns.tablename;
            var itemarein=foreigns.relations;
            var itemidis=foreigns.keyid;
            
            var itemskeynameis=self.getTable(itemfrom).getPrimaryKey().name;;

            if(itemarein.length>0)
            {
                itemarein.forEach(function(item)
                {
                    var currenttableprimarykey=self.getTable(item).getPrimaryKey().name;
                    self.Query(item,"relation",function(data){
                        if(data[itemskeynameis]==itemidis)
                        {
                            util.Delete(item,data[currenttableprimarykey]);
                            console.log("deleted");
                            console.log(data);
                        }
                    });
                });
            }
        }
        self.get(tablename, primarykey,function(dat){
            data=dat;
            foreigns={tablename:tablename,relations:table.references,keyid:primarykey};
            /*
            deleting the record here.
            */
            util.Delete(tablename, primarykey);
            startBranchDelete();
        });
    }
  }


