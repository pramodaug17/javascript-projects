(function (global) {
    function Selector(query, context, results) {
        var rtag = /(?:(^<)([a-zA-Z]+)(>)(?:\1\/\2\3$)?)/,
            // http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",

            // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            tic = "^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$",
            matches,
            elems, rtic = RegExp(tic),
            windowDoc = window.document,
            arr,
            slice = ([]).slice,
            push = ([]).push;

        try {
            push.apply(
                (arr = slice.call( windowDoc.childNodes )),
                windowDoc.childNodes
            );
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[ windowDoc.childNodes.length ].nodeType;
        } catch ( e ) {
            push = {
                apply: ([]).length ?
                    function (target, els) {
                        ([]).push.apply(target, slice.call(els));
                    } :
                    function (target, els) {
                        var j = target.length,
                            i = 0;
                        // Can't trust NodeList.length
                        while ((target[j++] = els[i++])) {
                        }
                        target.length = j - 1;
                    }
            };
        }
        /*
            tagname = "([\\w]+)",
            id = "(#[a-zA-Z][\\w-:\\.]+[\\w])",
            className = "(\\.[a-zA-Z][\\w-]+)",
            attrib = "(?:\\[([a-zA-z][\\w-]+)((?:[~\\|\\^\\$\\*]|)=)(([\"']|)[\\w\\s]+(\\4))\\])",
            pseudo = "((?::[:]|)\\w+)"*/

        results = results || [];
        context = context || windowDoc;

        // Check query is = <tag> or <tag></tag>
        if((matches = rtag.exec(query)) && matches[2]) {
            // Pure tag in query
            elems = document.getElementsByTagName(matches[2]);

            push.apply(results, elems);
            return results;
        }

        //check query for tag, id or class name
        if((matches = rtic.exec(query)) ) {
            if(matches[1]) {
                // Get element by ID
                elems = [];
                elems.push(document.getElementById(matches[1]));
                push.apply(results, elems);
                //results.push(elems);
            }
            else if(matches[2]) {
                // Get element by tag name
                elems = document.getElementsByTagName(matches[2]);
                push.apply(results, elems);
            }
            else if(matches[3]) {
                // Get element by class name
                elems = document.getElementsByClassName(matches[3]);
                push.apply(results, elems);
            }
            return results;
        }

        // Now use query selector
        elems = context.querySelectorAll(query);
        push.apply(results, elems);

        return results;
    }
    global.domselector = Selector;
})(window);