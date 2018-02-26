
module.exports = function(grunt) {
    var //fs = require( "fs" ),
        requirejs = require( "requirejs" ),
        root = grunt.config().rootdir,
        //Insight = require( "insight" ),
        //pkg = require( "../../package.json" ),
        srcFolder = __dirname + "/../../src/",
        rdefineEnd = /}\s*?\);[^}\w]*$/,
        readf = function( fileName ) {
            return grunt.file.read( srcFolder + fileName );
        },

        // Catch `// @CODE` and subsequent comment lines event if they don't start
        // in the first column.
        wrapper = readf( "main.js" ).split( /[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/ ),

        config = {
            baseUrl: root + "/src",
            name: "domjs",

            // Allow strict mode
            useStrict: true,

            // We have multiple minify steps
            optimize: "none",

            // Include dependencies loaded with require
            findNestedDependencies: true,

            // Avoid inserting define() placeholder
            skipModuleInsertion: true,

            // Avoid breaking semicolons inserted by r.js
            skipSemiColonInsertion: true,
            wrap: {
                start: wrapper[ 0 ].replace( /\/\*\s*eslint(?: |-).*\s*\*\/\n/, "" ),
                end: wrapper[ 1 ]
            },
            rawText: {},
            onBuildWrite: convert
        };

    grunt.registerMultiTask(
        "build-domjs",
        "This task description",
    function() {
        var done = this.async(),
            flags = this.flags,
            optIn = flags[ "*" ],
            name = grunt.option( "filename" ),
            excluded = [],
            included = [],
            version = grunt.config( "pkg.version" ),



        // Filename can be passed to the command line using
        // command line options
        // e.g. grunt build --filename=jquery-custom.js
        name = name ? ( "dist/" + name ) : this.data.dest;

        grunt.verbose.writeflags( excluded, "Excluded-" );
        grunt.verbose.writeflags( included, "Included-" );

        config.include = included;

        /**
         * Handle Final output from the optimizer
         * @param {String} compiled
         */
        config.out = function( compiled ) {
            compiled = compiled

            // Embed Version
                .replace( /@VERSION/g, version )

                // Embed Date
                // yyyy-mm-ddThh:mmZ
                .replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

            // Write concatenated source to file
            grunt.file.write( name, compiled );
        };

        // Turn off opt-in if necessary
        if ( !optIn ) {

            // Overwrite the default inclusions with the explicit ones provided
            config.rawText.domjs = "define([" +
                ( included.length ? included.join( "," ) : "" ) +
                "]);";
        }
        // Trace dependencies and concatenate files
        requirejs.optimize( config, function( response ) {
            grunt.log.ok( "File '" + name + "' created." );
            done();
        }, function( err ) {
            done( err );
        } );
    }
    );


    function convert( name, path, contents ) {
        var amdName;

        // Convert var modules
        if ( /.\/var\//.test( path.replace( process.cwd(), "" ) ) ) {
            contents = contents
                .replace(
                    /define\([\w\W]*?return/,
                    "var " +
                    ( /var\/([\w-]+)/.exec( name )[ 1 ] ) +
                    " ="
                )
                .replace( rdefineEnd, "" );

            // Sizzle treatment
        } else {

            contents = contents
                .replace( /\s*return\s+[^\}]+(\}\s*?\);[^\w\}]*)$/, "$1" )

                // Multiple exports
                .replace( /\s*exports\.\w+\s*=\s*\w+;/g, "" );

            // Remove define wrappers, closure ends, and empty declarations
            contents = contents
                .replace( /define\([^{]*?{\s*(?:("|')use strict\1(?:;|))?/, "" )
                .replace( rdefineEnd, "" );

            // Remove anything wrapped with
            // /* ExcludeStart */ /* ExcludeEnd */
            // or a single line directly after a // BuildExclude comment
            contents = contents
                .replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "" )
                .replace( /\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "" );

            // Remove empty definitions
            contents = contents
                .replace( /define\(\[[^\]]*\]\)[\W\n]+$/, "" );
        }

        // AMD Name
        if ( ( amdName = grunt.option( "amd" ) ) != null && /^exports\/amd$/.test( name ) ) {
            if ( amdName ) {
                grunt.log.writeln( "Naming jQuery with AMD name: " + amdName );
            } else {
                grunt.log.writeln( "AMD name now anonymous" );
            }

            // Remove the comma for anonymous defines
            contents = contents
                .replace( /(\s*)"domjs"(\,\s*)/, amdName ? "$1\"" + amdName + "\"$2" : "" );

        }
        return contents;
    }
};