
module.exports = function(grunt) {
    var root = __dirname + "";
    grunt.log.writeln("Inside domjs... ");

    if(grunt.config()["build-domjs"] && grunt.config()["build-domjs"].rootdir)
        root = grunt.config()["build-domjs"].rootdir;

    grunt.initConfig({
        pkg: grunt.file.readJSON(root + "/package.json"),
        rootdir: root,
        "build-domjs": {
            all: {
                dest: root + "/dist/domjs<%=pkg.version%>.js"
            }
        },
        karma: {
            "domjs-unit": {
                configFile: root + '/build/conf/karma.conf.js'
            }
        }
    });

    require("load-grunt-tasks")(grunt);
    grunt.loadNpmTasks("grunt-karma");

    grunt.loadTasks(root + "/build/tasks");
    if(root === ".") {
        grunt.registerTask("default", [
            "build-domjs:*:*",
            "karma"
        ]);
    }
};