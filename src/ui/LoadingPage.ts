import { logoImage } from '@/utils/logo';

export class LoadingPage {

  active = true;

  domElement: HTMLElement;
  messageElement?: HTMLElement;

  constructor(canvas: HTMLCanvasElement) {
    this.addCSS('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
    this.domElement = this.createPage();
    canvas.parentElement?.prepend(this.domElement);
  }

  createPage() {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '0';
    div.style.right = '0';
    div.style.top = '0';
    div.style.bottom = '0';
    div.style.backgroundColor = '#141414';
    div.innerHTML = `
      <div style="height:100%; display:flex; justify-content:center; align-items:center;">
        <img
          class="animate__animated animate__bounceIn"
          style="width:300px; --animate-duration: 1s; animation-delay: 0.1s;"
          src="${logoImage}"
        />
        <div style="position:absolute; bottom:40px; width: 80%; text-align: center; line-height: 24px; color: #fff; font-family: Menlo, Monaco, 'Courier New', monospace">
          <div id="athena-message"></div>
        </div>
      </div>`;
    this.messageElement = div.querySelector('#athena-message')!;
    return div;
  }

  setMessage(str: string) {
    this.messageElement!.innerHTML = str;
  } 

  addCSS(url: string) {
    let hasStyle = false;
    for (const child of Array.from(document.head.children)) {
      if (child instanceof HTMLLinkElement && child.href === url) {
        hasStyle = true;
        break;
      }
    }
    if (!hasStyle) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href= url;
      document.head.append(link);
    }
  }

  show() {
    if (!this.active) {
      this.domElement.className = 'animate__animated animate__fadeIn';
      this.active = true;
    }
  }

  hide() {
    if (this.active) {
      this.domElement.className = 'animate__animated animate__fadeOut';
      this.active = false;
    }
  }

  destroy() {
    this.domElement.remove();
  }

}