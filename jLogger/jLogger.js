
(function(obj, undefined) {
    window.logger = window.logger || jLogger();
    var isLoggerOn = false;
    var onconsolealso = false;
    var logBox = null;
    var hideRegex = new RegExp("hide");
    var logBeforeLoad = [];

    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };

    function createLogBox() {
        var container = document.createElement("div");
        var div = document.createElement("div");

        div.id = "logBox";
        div.className = "logBox";

        container.className = 'log-container';
        container.appendChild(div);

        return div;
    }

    function createLogLine() {
        var div = document.createElement("div");
        var time = document.createElement("span");
        var msg = document.createElement("span");

        time.className = "time";
        msg.className = "log-text";

        div.appendChild(time);
        div.appendChild(msg);

        return div;
    }

    function printonconsole(type, msg) {
        if( onconsolealso && console && ('error' === type || 'critical' === type)) {
            console.error(msg);
        }
        else if( onconsolealso && console && 'warn' === type) {
            console.warn(msg);
        }
        else if( onconsolealso && console && 'info' === type) {
            console.info(msg);
        }
        else if( onconsolealso && console && 'debug' === type) {
            console.debug(msg);
        }
    }

    function addLogLine(logline){
        if(null === logBox) {
            logBeforeLoad.push(logline);
        }
        else {
            // logBox.insertBefore(logline, logBox.firstChild);
            logBox.appendChild(logline);
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    function initLoggerSection(opts) {
        /* Find log box. If not found then created new */
        if ( (logBox = document.getElementById("logBox")) === null ) {
            logBox = createLogBox();
            document.body.appendChild(logBox);
        }
        isLoggerOn = true;

        while(logBeforeLoad.length) {
            addLogLine(logBeforeLoad.shift());
        }
    }
    window.onload = initLoggerSection;/*
    initLoggerSection();
*/
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
        if( typeof value === "undefined")
            toggleLogboxDisplay();
        else if( value )
            showLogBox();
        else
            hideLogBox();
    }

    function enableLogger(value) {
        isLoggerOn = value;
    }

    function enableconsole(value) {
        onconsolealso = value;
    }

    function printCritical(msg) {
        if( !isLoggerOn)
            return;
        var logline = createLogLine();
        var time = new Date();

        printonconsole('critical', msg);

        logline.className = "critical";
        logline.children[0].innerHTML = time.getHours().pad() + ":" +
            time.getMinutes().pad() + ":" + time.getSeconds().pad();
        logline.children[1].innerHTML = msg;

        addLogLine(logline);
    }

    function printError(msg) {
        if( !isLoggerOn)
            return;

        var logline = createLogLine();
        var time = new Date();

        printonconsole('error', msg);

        logline.className = "error";
        logline.children[0].innerHTML = time.getHours().pad() + ":" +
            time.getMinutes().pad() + ":" + time.getSeconds().pad();
        logline.children[1].innerHTML = msg;

        addLogLine(logline);
    }
    function printWarn(msg) {
        if( !isLoggerOn)
            return;
        printonconsole('warn', msg);

        var logline = createLogLine();
        var time = new Date();

        logline.className = "warn";
        logline.children[0].innerHTML = time.getHours().pad() + ":" +
            time.getMinutes().pad() + ":" + time.getSeconds().pad();
        logline.children[1].innerHTML = msg;

        addLogLine(logline);

    }
    function printInfo(msg) {
        if( !isLoggerOn)
            return;

        printonconsole('info', msg);

        var logline = createLogLine();
        var time = new Date();

        logline.className = "info";
        logline.children[0].innerHTML = time.getHours().pad() + ":" +
            time.getMinutes().pad() + ":" + time.getSeconds().pad();
        logline.children[1].innerHTML = msg;

        addLogLine(logline);
    }
    function printDebug(msg) {
        if( !isLoggerOn)
            return;

        printonconsole('debug', msg);

        var logline = createLogLine();
        var time = new Date();

        logline.className = "debug";
        logline.children[0].innerHTML = time.getHours().pad() + ":" +
            time.getMinutes().pad() + ":" + time.getSeconds().pad();
        logline.children[1].innerHTML = msg;

        addLogLine(logline);
    }

    function jLogger() {
        return {
            toggle: function(value) {
                toggleLogBox(value);
            },
            enable: function(value) {
                enableLogger(value);
            },
            enableonconsole: function (value) {
                enableconsole(value);
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

/*
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
logger.debug("Debug print");*/