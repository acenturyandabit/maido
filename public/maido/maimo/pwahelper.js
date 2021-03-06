  //handle installation

  if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
          navigator.serviceWorker.register('sw.js').then(function (registration) {
              // Registration was successful
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function (err) {
              // registration failed :(
              console.log('ServiceWorker registration failed: ', err);
          });
      });
  }


  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
      console.log("Deferred prompt!");
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
  });
  window.addEventListener('appinstalled', (evt) => {
      console.log("Installed!");
  });

  // fetch latest task data from localhost
  $.getJSON("../latest?name=uwubuntu",(d)=>{
      
  })