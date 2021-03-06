/*
MATLAB Highlighter 1.55, a small and lightweight JavaScript library for colorizing your MATLAB syntax.
http://matlabtricks.com/matlab-highlighter
Licensed under the MIT license
Copyright (c) 2013, Zoltan Fegyver
*/
function highlightMATLABCode(d) {
    function g(i) {
        return (i >= "A" && i <= "Z") || (i >= "a" && i <= "z") || (i == ")")
    }
 
    function m(r, j, i) {
        var s = j.index,
            t;
        while (s >= i) {
            t = r.charAt(--s);
            if (t == "\n") {
                break
            }
            if (t == "'") {
                continue
            } else {
                return !g(t)
            }
        }
        return true
    }
 
    function a(i) {
        var j = i.length - 1,
            r;
        while (j > 0) {
            r = i.charAt(--j);
            if (r == "\n") {
                return true
            }
            if (r == "%") {
                return false
            }
        }
        return true
    }
 
    function n(t) {
        var s, u = 0,
            r, v = /(\'[^\'\n]*\')/gi,
            j = [];
        while (s = v.exec(t)) {
            if (m(t, s, u)) {
                var w = t.slice(u, s.index);
                for (var i = j.length - 2; i >= 0; i -= 2) {
                    if (w.indexOf("\n") > -1) {
                        break
                    }
                    w = w.concat(j[i])
                }
                if (a(w)) {
                    r = s.index + s[1].length;
                    j.push(t.slice(u, s.index));
                    j.push(t.slice(s.index, r));
                    u = r
                }
            }
        }
        j.push(t.slice(u));
        return j
    }
 
    function b(u, j) {
        var w = '<span class="',
            v = "</span>";
        if (j) {
            return [w, 'matlab-string">', u, v].join("")
        } else {
            var t = [{
                r: /\b('|break|case|catch|classdef|continue|else|elseif|end|for|function|global|if|otherwise|parfor|persistent|return|spmd|switch|try|while|')\b/gi,
                s: "keyword"
            }, {
                r: /\b([0-9]+)\b/gi,
                s: "number"
            }, {
                r: /([(){}\[\]]+)/gi,
                s: "bracket"
            }, {
                r: /(%[^\n]*)/gi,
                s: "comment"
            }];
            for (var r = 0, s = t.length; r < s; r++) {
                u = u.replace(t[r].r, [w, "matlab-", t[r].s, '">$1', v].join(""))
            }
            return u
        }
    }
 
    function q(u) {
        var w = [],
            s = [];
        if (typeof u === "undefined") {
            u = {
                tagPre: true,
                tagCode: false,
                className: "matlab-code"
            }
        }
        if (typeof u !== "object") {
            w.push(document.getElementById(u))
        } else {
            if (u.tagCode) {
                s.push("code")
            }
            if (u.tagPre) {
                s.push("pre")
            }
            for (var t = 0; t < s.length; t++) {
                var x = document.getElementsByTagName(s[t]);
                for (var r = 0, v = x.length; r < v; r++) {
                    if ((u.className == "") || ((x[r].className.toString().length > 0) && ((" " + x[r].className + " ").indexOf(" " +
                            u.className + " ") > -1))) {
                        w.push(x[r])
                    }
                }
            }
        }
        return w
    }
    var p = q(d);
    for (var f = 0, o = p.length; f < o; f++) {
        var c = n(p[f].innerHTML.toString().replace(/<br\s*\/?>/mg, "\n")),
            h = [],
            l = "&nbsp;";
        for (var e = 0, k = c.length; e < k; e++) {
            h.push(b(c[e], e % 2))
        }
        p[f].innerHTML = h.join("").replace(/^[ ]/gm, l).replace(/\n/gm, "<br>").replace(/\t/gm, l + l)
    }
};