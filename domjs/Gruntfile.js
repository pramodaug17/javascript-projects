
module.exports = function(grunt) {

    grunt.log.writeln("Inside domjs");

    grunt.initConfig({
        pkg: grunt.file.readJSON("domjs/package.json"),
        config: grunt.config().domjs,
        "build-domjs": {
            all: {
                dest: "domjs/dist/domjs<%=pkg.version%>.js"
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadTasks("domjs/build/tasks");
};