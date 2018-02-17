
module.exports = function(grunt) {

    grunt.initConfig({
        //pkg: grunt.file.readJSON("package.json")
        build: {
            somedata: "Passed from root"
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadTasks("domjs");

    grunt.registerTask("default", [
         "build:*:*"
     ]);

//    grunt.registerTask("default", function(){
//        grunt.loadTasks("domjs");
//    });

//    grunt.registerTask("domjs", function(){
//        grunt.loadTasks("domjs");
//    });
};

