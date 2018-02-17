
module.exports = function(grunt) {

    grunt.initConfig({
        //pkg: grunt.file.readJSON("package.json")
        "build-domjs": {
            somedata: "Passed from root"
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadTasks("domjs");

    grunt.registerTask("default", [
         "build-domjs:*:*"
     ]);

    grunt.registerTask("domjs", [
        "build-domjs:*:*"
    ]);
};

