function IDBDriver()
{
    var self=this;
    
    if(window.IDBDriver==undefined)
    {
      window.IDBDriver=this;
    }
    self.version=2; //version is 2 if we want to override it we should user window.IDBDriver.version=desired value
    self.DB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    self.createDatabase=function(namelist)
    {
        try
        {
            if(namelist.length==undefined)
            {
                self.request=self.DB.open(namelist,self.version);
            }
            else
            {
                namelist.forEach(function(name){
                    self.reqlist=[];
                    self.reqlist.push(self.DB.open(name,self.version));
                });
            }
        }
        catch(e){
            console.log(e + " encountered durring opening database");
        }
    }
}