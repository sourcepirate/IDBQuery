function Deferred(){
  this._done = [];
  this._fail = [];
}
Deferred.prototype = {
  execute: function(list, args){
    var i = list.length;
   console.log(list);
    // convert arguments to an array
    // so they can be sent to the
    // callbacks via the apply method
    args = Array.prototype.slice.call(args);
    console.log(args);
    while(i--) list[i].apply(null, args);
  },
  resolve: function(){
    this.execute(this._done, arguments);
  },
  reject: function(){
    this.execute(this._fail, arguments);
  },
  done: function(callback){
    this._done.push(callback);
  },
  fail: function(callback){
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

function Thread(){
   var _me=this;
   _me.tasks=[];
   _me.jobs=[];
   function Process(fn, params) {
    this.process = fn;
    var URL = window.URL;
    //http://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
    this.blob = URL.createObjectURL(new Blob(['(', fn, ').apply(null,', params, ')'], {
        type: 'application/javascript'
    }))
    return this.blob;
    }
   _me.addTask=function(fn,params){
     var task=Process(fn,params);
     this.tasks.push(task);
    }
   _me.start=function(){
     this.tasks.forEach(function(task){
         worker=new Worker(task);
     });
   }
}
