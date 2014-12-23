
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
  var self=this;
  self.resultsbycolumns={};
  if(columnname===undefined)
  {
    self.GetAll();
  }
  else
  {
    resultsbycolumns[columnname]=[];
    self.onDataAdded=function()
    {
      this.results.forEach(function(res){
        self.resultsbycolumns[columnname].push(res[columnname]);
      });
    }
    self.GetAll();
  }
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
