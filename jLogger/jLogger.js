/*
 * Logger module
 * TODO: Add filter feature in logger
 */
(function(global) {
    global.$log = (function() {
        var idlogger = "plogger";
        var idstarttime = "start_time";
        var tabid = "log_anchor";
        var bufid = "logs_holder";
        var buf = null;
        var bufbeforeload = [];
        var islogenabled = false;
        var initialized = false;
        var windiv = null;

        function createDiv() {
            return document.createElement("div");
        }

        function createLoggerWindow() {
            let ldiv = createDiv();

            ldiv.className = "log-window";
            /* TODO: add option to first view as minimized */

            ldiv.innerHTML = '<div class="log-tab" id="log_anchor">Log</div>';
            ldiv.innerHTML += '<div class="log-div-title"> \
                            =======| Lite logger, started on \
                            <span id="start_time"></span> |======= \
                            </div>';
            ldiv.innerHTML += '<div class="log-container"> \
                            <div class="log-entry-list" id="logs_holder"> \
                            </div></div>';

            return ldiv;
        }

        function on(event, ele, cb, usecapture) {
            usecapture = usecapture || false;
            try {
                if (ele.addEventListener) {
                    ele.addEventListener(event, cb, usecapture); //W3C
                } else {
                    ele.attachEvent('on' + event, cb); //IE
                }
            } catch (e) {}
        }

        function tabclicked() {
            /* Toggle display of Log window */
            let classes = this.parentNode.className.split(' ');
            if (-1 === classes.indexOf('hide')) {
                this.parentNode.className += ' hide';
            } else {
                classes.splice(classes.indexOf('hide'), 1);
                this.parentNode.className = classes.join(' ');
            }
        }

        function initTab() {
            let tab = document.getElementById(tabid);
            on("click", tab, tabclicked);
        }

        function getDay(dt) {
            let days = [
                "Sunday",
                "Monday",
                "Tueday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];

            return days[dt.getDay()]
        }

        function getDate(dt) {
            let months = [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ];
            let date = ("0" + dt.getDate()).slice(-2);

            return (months[dt.getMonth()] + " " + date + ", " + dt.getFullYear());
        }

        function getDaynDate(dt) {
            return (getDay(dt) + ", " + getDate(dt));
        }

        function getTime(dt) {
            let hr = "0" + dt.getHours();
            let min = "0" + dt.getMinutes();
            let sec = "0" + dt.getSeconds();

            return (hr.slice(-2) + ":" + min.slice(-2) + ":" + sec.slice(-2));
        }

        function insertStartTime() {
            let now = new Date();
            document.getElementById(idstarttime).innerText = getDate(now) + " "
                + getTime(now);
        }

        function initrest() {
            /* register logger event */
            if (global.events) {
                events.registerEvent("log error");
                events.on("log error", function(str) {
                    error_log(str);
                });

                events.registerEvent("log info");
                events.on("log info", function(str) {
                    info_log(str);
                });

                events.registerEvent("log debug");
                events.on("log debug", function(str) {
                    debug_log(str);
                });
            }

            /* Add event click event listener to open and close log window */
            initTab();

            /* Insert logging start time */
            insertStartTime();

            /* Get Log buffer div */
            buf = document.getElementById(bufid);

            initialized = true;

            /* Insert buffer which is before page load */
            bufbeforeload.forEach(function(div) {
                insertlog(div);
            });

            /* TODO: custom scrollbar needs to add */
	    function scrollLogPage(e) {
                // get the old value of the translation (there has to be an easier way than this)
                var oldVal = parseInt(buf.style['margin-top']);

                // to make it work on IE or Chrome. double the variation
                var variation = parseInt(e.deltaY) * 2;

                /* to stop bubbling effect */
                event.stopPropagation();
                /* update the body translation to simulate a scroll */
                if (variation > 0) { /* For scroll down */
                    if (oldVal <= (this.clientHeight - buf.clientHeight)) {
                        buf.style['margin-top'] = "" + (this.clientHeight - buf.clientHeight) + "px";
                        return false;
                    }
                } else if (variation < 0) { /* For scroll up */
                    if (oldVal >= 0) {
                        buf.style['margin-top'] = "0px";
                        return false;
                    }
                } else {
                    return false;
                }
                //debug_log("translateY(" + (oldVal - variation) + "px");
                buf.style['margin-top'] = "" + (oldVal - variation) + "px";

                return false;
            }

	    /* Register scroll event */
	    on("scroll", buf, function(e) {
		scrollLogPage(e);
	    }, false);
            on("wheel", buf, function(e) {
		e.stopPropagation();
		return false;
            }, false);
        }

        function initonload() {
            document.body.appendChild(windiv);
            initrest();
        }

        function init_logger(opt) {
            opt = opt || {};
            windiv = document.getElementById(idlogger);
            if (!windiv) {
                windiv = createLoggerWindow();
                try {
                    islogenabled = true;

                    document.body.appendChild(windiv);
                    initrest();
                } catch (e) {
                    on("load", window, initonload);
                    return;
                }
            } else {
                console.log("Logger is not initialize!!");
                return;
            }
        }

        function getEntryDiv(now, logstr) {
            let div = createDiv();
            let entry = "";

            entry += '<span class="log-time">' + getTime(now) + '</span>';
            entry += '<span class="log-text">' + logstr + '</span>';

            div.innerHTML = entry;
            return div;
        }

        function insertlog(log) {
            if (initialized) {
                buf.appendChild(log);

                /* scroll to bottom */
                buf.style['margin-top'] = (buf.parentNode.clientHeight < buf.clientHeight) ?
                    (buf.parentNode.clientHeight - buf.clientHeight) + "px" :
                    "0";
            } else {
                bufbeforeload.push(log);
            }
        }

        function error_log(logstr) {
            if (!islogenabled)
                return;
            let entrydiv = getEntryDiv((new Date), logstr);
            entrydiv.className = "log-entry log-error";

            insertlog(entrydiv);
        }

        function info_log(logstr) {
            if (!islogenabled)
                return;
            let entrydiv = getEntryDiv((new Date), logstr);
            entrydiv.className = "log-entry log-info";

            insertlog(entrydiv);
        }

        function debug_log(logstr) {
            if (!islogenabled)
                return;
            let entrydiv = getEntryDiv((new Date), logstr);
            entrydiv.className = "log-entry log-debug";

            insertlog(entrydiv);
        }

        function enable_log() {
            islogenabled = true;
        }

        function disable_log() {
            islogenabled = false;
        }

        return {
            init: init_logger,
            error: error_log,
            info: info_log,
            debug: debug_log,
            enable: enable_log,
            disable: disable_log
        }
    })();
})(window);

$log.init();
for(let i = 11; i ; i--) {
    if(0 === (i % 3))
        $log.info("This is info log == " + i);
    if(1 === (i % 3))
        $log.debug("This is debug log == " + i);
    if(2 === (i % 3))
        $log.error("This is error log == " + i);
}
