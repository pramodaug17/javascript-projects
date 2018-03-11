(function (global) {
    function Selector(query) {
        var rtag = /(?:(^<)([a-zA-Z]+)(>)(?:\1\/\2\3$)?)/,
            tag,
            elems,
            tagname = "([\\w]+)",
            id = "(#[a-zA-Z][\\w-:\\.]+[\\w])",
            className = "(\\.[a-zA-Z][\\w-]+)",
            attrib = "(?:\\[([a-zA-z][\\w-]+)((?:[~\\|\\^\\$\\*]|)=)(([\"']|)[\\w\\s]+(\\4))\\])",
            pseudo = "((?::[:]|)\\w+)";

        // Check query is = <tag> or <tag></tag>
        if((tag = rtag.exec(query)) && tag[2]) {
            // Pure tag in query
            elems = document.getElementsByTagName(tag[2]);
            return elems;
        }

        elems = document.getElementsByTagName(tag);
        return elems
    }
    global.domselector = Selector;
})(window);