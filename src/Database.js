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
