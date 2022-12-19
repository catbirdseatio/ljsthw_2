const $get = (name, inChildren) => {
  if(inChildren) {
    return inChildren.querySelector(name);
  } else {
    return document.querySelector(name);
  }
}

const $all = (name, inChildren) => {
  if(inChildren) {
    return inChildren.querySelectorAll(name);
  } else {
    return document.querySelectorAll(name);
  }
}

const $id = (name, inChildren) => {
  if(inChildren) {
    return inChildren.children.namedItem(name);
  } else {
    return document.getElementById(name);
  }
}

const $class = (name) => {
  return document.getElementsByClassName(name);
}

const $name = (name) => {
  return document.getElementsByTagName(name);
}

const $filter = (nodes, fn) => {
  return Array.prototype.filter.call(nodes, fn);
}

const $next = (node) => {
  return node.nextElementSibling;
}

const $previous = (node) => {
  return node.previousElementSibling;
}

const $siblings = (node) => {
  return $filter(node.parentNode.children, (child) => {
    return child !== node;
  });
}

const $style = (...args) => {
  for(let val of args) {
    if(val[0].length === undefined) {
      val[0].className = val[1];
    } else {
      for(let element of val[0]) {
        element.className = val[1];
      }
    }
  }
}

const $toggle = (node, className) => {
  node.classList.toggle(className);
}

const $new = (tag, id, html) => {
  let new_tag = document.createElement(tag);
  new_tag.id = id;
  new_tag.innerHTML = html;
  return new_tag;
}

const $after = (node, html) => {
  node.insertAdjacentHTML('afterend', html);
}

const $before = (node, html) => {
  node.insertAdjacentHTML('beforebegin', html);
}

const $append = (parent, child) => {
  parent.appendChild(child);
}

const $prepend = (parent, node) => {
  parent.insertBefore(node, parent.firstChild);
}

const $remove = (parent, child) => {
  parent.removeChild(child);
}

const $clone = (node) => {
  return node.cloneNode(true);
}

const $contains = (node, child) => {
  return node !== child && node.contains(child);
}

const $has = (node, selector) => {
  return node.querySelector(selector) !== null;
}

const $empty = (node) => {
  return node.innerHTML == '';
}

const $style_of = (node, ruleName) => {
  return getComputedStyle(node)[ruleName]
}

const $attribute_of = (node, name) => {
  return node.getAttribute(name);
}

const $attribute = (node, name, value) => {
  return node.setAttribute(name, value);
}

const $html_of = (node) => {
  return node.innerHTML;
}

const $html = (node, newhtml) => {
  node.innerHTML = newhtml;
}

const $has_class = (node, className) => {
  return node.classList.contains(className);
}


const $outer_html = (node) => {
  return node.outerHTML;
}

const $replace_with = (node, newhtml) => {
  node.outerHTML = newhtml;
}

const $matches = (node, selector) => {
  if(node.matches) {
    return node.matches(selector);
  } else if(node.matchesSelector) {
    return node.matchesSelector(selector);
  } else if(node.mozMatchesSelector) {
    return node.mozMatchesSelector(selector);
  } else if(node.webkitMatchesSelector) {
    return node.webkitMatchesSelector(selector);
  } else if(node.oMatchesSelector) {
    return node.oMatchesSelector(selector);
  } else if(node.msMatchesSelector) {
    return node.msMatchesSelector(selector);
  } else {
    return null;
  }
}

const $offset = (node) => {
  return {left: node.offsetLeft, top: node.offsetTop};
}

const $offset_parent = (node) => {
  return node.offsetParent || node;
}

const $parent = (node) => {
  return node.parentNode;
}

const $text_of = (node) => {
  return node.textContent;
}

const $text = (node, newtext) => {
  node.textContent = newtext;
}

const $boot = (cb) => {
  document.addEventListener("DOMContentLoaded", cb);
}

const $off = (node, eventName,  eventHandler) => {
  node.removeEventListener(eventName, eventHandler);
}

const $on = (node, eventName, eventHandler) => {
  node.addEventListener(eventName, eventHandler);
}

const $fetch_json = async (url, settings) => {
  let req = await fetch(url, settings);

  if(req.ok) {
    return await req.json();
  } else {
    return undefined;
  }
}

const $now = () => {
  return Date.now();
}

const $parse = (htmlString) => {
  let tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = htmlString
  return tmp.body.children;
}
