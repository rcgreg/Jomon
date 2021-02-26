onExecuted = (result) => {
  //console.log(`Success!`);
}

onError = (error) => {
  console.log(`Error: ${error}`);
}

/////
document.getElementById('boldbutton').onclick = () => {
  browser.tabs.executeScript({code:"document.execCommand('bold')"}).then(onExecuted, onError);
};

document.getElementById('fontbutton').onclick = () => {
  const fontsize = document.getElementById('fontsize').value;
  const changeFontSize = "document.execCommand('fontsize', false, " + fontsize + ");";
  browser.tabs.executeScript({code:changeFontSize}).then(onExecuted, onError);
};

const showEditableIcon = (bool) => {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currTabId = tabs[0].id;
    bool ? browser.pageAction.show(currTabId) : browser.pageAction.hide(currTabId);
 });
};

const modswitch = document.getElementById('mod-switch');
modswitch.onclick = () => {
  const editablepage = "document.body.setAttribute('contenteditable', '" + modswitch.checked + "');";

  browser.tabs.executeScript({code:editablepage}).then(onExecuted, onError);
  showEditableIcon(modswitch.checked);
}

browser.runtime.onMessage.addListener(() => {
  modswitch.checked = false;
});

window.addEventListener('load', () => {
  browser.tabs.executeScript( null, {code:"document.body.contentEditable"},
    (result) => {
      if(result != null && result[0] == 'true')
        modswitch.checked = true;
    }
  );
});
/////

/** region */
const IMGURL = 'https://s3-ap-northeast-1.amazonaws.com/amazonpay-mockup-tool/image/';

const regionImg = (() => {
  return {
    show: (region) => {
      const imgs = document.getElementsByClassName( `${ region }-imgs` )
      for (const img of imgs) {
        img.style.display = 'block'
      }
    },
    hide: () => {
      const regionsImgs = document.getElementsByClassName('region-imgs')
      for (const img of regionsImgs) {
        img.style.display = 'none'
      }
    }
  }
})()

const changeButtonImage = (region) => {
  let login = document.getElementById('loginbuttonimg')
  let pay = document.getElementById( 'paybuttonimg' )

  let maxopay = document.getElementById('maxobuttonimg')
  maxopay.src = `${ IMGURL }${ region }/MAXO_button_${ region }.png`

  let maxlogin = document.getElementById( 'maxologinimg' )

  switch ( region ) {
    case 'de':
      login.src = 'https://d23yuld0pofhhw.cloudfront.net/default/uk/de_DE/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d23yuld0pofhhw.cloudfront.net/uk/live/de_de/amazonpay/gold/x-large/button_T5.png'
      maxlogin.src = `${ IMGURL }us/MAXO_signin.jpg`
      break

    case 'es':
      login.src = 'https://d23yuld0pofhhw.cloudfront.net/default/uk/es_ES/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d23yuld0pofhhw.cloudfront.net/uk/live/es_es/amazonpay/gold/x-large/button_T5.png'
      maxlogin.src = `${ IMGURL }us/MAXO_signin.jpg`
      break

    case 'fr':
      login.src = 'https://d23yuld0pofhhw.cloudfront.net/default/uk/fr_FR/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d23yuld0pofhhw.cloudfront.net/uk/live/fr_fr/amazonpay/gold/x-large/button_T5.png'
      maxlogin.src = `${ IMGURL }us/MAXO_signin.jpg`
      break

    case 'it':
      login.src = 'https://d23yuld0pofhhw.cloudfront.net/default/uk/it_IT/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d23yuld0pofhhw.cloudfront.net/uk/live/it_it/amazonpay/gold/x-large/button_T5.png'
      maxlogin.src = `${ IMGURL }us/MAXO_signin.jpg`
      break

    case 'us':
      login.src = 'https://d2ldlvi1yef00y.cloudfront.net/default/us/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d2ldlvi1yef00y.cloudfront.net/default/us/live/lwa/gold/x-large/PwA.png'
      maxlogin.src = `${ IMGURL }us/MAXO_signin.jpg`
      break

    case 'jp':
      login.src = 'https://d1oct1bdmx33tz.cloudfront.net/default/jp/live/lwa/gold/x-large/LwA.png'
      pay.src = 'https://d1oct1bdmx33tz.cloudfront.net/default/jp/live/lwa/gold/x-large/PwA.png'
      maxlogin.src = `${ IMGURL }${ region }/MAXO_signin.jpg`
      regionImg.show(region)
      break
  }
}

const changeAddressPaymentImage = ( region ) => {
  document.getElementById('addressimg').src = IMGURL + region + '/address.jpg';
  document.getElementById('paymentimg').src = IMGURL + region + '/payment.jpg';
  document.getElementById('addresspaymentimg').src = IMGURL + region + '/address-payment.jpg';
  document.getElementById('confirmationimg').src = IMGURL + region + '/confirm.jpg';
  document.getElementById( 'marketinglogoimg' ).src = IMGURL + region + '/marketing-logo.jpg';

  // MAXO
  document.getElementById( 'maxoaddressimg-pc' ).src = IMGURL + region + '/MAXO_choose-address_pc.png';
  document.getElementById( 'maxopaymentimg-pc' ).src = IMGURL + region + '/MAXO_choose-payment_pc.png';
  document.getElementById( 'maxocontinueimg-pc' ).src = IMGURL + region + '/MAXO_continue-page_pc.png';
  document.getElementById( 'maxodeclineimg-pc' ).src = IMGURL + region + '/MAXO_decline_pc.png';

  document.getElementById( 'maxoaddressimg-sp' ).src = IMGURL + region + '/MAXO_choose-address_sp.png';
  document.getElementById( 'maxopaymentimg-sp' ).src = IMGURL + region + '/MAXO_choose-payment_sp.png';
  document.getElementById( 'maxocontinueimg-sp' ).src = IMGURL + region + '/MAXO_continue-page_sp.png';
  document.getElementById( 'maxodeclineimg-sp' ).src = IMGURL + region + '/MAXO_decline_sp.png';
}

const changeImage = (regionidx, region) => {
  let regionval = region.options[regionidx].value;

  regionImg.hide()

  switch(regionval) {
    case 'de':
    case 'es':
    case 'fr':
    case 'it':
    case 'us':
      changeButtonImage( regionval );
      changeAddressPaymentImage('us');
      break;

    case 'jp':
      changeButtonImage( regionval );
      changeAddressPaymentImage(regionval);
      break;
  }
}

const region = document.getElementById('region');
const regionidx = localStorage.getItem('region');
if(regionidx) {
  region.options[regionidx].selected = true;
  changeImage(regionidx, region);
}

document.getElementById('region').addEventListener('change', (e) => {
  let index = e.target.selectedIndex;
  localStorage.setItem('region', index);
  changeImage(index, region);
});

/** standard or maxo version */
const changeVersion = ( versionidx ) => {
  document.getElementById( 'maxo-payment' ).style.display = 'none';
  document.getElementById( 'standard-payment' ).style.display = 'none';

  const versionval = document.getElementById( 'version' ).options[versionidx].value;
  const standardAutoPay = Array.from( document.getElementsByClassName( 'standard-autopay' ) );
  standardAutoPay.forEach( elem => {
    elem.style.display = 'none';
  });

  const maxoAutoPay = Array.from( document.getElementsByClassName( 'maxo-autopay' ) );
  maxoAutoPay.forEach( elem => {
    elem.style.display = 'none';
  });

  const maxoOneTime = Array.from( document.getElementsByClassName( 'maxo-onetime' ) );
  maxoOneTime.forEach( elem => {
    elem.style.display = 'none';
  });

  switch(versionval) {
    case 'standard-onetime':
      document.getElementById( 'standard-payment' ).style.display = 'block';
      break;

    case 'standard-autopay':
      document.getElementById( 'standard-payment' ).style.display = 'block';
      standardAutoPay.forEach( elem => {
        elem.style.display = 'block';
      });

      break;

    case 'maxo-recurring':
      document.getElementById( 'maxo-payment' ).style.display = 'block';
      maxoAutoPay.forEach( elem => {
        elem.style.display = 'block';
      });

      break;  

    case 'maxo-onetime':
      document.getElementById('maxo-payment').style.display = 'block';
       maxoOneTime.forEach( elem => {
        elem.style.display = 'block';
      });
      break;
  }
}

const versionidx = localStorage.getItem('version')
if ( versionidx ) {
  const version = document.getElementById('version')
  version.options[versionidx].selected = true
  changeVersion(versionidx)
} else {
  localStorage.setItem('version', 0);
  changeVersion(0)
}

document.getElementById('version').addEventListener('change', (e) => {
  const index = e.target.selectedIndex;
  localStorage.setItem('version', index);
  changeVersion(index);
})

/** device */
const changeMaxoDevice = ( deviceidx ) => {
  document.getElementById( 'maxo-pc' ).style.display = 'none';
  document.getElementById( 'maxo-sp' ).style.display = 'none';

  const deviceval = document.getElementById( 'device' ).options[deviceidx].value;

  switch(deviceval) {
    case 'pc':
      document.getElementById( 'maxo-pc' ).style.display = 'block';
      break;

    case 'sp':
      document.getElementById( 'maxo-sp' ).style.display = 'block';
      break;
  }
}

const deviceidx = localStorage.getItem( 'device' )
if ( deviceidx ) {
  const device = document.getElementById('device')
  device.options[deviceidx].selected = true
  changeMaxoDevice(deviceidx)
} else {
  localStorage.setItem('device', 0);
  changeMaxoDevice(0)
}

document.getElementById('device').addEventListener('change', (e) => {
  const index = e.target.selectedIndex;
  localStorage.setItem('device', index);
  changeMaxoDevice(index);
})

/** download image */
const downloadImgs = document.getElementsByClassName('downloadimg')
for ( const downloadImg of downloadImgs ) {
  const path = downloadImg.src.split( '/' )
  const filename = path[path.length - 1]
  downloadImg.addEventListener( 'click', ( e ) => {
    browser.runtime.sendMessage( { action: 'download', img: downloadImg.src, filename: filename } )  
  } )  
}