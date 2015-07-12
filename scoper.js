(function() {
  var styles = document.querySelectorAll("style[scoped]");

  if ((styles.length === 0) || ("scoped" in document.createElement("style"))) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var newstyle = document.createElement('style');
  var csses = "";

  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    var css = style.innerHTML;

    if (css) {
      var id = "scoper-" + i;
      var selector = "#" + id;

      var wrapper = document.createElement("span");
      wrapper.id = id;

      var parent = style.parentNode;
      var grandparent = parent.parentNode;

      grandparent.replaceChild(wrapper, parent);
      wrapper.appendChild(parent);
      style.remove();

      newcss = scoper(selector, css);
      csses = csses + newcss;
    }
  }

  if (newstyle.styleSheet){
    newstyle.styleSheet.cssText = csses;
  } else {
    newstyle.appendChild(document.createTextNode(csses));
  }

  head.appendChild(newstyle);
}());


function scoper(selector, css) {
  css = css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, selector + " $1$2");
  css = "\n" + css;
  
  return css;
}
