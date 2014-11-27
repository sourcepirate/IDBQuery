function Table(name,idobj){
     
     var self=this;
     
     this.ptr=0;//points to the current primary key.
     
     self.name=name;
     if(idobj===undefined)
     {
         self.key={name:self.name+"_id",type:"number", autoincrement:true};
     }
     else
     {
         self.key=idobj;
     }
     
     
     self.properties=[];
     
     self.value=[];
     
     self.addProperty=function(propertyobj){
         self.properties.push(propertyobj);
     }
     
     self.addForeignReference=function(tableobj)
     {
         self.properties.push(tableobj.getPrimaryKey());
     }
     
     self.getPrimaryKey=function()
     {
         return self.key;
     }
     
     self.values=[];
     
     self.put=function(data)
     {
         var flag=false;
         try
         {
         for(var key in data)
         {
             self.properties.forEach(function(property){
                 if(key===property.name)
                 {
                     if(property.type===typeof data[key])
                     {
                         flag=true;
                     }
                     else
                     {
                         throw data;
                     }
                 }
             });
         }
         if(flag)
         {
             data[self.key.name]=++self.ptr;
             self.values.push(data);
         }
         }
         catch(e)
         {
             console.error(e+" doesn't match the scheme");
         }
     }
     
     self.commit=function()
     {
         //for inserting and creating indexed db;
     }
     self.create=function()
     {
         //gonna do some research.
     }
     self.toString=function()
     {
         return "Table "+self.name+"("+(function(){
             var datastring="";
             self.properties.forEach(function(prop){
                datastring=datastring+prop.name+","; 
             });
             return datastring;
         })()+")";
     }
};

var table=new Table("order");
table.addProperty({
     name:"name",type:"number"
});
table.put({name:1});
table.put({name:2});
table.put({name:"sathya"});
console.log(table.values);