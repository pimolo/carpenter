module.exports = function(grunt) {
    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        <% if(data.htmlTemplate === 'HTML' || data.cssTemplate === 'CSS' || data.jsTemplate === 'JS') { %>
        copy: {
            <% if(data.htmlTemplate === 'HTML') { %>
            html: {
                files: [
                    {
                        src: ['**/*.html'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                    }
                ]
            },
            <% } %>
            <% if(data.cssTemplate === 'CSS') { %>
            css: {
                files: [
                    {
                        src: ['**/*.css'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                    }
                ]
            },
            <% } %>
            <% if(data.jsTemplate === 'JS') { %>
            js: {
                files: [
                    {
                        src: ['**/*.js'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                    }
                ]
            }
            <% } %>
        },
        <% } %>
        <% if(data.htmlTemplate === 'Jade') { %>
        jade: {
            build: {
                files: [
                    {
                        src: ['**/*.jade'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                        ext: '.html'
                    }
                ]
            }
        },
        <% } else if(data.htmlTemplate === 'EJS') { %>
        ejs: {
            build: {
                src: ['**/*.ejs'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true,
                ext: '.html'
            }
        },
        <% } %>
        <% if(data.cssTemplate === 'Sass') { %>
        sass: {
            build: {
                files: [
                    {
                        src: ['**/*.scss'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                        ext: '.css'
                    }
                ]
            }
        },
        <% } else if(data.cssTemplate === 'Less') { %>
        less: {
            build: {
                files: [
                    {
                        src: ['**/*.less'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                        ext: '.css'
                    }
                ]
            }
        },
        <% } else if(data.cssTemplate === 'Stylus') { %>
        stylus: {
            build: {
                files: [
                    {
                        src: ['**/*.styl'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                        ext: '.css'
                    }
                ]
            }
        },
        <% } %>
        <% if(data.jsTemplate !== 'JS') { %>
        coffee: {
            build: {
                files: [
                    {
                        src: ['**/*.coffee'],
                        cwd: 'src/',
                        dest: 'dist/',
                        expand: true,
                        ext: '.js'
                    }
                ]
            }
        },
        <% } %>
        <% if(data.dependencies.length > 0) { %>
        concat: {
            bower_css: {
                src: [
                    <% if(data.dependencies.indexOf('bootstrap') > -1) { %>'bower_components/bootstrap/dist/css/bootstrap.min.css', <% } %>
                    <% if(data.dependencies.indexOf('fontawesome') > -1) { %>'bower_components/fontawesome/css/fontawesome.min.css'<% } %>
                ],
                dest: 'dist/css/dependencies.css'
            },
            bower_js: {
                src: [
                    <% if(data.dependencies.indexOf('jquery') > -1) { %>'bower_components/jquery/dist/jquery.min.js', <% } %>
                    <% if(data.dependencies.indexOf('angular') > -1) { %>'bower_components/angular/angular.min.js', <% } %>
                    <% if(data.dependencies.indexOf('bootstrap') > -1) { %>'bower_components/bootstrap/dist/js/bootstrap.min.js'<% } %>]
                dest: 'dist/js/dependencies.js'
            }
        },
        <% } %>
        express: {
            serve: {
                options: {
                    script: 'main.js'
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:3000/'
            }
        },
        watch: {
            template: {
                <% if(data.htmlTemplate === 'Jade') { %>
                files: ['src/**/*.jade'],
                tasks: ['jade'],
                <% } else if(data.htmlTemplate === 'EJS') { %>
                files: ['src/**/*.ejs'],
                tasks: ['ejs'],
                <% } else { %>
                files: ['src/**/*.html'],
                tasks: ['copy:html'],
                <% } %>
                options: {
                    spawn: false,
                    livereload: true
                },
            },
            style: {
                <% if(data.cssTemplate === 'Sass') { %>
                files: ['src/**/*.scss'],
                tasks: ['sass'],
                <% } else if(data.cssTemplate === 'Less') { %>
                files: ['src/**/*.less'],
                tasks: ['less'],
                <% } else if(data.cssTemplate === 'Stylus') { %>
                files: ['src/**/*.styl'],
                tasks: ['stylus'],
                <% } else {%>
                files: ['src/**/*.css'],
                tasks: ['copy:css'],
                <% } %>
                options: {
                    spawn: false,
                    livereload: true
                },
            },
            scripts: {
                <% if(data.jsTemplate !== 'JS') { %>
                files: ['src/**/*.coffee'],
                tasks: ['coffee'],
                <% } else { %>
                files: ['src/**/*.js'],
                tasks: ['copy:js'],
                <% } %>
                options: {
                    spawn: false,
                    livereload: true
                },
            }
        }
    });

    // Load the tasks
    <% if(data.htmlTemplate === 'Jade') { %>
    grunt.loadNpmTasks('grunt-contrib-jade');
    <% } else if(data.htmlTemplate === 'EJS') { %>
    grunt.loadNpmTasks('grunt-ejs');
    <% } %>

    <% if(data.cssTemplate === 'Sass') { %>
    grunt.loadNpmTasks('grunt-contrib-sass');
    <% } else if(data.cssTemplate === 'Less') { %>
    grunt.loadNpmTasks('grunt-contrib-less');
    <% } else if(data.cssTemplate === 'Stylus') { %>
    grunt.loadNpmTasks('grunt-contrib-stylus');
    <% } %>

    <% if(data.jsTemplate !== 'JS') { %>
    grunt.loadNpmTasks('grunt-contrib-coffee');
    <% } %>

    <% if(data.htmlTemplate === 'HTML' || data.cssTemplate === 'CSS' || data.jsTemplate === 'JS') { %>
    grunt.loadNpmTasks('grunt-contrib-copy');
    <% } %>

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task
    grunt.registerTask('default', [
    <% if(data.htmlTemplate === 'Jade') { %>
    'jade',
    <% } else if(data.htmlTemplate === 'EJS') { %>
    'ejs',
    <% } else { %>
    'copy:html',
    <% } %>
    <% if(data.cssTemplate === 'Sass') { %>
    'sass',
    <% } else if(data.cssTemplate === 'Less') { %>
    'less',
    <% } else if(data.cssTemplate === 'Stylus') { %>
    'stylus',
    <% } else {%>
    'copy:css',
    <% } %>
    <% if(data.jsTemplate !== 'JS') { %>
    'coffee',
    <% } else { %>
    'copy:js',
    <% } %>
    <% if(data.dependencies.length > 0) { %>
    'concat',
    <% } %>
    'express',
    'open',
    'watch'
    ]);
};
