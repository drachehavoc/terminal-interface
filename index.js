"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
process.stdin.setRawMode(true);
process.stdin.resume();
// -----------------------------------------------------------------------
var xheadless = require("@xterm/headless");
var pty = require("node-pty");
var cols = 50;
var rows = 20;
var proc = pty.spawn('nano', ['/tmp/teste.txt'], {
    name: 'xterm-256color',
    cols: cols,
    rows: rows,
    env: __assign(__assign({}, process.env), { TERM: 'xterm-256color' })
});
var term = new xheadless.Terminal({
    allowProposedApi: true,
    cols: cols,
    rows: rows,
});
// -----------------------------------------------------------------------
proc.onData(function (data) {
    term.write(data);
});
function render() {
    for (var lineNo = 0; lineNo < rows; lineNo++) {
        var line = term.buffer.active.getLine(lineNo);
        console.log('-->', line);
    }
}
console.log('Iniciou. Pressione Ctrl+C para sair.');
