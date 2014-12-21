
function Util(dbname,tablename,version)
{
    this.dbname=dbname;
    this.tablename=tablename;
    this.version=version;
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

Util.prototype.read=function()
{
    
}
