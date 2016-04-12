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
                    'www/lang/template.pot': [
                            'www/**/*.html'
                    ]
                }
            }
        },
        'nggettext_compile': {
            all: {
                files: {
                    'www/js/translations.js': ['www/lang/*.po']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-angular-gettext');

    grunt.registerTask('extract', ['nggettext_extract']);
    grunt.registerTask('compile', ['nggettext_compile']);

    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);
};