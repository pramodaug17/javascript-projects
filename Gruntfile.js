
module.exports = function(grunt) {

    grunt.initConfig({
        //pkg: grunt.file.readJSON("package.json")
        "build-domjs": {
            rootdir: "domjs"
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadTasks("domjs");

    grunt.registerTask("default", [
        "build-domjs:*:*"
     ]);

    grunt.registerTask("domjs", [
        "build-domjs:*:*",
        "karma:domjs-unit:*"
    ]);
};

