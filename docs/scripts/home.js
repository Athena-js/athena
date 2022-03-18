window.onload = () => {
  let activeNode;
  let lastActiveNode;

  const setActive = () => {
    const list = document.querySelectorAll('ul.submenu a');
    list.forEach((a) => {
      if (window.location.href.includes(a.href)) {
        lastActiveNode = activeNode;
        activeNode = a;
      }
    });
    activeNode?.classList.add('active');
    lastActiveNode?.classList.remove('active');
  };

  const iframe = document.getElementById('iframe');
  const getURL = (url) => /#(.+)/.exec(url)?.[1];

  const checkUrl = (url, onerror) => {
    const iframeURL = getURL(url);
    if (iframeURL) {
      iframe.src = './' + iframeURL;
      setActive();
    } else {
      onerror?.();
    }
  };

  checkUrl(window.location.href, () => {
    location.href += '#/examples/rotating_cube.html';
  });

  window.addEventListener('hashchange', (event) => {
    checkUrl(event.newURL);
  });
};
