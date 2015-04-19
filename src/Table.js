(function() {

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
