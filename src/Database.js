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
        customobj["data"]=data;
        console.log(data);
        table.put(data);
        this.Store(table.name);
        }
        catch(e)
        {
            console.error(e);
            console.log("Error Commiting to database");
        }
        //save goes here
       this.OnSave(customobj);
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

