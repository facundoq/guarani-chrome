
export abstract class UI{

  public abstract root:HTMLElement
  
}

export function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

export function observe(element,f, config = { subtree: true,childList:true, attributes:true},disableAfterFirst=true,params=[]){


  const mutationObserver = new MutationObserver( () => {
    if (disableAfterFirst){
        mutationObserver.disconnect()
    }
    f(mutationObserver,params);
  });
  mutationObserver.observe(element, config);
  return mutationObserver
}


export function toggleElement(el, display = "block") {
  if (el.style.display === "none") {
    el.style.display = display;
  } else {
    el.style.display = "none";
  }
}

export function fromHTML(html:string, trim = true) {
    // Process the HTML string.
    html = trim ? html : html.trim();
    if (!html) return null;
  
    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;
  
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length !== 1) throw Error(`fromHTML must create one and only one element (possibly with many children, found ${result})`)
    
    return result[0] as unknown as  HTMLElement
  } 

export function appendChildren(root:HTMLElement,children:HTMLElement[]){
  
  children.forEach(child => root.appendChild(child));
}

export function waitForElement(selector:string, callback:CallableFunction, checkFrequencyInMs=10, timeoutInMs=15000,failure_callback:CallableFunction=undefined) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    const element = document.querySelector(selector)
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
export function propagateOnChange(element:Element){
  var event = new Event('change', { bubbles: true });
  element.dispatchEvent(event);
}

export function cleanPropagate(e){
  e.value=""
  propagateOnChange(e)
}