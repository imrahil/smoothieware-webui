module.exports = function(grunt) {
    grunt.initConfig({
        'nggettext_extract': {
            pot: {
                options: {
                    extensions: {
                        htm: 'html',
                        html: 'html',
                        php: 'html',
                        phtml: 'html',
                        tml: 'html',
                        aspx: 'html',
                        js: 'js'
                    },
                },
                files: {
                    'lang/template.pot': [
                            '**/*.html',
                            '**/*.aspx',
                            '**/langkeys.js' ]
                }
            }
        },
        'nggettext_compile': {
            all: {
                files: {
                    'js/translations.js': ['lang/*.po']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-angular-gettext');

    grunt.registerTask('extract', ['nggettext_extract']);
    grunt.registerTask('compile', ['nggettext_compile']);
};