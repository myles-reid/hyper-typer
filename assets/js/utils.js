export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

export function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

export function toggleVisibility(element, status) {
  return element.style.visibility = status;
}

export function addClass(element, text) {
  return element.classList.add(text);
}

export function removeClass(element, text) {
  return element.classList.remove(text);
}

export function toggleClass(element, text) {
  return element.classList.toggle(text);
}