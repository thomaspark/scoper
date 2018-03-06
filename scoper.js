/* global exports */

function scoperInit() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  style.sheet.insertRule("body { visibility: hidden; }", 0);
}

function scoper(css, prefix) {
  var re = new RegExp("([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)", "g");
  css = css.replace(re, function(g0, g1, g2) {

    if (g1.match(/^\s*(@media|@.*keyframes|to|from|@font-face|1?[0-9]?[0-9])/)) {
      return g1 + g2;
    }

    if (g1.match(/:scope/)) {
      g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
        if (h1 === "") {
          return "> *";
        } else {
          return "> " + h1;
        }
      });
    }

    g1 = g1.replace(/^(\s*)/, "$1" + prefix + " ");

    return g1 + g2;
  });
  
  return css;
}

function scoperProcess() {
  var styles = document.body.querySelectorAll("style[scoped]");

  if (styles.length === 0) {
    document.getElementsByTagName("body")[0].style.visibility = "visible";
    return;
  }

  var head = document.head || document.getElementsByTagName("head")[0];

  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    var css = style.innerHTML;

    if (css && (style.parentElement.nodeName !== "BODY")) {
      var id = "scoper-" + i;
      var prefix = "#" + id;

      var wrapper = document.createElement("span");
      wrapper.id = id;

      var parent = style.parentNode;
      var grandparent = parent.parentNode;

      grandparent.replaceChild(wrapper, parent);
      wrapper.appendChild(parent);
      style.parentNode.removeChild(style);

      var newstyle = document.createElement("style");
      newstyle.setAttribute('data-scoped-style-for', id);
      var csses = scoper(css, prefix);
      if (newstyle.styleSheet){
          newstyle.styleSheet.cssText = csses;
      } else {
          newstyle.appendChild(document.createTextNode(csses));
      }

      head.appendChild(newstyle);
    }
  }

  document.getElementsByTagName("body")[0].style.visibility = "visible";
}

function scoperReset() {
  var styles = document.head.querySelectorAll("style[data-scoped-style-for]");
  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    var wrapperElementId = style.getAttribute('data-scoped-style-for');
    var wrapperEl = document.getElementById(wrapperElementId);
    if(wrapperEl) { // Node may have disappeared, in that case nothing should happen
      var css = style.innerHTML;
      var resettedCss = css.replace("#"+wrapperElementId+" ", "");

      var parent = wrapperEl.parentNode;
      var targetEl = wrapperEl.childNodes[0];

      parent.replaceChild(targetEl, wrapperEl);
      var scopedStyle = document.createElement("style");
      scopedStyle.setAttribute("scoped", "true");
      if (scopedStyle.styleSheet){
        scopedStyle.styleSheet.cssText = resettedCss;
      } else {
        scopedStyle.appendChild(document.createTextNode(resettedCss));
      }
      targetEl.appendChild(scopedStyle);
    }

    style.parentNode.removeChild(style);
  }
}

function scoperRestart() {
  scoperReset();
  scoperProcess();
}

(function() {
  "use strict";

  if (typeof document === "undefined" || ("scoped" in document.createElement("style"))) {
    return;
  }
  
  scoperInit();

  if (document.readyState === "complete" || document.readyState === "loaded") {
    scoperProcess();
  } else {
    document.addEventListener("DOMContentLoaded", scoperProcess);
  }
}());

if (typeof exports !== "undefined") {
  exports.scoper = scoper;
}
