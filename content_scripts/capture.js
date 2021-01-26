onError = (error) => {
    console.log(`Error: ${error}`);
}

const mockupevt = document.createEvent( "MouseEvents" );
mockupevt.initMouseEvent("click", true, true
, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
document.getElementById("download").dispatchEvent(mockupevt);