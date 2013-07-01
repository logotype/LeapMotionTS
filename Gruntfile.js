module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/util/EventDispatcher.ts', 'src/Listener.ts', 'src/interfaces/DefaultListener.ts', 'src/util/LeapEvent.ts', 'src/util/LeapUtil.ts', 'src/Controller.ts', 'src/InteractionBox.ts', 'src/Pointable.ts', 'src/Gesture.ts', 'src/Finger.ts', 'src/Tool.ts', 'src/Hand.ts', 'src/Frame.ts', 'src/Matrix.ts', 'src/CircleGesture.ts', 'src/KeyTapGesture.ts', 'src/ScreenTapGesture.ts', 'src/SwipeGesture.ts', 'src/Vector3.ts'],
                dest: 'build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'
            }
        },
        sed: {
            reference: {
                path: 'build/',
                pattern: '\/\/\/.*\n',
                replacement: '',
                recursive: true
            },
            class: {
                path: 'build/',
                pattern: '\nclass ',
                replacement: '\nexport class ',
                recursive: true
            },
            module: {
                path: 'build/',
                pattern: '\ninterface ',
                replacement: '\nexport interface ',
                recursive: true
            },
            enum: {
                path: 'build/',
                pattern: '\nenum ',
                replacement: '\nexport enum ',
                recursive: true
            }
        },
        typescript: {
            base: {
                src: ['build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'],
                dest: '',
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: true,
                }
            }
        },
        uglify: {
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

    // Combine modules
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Make module/interface/enum external...
    grunt.loadNpmTasks('grunt-sed');

    // Load TypeScript compiler
    grunt.loadNpmTasks('grunt-typescript');

    // Load UglifyJS
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'sed', 'typescript', 'uglify']);
};