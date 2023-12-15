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
