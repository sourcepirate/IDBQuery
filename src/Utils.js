function Util(dbname, tablename, version) {
    this.dbname = dbname;
    this.tablename = tablename;
    this.version = version;
    this.results = [];
    this.flag = false;
    this.queried = [];
}

Util.prototype.add = function(data) {
        console.log("the current version of database is " + this.version);
        var datatobe = data;
        var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var request = indexDB.open(this.dbname, this.version);
        var tablename = this.tablename;
        request.onerror = function(event) {
            console.error("error opening the database");
        }
        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction(tablename, "readwrite");
            var store = transaction.objectStore(tablename);
            store.put(datatobe);
        }
    },
    Util.prototype.query = function() {

    },
    Util.prototype.read = function(tablename, columnname) {
        var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var request = indexDB.open(this.dbname, this.version);
        var tablename = this.tablename;
        var result = [];
        var value = 0;
        var self = this;
        self.readColoumn(tablename, columnname);
    },

    Util.prototype.Condition = function(tablename, columnname) {

    }
Util.prototype.readColoumn = function(tablename, columnname) {
    var self = this;
    self.resultsbycolumns = {};
    if (columnname === undefined) {
        self.onDataAdded = function() {
            self.results.forEach(function(r) {
                console.log(r);
            });
        }
        self.GetAll();
    } else {
        self.resultsbycolumns[columnname] = [];
        self.onDataAdded = function() {
            self.results.forEach(function(res) {
                self.resultsbycolumns[columnname].push(res[columnname]);
            });
        }
        self.GetAll();
    }
}

Util.prototype.onDataAdded = function() {
    console.log(this.results);
}

Util.prototype.GetAll = function(tablename) {
        this.results = [];
        var result = this.results;
        var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var request = indexDB.open(this.dbname, this.version);
        var tablename = this.tablename;
        var callback = this.onDataAdded;
        request.onerror = function(event) {
            console.error("error opening the database for reading");
        }
        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction(tablename, "readwrite");
            console.log(tablename);
            var Store = transaction.objectStore(tablename);
            Store.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    //do nothing
                    console.log("cursor has done");
                    callback();
                }
            }
        }
    }
    //check whether the give primary key is there are not.
Util.prototype.isThere = function(id) {
    var val;
    var self = this;
    var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request = indexDB.open(this.dbname, this.version);
    var tablename = this.tablename;
    request.onerror = function(event) {
        console.log("error opening the database");
    }
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(tablename, "readwrite");
        var Store = transaction.objectStore(tablename);
        val = Store.get(id);
    }
    setTimeout(function() {
        if (val.result !== undefined) {
            self.flag = true;
        } else {
            self.flag = false;
        }
    }, 100);
}

Util.prototype.getObjects = function(tableobject, callback, columnname) {
    var self = this;
    self.resultsbycolumns = {};
    var foreignkeys = tableobject.getForeignKeys();
    if (callback === undefined) {
        callback = function(data) {}
    }
    if (columnname === undefined) {
        if (foreignkeys.length > 0) {
            self.onDataAdded = function() {
                console.log("on channel event");
                self.results.forEach(function(result) {
                    console.log("under result ");
                    for (var key in result) {
                        console.log(key);
                        for (var index in foreignkeys) {
                            if (key in foreignkeys[index]) {
                                console.log(key + "is foreignkeys");
                                var tbl = new TableUtil(self.dbname, foreignkeys[index][key], self.version);
                                tbl.onGetObject = function(data) {
                                    result[key] = data;
                                    self.queried.push(result);
                                    callback(result);
                                }
                                tbl.getObject(result[key]);
                            }
                        }
                    }
                });
            }
        } else {
            self.onDataAdded = function() {
                self.results.forEach(function(result) {
                    self.queried.push(result);
                    callback(result);
                });
            }
        }
        self.GetAll();
    } else {
        self.resultsbycolumns[columnname] = [];
        self.onDataAdded = function() {

        }
        self.GetAll();
    }
}

Util.prototype.getRelational = function(tableobj, callback, columnname) {
    var self = this;
    self.queried = [];
    if (callback === undefined) {
        callback = function(data) {}
    }
    if (columnname === undefined) {
        self.onDataAdded = function() {
            console.log("got into on channel event");
            self.results.forEach(function(result) {
                self.queried.push(result);
                callback(result);
            });
        }
        self.GetAll();
    } else {

    }
}

Util.prototype.Delete = function(tablename, primarykey) {
    var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request = indexDB.open(this.dbname, this.version);
    var self = this;

    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(tablename, "readwrite");
        var store = transaction.objectStore(tablename);
        console.log(typeof primarykey);
        store.delete(primarykey);
    }
    request.onerror = function(event) {
        //the data has been deleted.
    }
}


Util.prototype.Search = function(tablename, indexname, callback) {
    var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request = indexDB.open(this.dbname, this.version);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(tablename, "readwrite");
        var store = transaction.objectStore(tablename);
        var index = store.index(indexname);
        index.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var datastructure = {
                    key: cursor.key,
                    object: cursor.value
                };
                callback(datastructure);
                cursor.continue();
            } else {
                //donothing
            }
        }
    }
    request.onerror = function(event) {
        console.error("ERROR WHILE OPENING THE DATABASE FOR SEARCHING WITHOUT ANY CONDITION");
    }
}

Util.prototype.getBy = function(tablename, indexname, keyvalue, callback) {
    var indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request = indexDB.open(this.dbname, this.version);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(tablename, "readwrite");
        var store = transaction.objectStore(tablename);
        var index = store.index(indexname);
        index.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.key == keyvalue) {
                    var datastructure = {
                        key: cursor.key,
                        object: cursor.value
                    };
                    callback(datastructure);
                }
                cursor.continue();
            } else {
                //do nothing
            }
        }
    }
    request.onerror = function(event) {
        console.error("ERROR WHILE OPENING THE DATABASE FOR SEARCHING WITHOUT ANY CONDITION");
    }
}


/*
  End of Util Class
*/




/*
   Table Util for high primitive table functions.
*/
function TableUtil(dbname, tablename, version) {
    this.dbname = dbname;
    this.tablename = tablename;
    this.version = version;

}

TableUtil.prototype = {
    onGetObject: function(data) {
        console.log(data);
    },
    getObject: function(id) {

        this.indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.request = this.indexDB.open(this.dbname, this.version);
        var self = this;
        self.request.onsuccess = function(event) {
            console.log("getting inside onsuccess event");
            var db = event.target.result;
            var transaction = db.transaction(self.tablename, "readwrite");
            var store = transaction.objectStore(self.tablename);
            self.val = store.get(id);
        }
        self.request.onerror = function(event) {
            console.log("error has occured");
        }
        setTimeout(function() {
            self.onGetObject(self.val.result);
        }, 100);
    },
    onDeleteObj: function(data) {

    },
    DeleteObj: function(id) {
        this.indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.request = this.indexDB.open(this.dbname, this.version);
        var self = this;
    }
}


function Condition() {
    var self = this;
    self.kwargs = {};
    self.args = arguments;
}

Condition.prototype = {

}
