module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "concat": {
            merge: {
                src: ['src/util/EventDispatcher.ts', 'src/Listener.ts', 'src/interfaces/DefaultListener.ts', 'src/util/LeapEvent.ts', 'src/util/LeapUtil.ts', 'src/Controller.ts', 'src/InteractionBox.ts', 'src/Pointable.ts', 'src/Gesture.ts', 'src/Finger.ts', 'src/Tool.ts', 'src/Hand.ts', 'src/Frame.ts', 'src/Matrix.ts', 'src/CircleGesture.ts', 'src/KeyTapGesture.ts', 'src/ScreenTapGesture.ts', 'src/SwipeGesture.ts', 'src/Vector3.ts'],
                dest: 'build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'
            }
        },
        "sed": {
            reference: {
                path: 'build/',
                pattern: '\/\/\/.*\n',
                replacement: '',
                recursive: true
            }
        },
        "typescript": {
            base: {
                src: ['build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'],
                dest: '',
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    fullSourceMapPath: false,
                    declaration: true
                }
            }
        },
        "jsbeautifier": {
            files: ['build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.js'],
            options: {
                indent_size: 4,
                indent_char: ' ',
                indent_level: 0,
                indent_with_tabs: false,
                preserve_newlines: true,
                max_preserve_newlines: 10,
                jslint_happy: true,
                brace_style: 'collapse',
                keep_array_indentation: false,
                keep_function_indentation: false,
                space_before_conditional: true,
                break_chained_methods: false,
                eval_code: false,
                wrap_line_length: 0,
                unescape_strings: false
            }
        },
        "uglify": {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.min.js': ['build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat:merge', 'sed', 'typescript', 'jsbeautifier', 'uglify']);
};