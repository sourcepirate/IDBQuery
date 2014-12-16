function DataBase(dbname)
{
    var self=this;
    
    if(window.IDBDriver===undefined)
    {
      window.IDBDriver=this;
    }
    self.version=2; //version is 2 if we want to override it we should user window.IDBDriver.version=desired value
    self.DB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
   // self.databases=[];
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
                var version=parseInt(database.version);
                database.close();
                var req=self.DB.open(self.dbname,version+1);
                req.onupgradeneeded=function(event)
                {
                    var datbase=event.target.result;
                    var fields=Schema.getAllFields();
                }
            }

        }

}