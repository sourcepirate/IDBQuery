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
    Getting the database namelist and populating it and creating a database length
    */

        self.createStore=function(Schema)
        {
            var request=self.DB.open(self.dbname,self.version);

            request.onsuccess=function(event)
            {
                var database=event.target.result;
             //  var version=parseInt(database.version);
                console.log(self.version);
                database.close();
                var req=self.DB.open(self.dbname,self.version+1);
                req.onupgradeneeded=function(event)
                {
                    var db=event.target.result;
                    var store=db.createObjectStore(Schema.tabel.name,{
                        keyPath:Schema.tabel.getPrimaryKey().name
                    });
                    Schema.tabel.properties.forEach(function(prop){
                        if(prop.key)
                        {
                        store.createIndex(prop.name,prop.name,{unique:true});
                        }
                        else
                        {
                        store.createIndex(prop.name,prop.name,{unique:false});
                        }
                    });
                }
                req.onsuccess=function(event)
                {
                    event.target.result.close();
                }
            }         

        }

    self.CreateSchemas=function(Schema)
    {
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
                    Schema.forEach(function(scheme){
                        var store=db.createObjectStore(scheme.tabel.name,{keyPath:scheme.tabel.getPrimaryKey().name});
                        scheme.tabel.properties.forEach(function(prop){
                            store.createIndex(prop.name,prop.name,{unique:false});
                        });
                    })
                }
                req.onsuccess=function(event)
                {
                    event.target.result.close();
                }
            }         

    }

}