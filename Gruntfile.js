module.exports=function(grunt)
{
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    
    uglify:{
      options:{
        manage:false
      },
      my_target:{
          files:{
            'scripts/IDB.min.js':['src/*.js']
          }
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
};