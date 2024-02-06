
function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

function observe(element,f, config = { subtree: true,childList:true, attributes:true},disableAfterFirst=true,params=[]){


  const mutationObserver = new MutationObserver(async () => {
    if (disableAfterFirst){
        mutationObserver.disconnect()
    }
    f(mutationObserver,params);
  });
  mutationObserver.observe(element, config);
  return mutationObserver
}

function fromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html : html.trim();
    if (!html) return null;
  
    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;
  
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
  }

function appendChildren(root,children){
  children.forEach(child => root.appendChild(child));
}

function waitForElement(selector, callback, checkFrequencyInMs=10, timeoutInMs=15000,failure_callback=undefined) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    element = document.querySelector(selector)
    if (element) {
      callback(element);
    } else {
      setTimeout(function () {
        const elapsed = Date.now() - startTimeInMs;
        if (timeoutInMs &&  elapsed > timeoutInMs){
          if (failure_callback){failure_callback()}
        }else{
          loopSearch();
        }
      }, checkFrequencyInMs);
    }
  })();
}
function propagateOnChange(element){
  var event = new Event('change', { bubbles: true });
  element.dispatchEvent(event);
}

function cleanPropagate(e){
  e.value=""
  propagateOnChange(e)
}