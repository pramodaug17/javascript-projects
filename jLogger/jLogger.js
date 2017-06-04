
(function(obj, undefined) {
    window.logger = window.logger || jLogger();
    var isLoggerOn = false;
    var logBox = null;
    var hideRegex = new RegExp("hide");

    function createLogBox() {

    }

    function initLoggerSection(opts) {
        /* Find log box. If not found then created new */
        if ( document.getElementById("logBox") === null ) {
            logBox = document.createElement("div");
            logBox.id = "logBox";
            logBox.className = "logBox hide";

            document.body.appendChild(logBox);
        } else {
            logBox = document.getElementById("logBox");
        }
    }
    window.onload = initLoggerSection;


    function toggleLogboxDisplay() {
        var className = logBox !== null ? logBox.className : "" ;

        if( "" === className )
            return;

        if( -1 !== className.search( hideRegex ) ) {
            showLogBox();
        }
        else {
            hideLogBox();
        }
    }
    function showLogBox() {
        var className = logBox !== typeof "undefined" ? logBox.className : "" ;

        if( "" === className )
            return;

        if( -1 !== className.search( hideRegex ) ) {
            var arr = (className.replace( hideRegex, "" )).split(" ");
            while( -1 !== arr.indexOf("")) {
                arr.splice((arr.indexOf("")), 1);
            }
            className = arr.join(' ');
            logBox.className = className;
        }
    }
    function hideLogBox() {
        var className = logBox !== typeof "undefined" ? logBox.className : "" ;

        if( "" === className )
            return;

        if( -1 === className.search( hideRegex ) ) {
            className += " hide";
            logBox.className = className;
        }
    }

    function toggleLogBox(value) {
        if( typeof value == "undefined")
            toggleLogboxDisplay();
        else if( value )
            showLogBox();
        else
            hideLogBox();

    }
    function enableLogger(value) {
        isLoggerOn = value;
    }
    function printCritical(msg) {
        if( !isLoggerOn)
            return;
        alert(msg);
    }
    function printError(msg) {
        if( !isLoggerOn)
            return;
        if( console ) {
            console.error(msg)
        }
        else {
            alert(msg);
        }
    }
    function printWarn(msg) {
        if( !isLoggerOn)
            return;
        if( console ) {
            console.warn(msg)
        }
        else {
            alert(msg);
        }
    }
    function printInfo(msg) {
        if( !isLoggerOn)
            return;
        if( console ) {
            console.info(msg)
        }
        else {
            alert(msg);
        }
    }
    function printDebug(msg) {
        if( !isLoggerOn)
            return;
        if( console ) {
            console.debug( msg );
        }
        else {
            alert(msg);
        }
    }

    function jLogger() {
        return {
            toggle: function(value) {
                toggleLogBox(value);
            },
            enable: function(value) {
                enableLogger(value);
            },
            critical : function(text) {
                printCritical(text);
            },
            error : function(text) {
                printError(text);
            },
            warn: function(text) {
                printWarn(text);
            },
            info : function(text) {
                printInfo(text);
            },
            debug : function(text) {
                printDebug(text);
            }
        }
    }
})(this);


logger.critical("Critical not print");
logger.error("Error not print");
logger.warn("Warning not print");
logger.info("Info not print");
logger.debug("Debug not print");

logger.enable(true);
logger.critical("Critical print");
logger.error("Error print");
logger.warn("Warning print");
logger.info("Info print");
logger.debug("Debug print");