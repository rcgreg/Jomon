browser.runtime.onMessage.addListener((message) => {
  if ( message.action === 'hideEditableIcon' ) {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
      browser.pageAction.hide(tabs[0].id)
    }) 
  }
})

browser.runtime.onMessage.addListener((message) => {
  if ( message.action === 'download' ) {
    const downloading = browser.downloads.download( { url: message.img, filename: message.filename, saveAs: true} );
    downloading.then(onStartedDownload, onFailed);
  }
})

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`)
}

function onFailed(error) {
  console.log(`Download failed: ${error}`)
}

const action = () => {
  browser.tabs.captureVisibleTab( ( url ) => {
    const blob = toBlob(url);
    const downloading = browser.downloads.download( { url: URL.createObjectURL(blob), filename: 'amazonpay-page.png',saveAs: true} );
    downloading.then(onStartedDownload, onFailed);
  });
};

browser.menus.create({
  id: 'capture-page',
  title: 'Capture this page',
  contexts: ['all'],
  type: 'normal'
});

// When Clicked on the Menu . Trigger for action
browser.menus.onClicked.addListener( action );

function toBlob(base64) {
    const bin = atob(base64.replace(/^.*,/, ''));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Create a Blob
    try{
        return new Blob([buffer.buffer], {
            type: 'image/png'
        });
    }catch (e){
        return false;
    }
}