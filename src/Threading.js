/*Implementing Threading*/
function Process(fn, params) {
    this.process = fn;
    var URL = window.URL;
    //http://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
    this.blob = URL.createObjectURL(new Blob(['(', fn, ').apply(null,', params, ')'], {
        type: 'application/javascript'
    }))
    return this.blob;
}

function Thread() {
    var self = this;
    //Changes to function applies here.
    this.tasks = [];
    this.jobs = [];
}

Thread.prototype = {
    addTask: function(fn, params) {
        var task = Process(fn, params);
        this.tasks.push(task);
    },
    start: function() {
        this.tasks.forEach(function(tsk) {
            //seperate Threads are created...
            worker = new Worker(tsk);
        });
    }
}
