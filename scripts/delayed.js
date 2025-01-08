// add delayed functionality here
function loadHeadGTM() {
  const scriptTag = document.createElement('script');

  scriptTag.innerHTML = `type="text/javascript" async=""
src="https://static.klaviyo.com/onsite/js/PUBLIC_API_KEY/klaviyo.js"`;

  document.head.prepend(scriptTag);
}

if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('author')) {
  loadHeadGTM();
}
