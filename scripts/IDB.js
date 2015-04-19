(function() {

    Object.defineProperty(window, "IDB", {
        value: new Object(),
        writable: true,
        configurable: false
    });
    Object.defineProperty(IDB, "dblist", {
        value: new Object(),
        writable: true,
        configurable: false
    });

    function Database(name) {
        var _me = this;
        _me.tables = [];
        _me.name = name;
        _me.version = 0;

        function createDatabase(name) {
            var db = indexedDB.open(name, _me.version);
            var version = parseInt(db.version);
            _me.version = _me.version + 1;
        }

        createDatabase(name);

        //        function createTable(schema){
        //           var table=new IDB.Table(schema);
        //            _me.tables.push(table);
        //        }
    }

    IDB.Database = new Database;
})();
;(function() {

    function Table(db, schema) {
        var _me = this;
        _me.base = db;
        _me.name = schema.name;
        _me.properties = schema.properties;
        _me.foreignKeys = schema.foreignKeys;
    }

    Table.prototype = {
        createTable: function() {

        }
    }



    IDB.Table = Table;

})();
;var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var Transaction = window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
var KeyRange = window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
;(function() {
    function Property(definition) {
        var _me = this;
        _me.name = definition.name;
        _me.type = definition.type;
        _me.isKey = definition.key;
        _me.isauto = definition.auto;
        _me.foreignKey = null;
        _me.relatedTables = [];
    }
    Property.prototype = {
        isValid: function(name, value) {
            if (this.name == name && this.type == typeof value) {
                return true;
            } else {
                throw new SyntaxError(name + "," + value + "is not a valid input");
            }
        },

        setForeignKey: function(name) {
            _me.foreignKey = true;
            _me.relatedTables = IDB.dblist[name];
            return true;
        },


    }
})();
;function Deferred() {
    this._done = [];
    this._fail = [];
}
Deferred.prototype = {
    execute: function(list, args) {
        var i = list.length;
        console.log(list);
        // convert arguments to an array
        // so they can be sent to the
        // callbacks via the apply method
        args = Array.prototype.slice.call(args);
        console.log(args);
        while (i--) list[i].apply(null, args);
    },
    resolve: function() {
        this.execute(this._done, arguments);
    },
    reject: function() {
        this.execute(this._fail, arguments);
    },
    done: function(callback) {
        this._done.push(callback);
    },
    fail: function(callback) {
        this._fail.push(callback);
    }
}



//function Thread() {
//    var self = this;
//    //Changes to function applies here.
//    this.tasks = [];
//    this.jobs = [];
//}
//
//Thread.prototype = {
//    addTask: function(fn, params) {
//        var task = Process(fn, params);
//        this.tasks.push(task);
//    },
//    start: function() {
//        this.tasks.forEach(function(tsk) {
//            //seperate Threads are created...
//            worker = new Worker(tsk);
//        });
//    }
//}
/*
  If you have a small task it wont make any difference if it is huge task you will
  see the difference in speed
*/

function Thread() {
    var _me = this;
    _me.tasks = {};
    function Process(fn, params) {
        this.process = fn;
        var URL = window.URL;
        //http://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
        this.blob = URL.createObjectURL(new Blob(['(', fn, ').apply(null,[', params, '])'], {
            type: 'application/javascript'
        }));

        id = Math.floor(Math.random() * 1000000000)
        return [id, this.blob];
    }
    _me.addTask = function(fn, params) {
        var task = Process(fn, params);
        this.tasks[task[0]] = task[1];
    }
    _me.start = function() {
        //        this.tasks.forEach(function(task) {
        //            worker = new Worker(this.tasks[task]);
        //            delete this.tasks[task.id];
        //        });
        for (task in this.tasks) {
            var proc = this.tasks[task];
            var worker = new Worker(proc);
            delete this.tasks[task];
        }
    }
}


function Tasks() {
    this._tasks = [];
    this.length = 0;
    this._thread = new Thread();
}

Queue.prototype = {
    addTask: function(task, params) {
        this._tasks.push({
            func: task,
            params: params
        });
        this.length++;
    },
    runQueue: function() {
        for (var i = 0; i < this.len; i++) {
            this._tasks[i].func.apply(null, this.tasks[i].params);
        }
    },
    runParllel: function() {

    }
}
