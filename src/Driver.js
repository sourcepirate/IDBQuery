function DataDriver(name)
{
    var self=this;
    
    if(window.IDBDriver===undefined)
    {
      window.IDBDriver=this;
    }
    self.version=2; //version is 2 if we want to override it we should user window.IDBDriver.version=desired value
    self.DB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
   // self.databases=[];
    
    /*
    Getting the database namelist and populating it and creating a database length
    */
    
    //validating the name of database
    try
    {
    if(name.length!==undefined || typeof name!=="string")
    {
        throw name;
    }
    }
    catch(e)
    {
        console.error(e +"is not a string");
        return;
    }
    
    self.request=self.DB.open(name,self.version);
    
    self.tables=[];
    /*
      Table object should be such that the schemas should be like this.
      {name:tablename,key:"keyfieldname"}
    */
    self.createTables=function(Schemas)
    {
        
        
    }
    
}