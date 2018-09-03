(function(global) {
    global.events = (function() {
        var evtlist = {},
            defaultopt = {
                "bindobj": null
            };

        function isFnSame(fn1, fn2) {
            /* TODO: Add check of function definition only */
            return (fn1 === fn2) ||
                (fn1.toString().replace(/\s/gm, '') ===
                    fn2.toString().replace(/\s/gm, ''));
        }

        function createCbProperty(opt) {
            var prop = {};

            for (k in defaultopt) {
                if (opt && k in opt)
                    prop[k] = opt[k];
            }

            return prop;
        }

        function subscribe(evt, cb, option) {
            /* Check if event is registered or not */
            if (!evtlist[evt]) {
                throw ("'" + evt + "' event is not registered!!");
            }
            /* check for occurrence */
            for (let i = 0; i < evtlist[evt].fn.length; i++) {
                if (isFnSame(cb, evtlist[evt].fn[i])) {
                    /* Already present in list */
                    return;
                }
            }

            cb.props = createCbProperty(option);
            evtlist[evt].fn.push(cb);
        }

        function unsubscribe(evt, cb) {
            if (evtlist[evt]) {
                for (let i = 0; i < evtlist[evt].fn.length; i++) {
                    if (isFnSame(cb, evtlist[evt].fn[i])) {
                        evtlist[evt].fn.splice(i, 1);
                        break;
                    }
                }
            }
        }

        function publish(evt) {
            var args = [];

            for (let i = 1; i < arguments.length; i++)
                args.push(arguments[i]);

            if (evtlist[evt]) {
                evtlist[evt].fn.forEach(function(cb) {
                    let obj = cb.props.bindobj || global;
                    setTimeout(function() {
                        cb.apply(obj, args);
                    }, 1);
                });
            }
        }

        /*
         * data is decription of parameter of callback function
         */
        function register(eventName, data) {
            evtlist[eventName] = evtlist[eventName] || {};
            evtlist[eventName].fn = evtlist[eventName].fn || [];
            evtlist[eventName].data = data || evtlist[eventName].data || {};
        }

        return {
            on: subscribe,
            off: unsubscribe,
            emit: publish,
            registerEvent: register
        };
    })();
})(window);

