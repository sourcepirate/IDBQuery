function Table(name,idobj){
     
     var self=this;
     
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

var table=new Table("order",{
     name:"orderid",
     type:"number",
     autoincrement:false
});
console.log(table.toString());
