const MENU_CONFIG = [
  { name: 'Rotating Cube', href: '/examples/rotating_cube.html' },
  { name: 'Instanced Cube', href: '/examples/instanced_cube.html' },
  { name: 'GLTF Loader', href: '/examples/gltf_loader.html' }
];

window.onload = () => {
  const submenuElm = document.getElementById('submenu');
  submenuElm.innerHTML = MENU_CONFIG.reduce(
    (str, item) =>
      str +
      `
    <li>
      <a href="#${item.href}">
        <i class="iconfont icon-dot"></i>
        <div class="text">${item.name}</div>
      </a>
    </li>
  `,
    ''
  );

  let activeNode;
  let lastActiveNode;

  const setActive = () => {
    const list = document.querySelectorAll('#submenu a');
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
