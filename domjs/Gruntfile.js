
module.exports = function(grunt) {
    var root = __dirname + "";
    grunt.log.writeln("Inside domjs");

    grunt.initConfig({
        pkg: grunt.file.readJSON(root + "/package.json"),
        config: grunt.config().domjs,
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
};