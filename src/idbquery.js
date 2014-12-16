/*
   Parameter needed by the table objects
   1) tablename
   2) primarykey
   3) properties
   4) foreign key
*/

window.tablelist=[];

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

     self.foreignkeys=[];
     
     self.addProperty=function(propertyobj){
         self.properties.push(propertyobj);
     }
     
     self.addForeignReference=function(tableobj)
     {
         self.foreignkeys.push(tableobj);
     }
     
     self.getPrimaryKey=function()
     {
         return self.key;
     }
     
     self.values=[];
     
     self.QueryALL=function()
     {

     }
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
/*
    {
      name:"order",
      key:"order_id",
      properties:[
      {name:"person",type:"string"},
      {name:"cattle",type:"number"}
      ],
      foreignkey;[
      {name:"tablename"}
      ]
    }
*/
function Schema(jsondata)
{
    var self=this;
    function Table_Object_from_data(data)
    {
        if(data.name){
            self.name=data.name;
        }
        if(data.key){
            self.key=data.key;
        }
        self.table=new Table(self.name,self.key);
        if(data.properties)
        {
            var obj=data.properties;
            if(obj.hasOwnProperty('length'))
            {
                obj.forEach(function(property){
                    console.info("adding propery "+property);
                    self.table.addProperty(property);
                });
            }
            else
            {
                self.table.addProperty(obj);
            }
        }
        if(data.foreignkeys)
        {
            var keys=data.foreignkeys;
            keys.forEach(function(obj){
            if(obj.hasOwnProperty('length'))
            {
                obj.forEach(function(key){
                    //foreign key
                    window.tablelist.forEach(function(table){
                        if(table.name===key.name)
                        {
                            self.table.addProperty({name:table.name,type:typeof table.getPrimaryKey(),ref:table});
                        }
                    });
                });
            }
            else
            {
                window.tablelist.forEach(function(table){
                    if(table.name===obj.name)
                    {
                          self.table.addProperty({name:table.name,type:typeof table.getPrimaryKey(),ref:table});
                    }
                });
            }
            });
        }
        window.tablelist.push(self.table);
    }
    Table_Object_from_data(jsondata);
    self.getAllFields=function()
    {
        var listoffields=[];
        listoffields.push(self.table.properties);
        listoffields.push(self.table.key);
        return listoffields;
    }
    self.getValues=function(name,offset)
    {

    }
}
// var table=new Table("order");
// table.addProperty({
//      name:"name",type:"number"
// });
// table.addProperty({
//      name:"email",type:"string"
// })
// table.put({name:2,email:"Sathya@gmail.com"});

// console.log(table);

var dumpdata={
    name:"hello",
    properties:[
    {name:"hi",type:"string"}
    ]
};
var dumptwo={
    name:"bye",
    properties:[
    {name:"own",type:"string"}
    ],
    foreignkeys:[
        {name:"hello"}
    ]
}

var schema=new Schema(dumpdata);
var schema2=new Schema(dumptwo);

