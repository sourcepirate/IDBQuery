
function Util(dbname,tablename,version)
{
    this.dbname=dbname;
    this.tablename=tablename;
    this.version=version;
    this.results=[];
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
   request.onerror=function(event)
   {
       console.error("error opening the database for reading");
   }
   request.onsuccess=function(event){
       var db=event.target.result;
       var transaction=db.transaction(tablename,"readwrite");
       var Store=transaction.objectStore(tablename);
       Store.openCursor().onsuccess=function(event){
           var cursor=event.target.result;
           if(cursor){
               if(columnname===undefined){
                   
               }
               else
               {
                   
               }
           }
       }
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
               callback();
           }
       }
   }
}
