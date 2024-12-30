export default async function decorate(block) {
  const xfPath = block.querySelector('a')?.href;
  block.innerHTML = '';
  const resp = await fetch(xfPath);
  if (resp.ok) {
    let str = await resp.text();
    const { location } = window;
    if (location.href.includes('localhost') || location.href.includes('main--')) {
      str = str.replaceAll(
        '/etc.clientlibs/',
        'https://publish-p144166-e1488019.adobeaemcloud.com/etc.clientlibs/',
      );
      str = str.replaceAll(
        '/content/',
        'https://publish-p144166-e1488019.adobeaemcloud.com/content/',
      );
    }
    const div = document.createElement('div');
    div.innerHTML = str;
    div.querySelectorAll('link').forEach((link) => {
      const newLink = document.createElement('link');
      newLink.href = link.href;
      newLink.rel = 'stylesheet';
      document.head.append(newLink);
    });
    block.append(div.querySelector('.root'));
    div.querySelectorAll('script').forEach((link, index) => {
      const exculdeLink = ['/clientlibs/granite/', '/foundation/clientlibs'];
      // debugger;
      if (!exculdeLink.filter((clientLib) => link.src.includes(clientLib)).length) {
        setTimeout(() => {
          const newScript = document.createElement('script');
          newScript.src = link.src.replace('http://localhost:3000', 'https://publish-p144166-e1488019.adobeaemcloud.com');
          newScript.type = 'text/javascript';
          // if (link.src.includes('localhost')) {
          //   console.log('link.src :: ', newScript.src);
          // }
          document.body.append(newScript);
        }, index);
      }
    });
    // block.innerHTML = str;
  }
  return block;
}
