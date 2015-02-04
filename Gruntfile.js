module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                manage: false
            },
            my_target: {
                files: {
                    'scripts/IDB.min.js': ['src/*.js']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/*.js', 'test/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        jsbeautifier: {
            files: ["Gruntfile.js", "src/*.js"],
            options: {}
        },
        concat: {
            // Specify some options, usually specific to each plugin.
            options: {
                // Specifies string to be inserted between concatenated files.
                separator: ';'
            },
            // 'dist' is what is called a "target."
            // It's a way of specifying different sub-tasks or modes.
            dist: {
                // The files to concatenate:
                // Notice the wildcard, which is automatically expanded.
                src: ['src/*.js'],
                // The destination file:
                // Notice the angle-bracketed ERB-like templating,
                // which allows you to reference other properties.
                // This is equivalent to 'dist/main.js'.
                dest: 'scripts/IDB.js'
                    // You can reference any grunt config property you want.
                    // Ex: '<%= concat.options.separator %>' instead of ';'
            }
        },
        watch: {

            scripts: {

                files: ['src/*.js'],

                tasks: ['concat', 'uglify', 'jsbeautifier'],

                options: {
                    spawn: false,
                },
            },
        },



    });
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
