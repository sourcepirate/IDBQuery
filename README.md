<center> <h1> IDB Query </h1> </center>

<h2>Description</h2>

<p>Using IndexedDB is with native js library is very hard and time consuming task,
This IDBQuery Library simplifies that by using NativeSQl instead of indexedDB
functions.</p>

<p> This way we organise the indexedDB offline data better.</p>

<h3>Creating a Database Object:</h3>
<p> We create an Indexed DB database by using Database Object</p>

```javascript

var database=new DataBase("database-name");

```

<h3> Schemas </h3>

<p> Schemas are the description of table. Like MySQL the IDB schema object takes a table-description
object</p>


```javascript
  
  var data={
      name:"person",
      properties:[
      {name:"person_name",type:"string"},
      {name:"person_id",type:"number"},
      ],
      foreignKeys:[
      {name:"user"}
      ]
  }

```

<p> foreign-keys refers to the name of other table which a record in current table has to point </p>

<b>Note:</b>
<p>By default the shema object create a primary_key property for the data you specified. else you can specify the 
primary-key value manually </p>

```javascript
  var data={
      name:"person",
      properties:[
      {name:"person_name",type:"string"},
      {name:"person_id",type:"number",auto:true,key:true},
      ],
      foreignKeys:[
      {name:"user"}
      ]
  }
```
<p> Setting key value to true sets this as primary-key and auto true will make an auto increment </p>



