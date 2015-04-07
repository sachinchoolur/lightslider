'use strict';
module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
            },
            basic: {
              src: ['src/js/<%= pkg.name %>.js'],
              dest: 'dist/js/<%= pkg.name %>.js'
            },
            extras: {
              src: ['src/css/<%= pkg.name %>.css'],
              dest: 'dist/css/<%= pkg.name %>.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                  expand: true,
                  cwd: 'src/css',
                  src: ['*.css', '!*.min.css'],
                  dest: 'dist/css',
                  ext: '.min.css'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/img/',
                src: ['**'],
                dest: 'dist/img/'
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/js/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        /*sass: {
            dist: {
                options: { // Target options
                    style: 'expanded'
                },
                files: {
                    'src/css/lightgallery.css': 'src/sass/lightgallery.scss'
                }
            }
        },*/
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            },
            css: {
                files: 'src/**/*.scss'
                //tasks: ['sass']
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9000
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'clean', 'concat', 'uglify', /*'sass',*/ 'cssmin', 'copy']);
    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });
    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
