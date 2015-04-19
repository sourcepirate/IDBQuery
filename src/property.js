(function() {
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
