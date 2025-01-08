// add delayed functionality here
function loadKlaviyoScript() {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.async = true;
  scriptTag.src = 'https://static.klaviyo.com/onsite/js/RvcFeD/klaviyo.js';
  document.body.append(scriptTag);
}

loadKlaviyoScript();
