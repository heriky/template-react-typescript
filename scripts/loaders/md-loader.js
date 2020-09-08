const marked = require('marked');
const hljs = require('highlight.js');
// const js = require('highlight.js/lib/languages/javascript');

// hljs.registerLanguage('javascript', js);

module.exports = function (source) {
    this.cacheable(false);
    marked.setOptions({
        // gfm: true,
        highlight(code) {
            return hljs.highlightAuto(code).value;
        },
    });
    return marked(source);
};
