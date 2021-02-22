window.addEventListener( 'load', () => {
  browser.runtime.sendMessage( { action: 'hideEditableIcon' } );
}, false );

/* definition */
// Panel Modules
const button = {
  create () {
    let button = document.createElement( 'button' );
    button.classList.add( this.className );
    button.innerHTML = "&times;";
    restrictDrag( button );
    return button;
  },
  contains ( elem ) {
    return elem.className == this.className;
  },
  className: 'mockup-draggable-close'
};

const header = {
  create () {
    let elem = document.createElement( 'div' );
    elem.classList.add( this.className );
    elem.innerText = 'Drag Area';
    restrictDrag( elem )
    elem.appendChild( button.create() );
    elem.contentEditable = false;
    dragElement( elem );
    return elem;
  },
  getHeight () {
    let head = document.getElementsByClassName( this.className )[0]; 
    return head.style.height; //To be able to get the height of
  },
  className: 'mockup-draggable-handler'
}

const content = {
  create () {
    let elem = document.createElement( 'div' );
    elem.classList.add( this.className );
    return elem;
  },
  className: 'mockup-draggable-content'
}

const textarea = {
  create () {
    let elem = document.createElement( 'div' );
    elem.spellcheck = false;
    elem.classList.add( this.className, this.placeholderClassName );
    elem.contentEditable = true;
    elem.setAttribute( 'data-placeholder', 'insert TEXT or IMAGE' );
    elem.addEventListener( 'keydown', () => {
      let el = elem;
      setTimeout( () => {
        let diff = el.scrollHeight - parseInt( el.style.height );
        el.style.height = el.scrollHeight + 'px';
        let dragResizePanel = el.parentNode.parentNode;
        dragResizePanel.style.height = ( diff + parseInt( dragResizePanel.style.height ) ) + 'px';
      }, 10 );
    } );
    return elem;
  },
  addClass ( elem ) {
    if ( elem.classList.contains( this.className ) )
      elem.classList.add( this.placeholderClassName );
  },
  removeClass ( elem ) {
    if ( elem.classList.contains( this.className ) )
      elem.classList.remove( this.placeholderClassName );
  },
  className: 'mockup-draggable-textarea',
  placeholderClassName: 'editablePlaceholder'
}

let zIndexCount = 100000

const panel = {
  create () {
    let elem = document.createElement( 'div' );
    elem.classList.add( this.panelClassName, this.resizeClassName, this.dragClassName );
  
    elem.style.zIndex = (++zIndexCount);

    elem.appendChild( header.create() );
    elem.contentEditable = false;

    return elem;
  },
  appendCommon ( elem, customContent ) {
    if ( elem.firstChild )
      restrictDrag( elem.firstChild )

    let dragResizePanel = panel.create();

    let body = customContent();
    dragResizePanel.appendChild( body );

    elem.appendChild( dragResizePanel );

    // Display according to the height of the image
    dragResizePanel.style.height = ( parseInt( body.firstChild.height ) + parseInt( header.getHeight() ) + 30 ) + 'px';

    let position = getAbsolutePosition( dragResizePanel );

    elem.firstChild.style.top = position.top + 'px';
    elem.firstChild.style.left = position.left + 'px';
  },
  appendSpace ( elem ) {
    elem.firstChild.style.height = '100%'; // to change the height of the space image and increase the size that can be hidden by the space.
    elem.firstChild.style.margin = '0';

    this.appendCommon( elem, () => {
      let body = content.create();
      body.style.backgroundColor = '#fff';
      body.appendChild( elem.firstChild ); //Set the image at the beginning of the body
      return body;
    } );

    let dragPanel = elem.firstChild;
    dragPanel.style.height = '300px';
  },
  appendOriginal ( elem ) {
    elem.removeChild( elem.firstChild ); //Delete original image

    this.appendCommon( elem, () => {
      let body = content.create();
      body.appendChild( textarea.create() ); // Set textarea below the image
      return body;
    } );
  },
  appendAccount ( elem ) {
    elem.removeChild( elem.firstChild ); // Delete Original Image

    this.appendCommon( elem, () => {
      let body = content.create();
      let input = document.createElement( 'input' );
      input.setAttribute( 'type', 'checkbox' );
      input.setAttribute( 'checked', 'checked' );

      let text = textarea.create();
      text.appendChild( input );

      let span = document.createElement( 'span' );
      span.classList.add( 'terms-service' );
      span.innerText = 'Terms';

      text.appendChild( span );

      let word = document.createElement( 'span' );
      word.innerText = 'Agree to and register as a member';

      text.appendChild( word );

      body.appendChild( text ); // Set textarea below the image
      return body;
    } );
  },
  append ( elem ) {
    this.appendCommon( elem, () => {
      let body = content.create();
      body.appendChild( elem.firstChild ); //Set the image at the beginning of the body
      body.appendChild( textarea.create() ); //Set textarea below the image
      return body;
    } );
  },
  get ( elem ) {
    return elem.closest( `.${ this.dragClassName }` );
  },
  resizable () {
    Array.prototype.forEach.call( document.querySelectorAll( `.${ this.nonResizeClassName }` ), ( el ) => {
      el.classList.add( this.resizeClassName );
      el.classList.remove( this.nonResizeClassName );

      el.firstChild.style.visibility = 'visible';

      let textareaEl = el.lastElementChild.lastElementChild;
      textarea.addClass( textareaEl );
    } );
  },
  nonResizable () {
    Array.prototype.forEach.call( document.querySelectorAll( `.${ this.dragClassName }` ), ( el ) => {
      el.classList.add( this.nonResizeClassName );
      el.classList.remove( this.resizeClassName );
      el.firstChild.style.visibility = 'hidden';

      let textareaEl = el.lastElementChild.lastElementChild;
      textarea.removeClass( textareaEl );
    } );
  },
  contains ( elem ) {
    return elem.classList.contains( this.panelClassName );
  },
  panelClassName: 'mockup-dragResizePanel',
  dragClassName: 'mockup-draggable',
  resizeClassName: 'mockup-resizable',
  nonResizeClassName: 'mockup-resizable-disable'
}

/* Add Panel to image */
appendPanel = ( mutation ) => {
  mutation.addedNodes.forEach( ( node ) => {
    if ( node.localName === 'img' && node.offsetParent ) { // When you insert an image

      if ( panel.contains( node.offsetParent ) ) {
        node.style.width = '100%';
        let content = node.parentNode;
        let insertedImgHeight = node.clientHeight != 0 ? node.clientHeight : 500;
        content.parentNode.clientHeight = insertedImgHeight;
        content.clientHeight = insertedImgHeight;
      }
    }

    let target = node.lastElementChild;

    if ( !( target && target.id ) )
      return;

    let payimg = ['loginbuttonimg', 'paybuttonimg', 'addressimg', 'paymentimg', 'addresspaymentimg', 'confirmationimg', 'marketinglogoimg', 'maxobuttonimg'];
    if ( payimg.includes( target.id ) ) {
      target.style.width = '100%';
      panel.append( node );
      return;
    }

    if ( ['originalimg'].includes( target.id ) ) {
      target.style.width = '100%';
      panel.appendOriginal( node );
      return;
    }

    if ( ['spaceimg'].includes( target.id ) ) {
      target.style.width = '100%';
      panel.appendSpace( node );
      return;
    }

    if ( ['accountimg'].includes( target.id ) ) {
      target.style.width = '100%';
      panel.appendAccount( node );
      return;
    }

  } );
}

const clickEvent = ( () => {
  changeAll = ( fn ) => {
    let all = document.all;
    for ( let i = 0; i < all.length; ++i ) {
      let el = all[i];
      fn.call( el );
    }
  };

  return {
    disable: () => {
      changeAll( function () {
        if ( this.tagName === 'BUTTON' ) {
          if ( !this.classList.contains( button.className ) ) {
            this.disabled = true;
          }
        } else if ( this.tagName === 'A' ) {
          this.classList.add( 'link-disable' );
        }
      } );
    },
    enable: () => {
      changeAll( function () {
        if ( this.tagName === 'BUTTON' ) {
          if ( !this.classList.contains(button.className) ) {
            this.disabled = false; 
          }
        } else if ( this.tagName === 'A' ) {
          this.classList.remove( 'link-disable' );
        }
      } );
    }
  };
} )();

changePanelEvent = ( mutation ) => {
  if ( mutation.target.localName === 'body' ) {
    let editable = mutation.target.contentEditable === 'true';
    if ( editable ) {
      panel.resizable();
      mutation.target.addEventListener( 'keydown', changeKeydown );
      clickEvent.disable();
    } else {
      panel.nonResizable();
      mutation.target.removeEventListener( 'keydown', changeKeydown );
      clickEvent.enable();
    }
  }
}

/* monitor element addition or contenteditable status */
new MutationObserver( ( mutations ) => {
  mutations.forEach( ( mutation ) => {

    switch ( mutation.type ) {
      // createElement
      case 'childList':
        appendPanel( mutation );
        break;

      // contenteditable
      case 'attributes':
        changePanelEvent( mutation );
        break;
    }

  } );
  attributes: true
} ).observe( document.body, {
  attributeFilter: ['contenteditable'],
  childList: true,
  subtree: true
} );

// resize-drag moduler
dragElement = ( elem ) => {
  const DRAGGING = 'mockup-dragging';
  let drag;
  elem.addEventListener( 'mousedown', ( e ) => {
    // If you press close, remove the mockup-draggablePanel
    if ( button.contains( e.originalTarget ) ) {
      let removeElem = e.originalTarget.offsetParent;
      removeElem.parentNode.removeChild( removeElem );
      return;
    }

    drag = panel.get( e.currentTarget );
    drag.classList.add( DRAGGING )
    drag.style.zIndex = (++zIndexCount);

    let handler = drag.firstChild;
    let diffx = e.clientX - parseInt( drag.style.left ) - handler.clientWidth / 2; //mockup-draggable-handler
    let diffy = e.pageY - parseInt( drag.style.top ) - handler.clientHeight / 2; //mockup-draggable-handler
    // drag.setAttribute( "diffx", diffx );
    // drag.setAttribute( "diffy", diffy );
    drag.dataset.diffx = diffx
    drag.dataset.diffy = diffy

    drag.style.left = ( e.clientX - e.currentTarget.clientWidth / 2 - diffx ) + 'px';
    drag.style.top = ( e.pageY - e.currentTarget.clientHeight / 2 - diffy ) + 'px';

    e.currentTarget.addEventListener( 'mousemove', moveElement );
  } )

  moveElement = ( e ) => {
    drag = panel.get( e.currentTarget );

    // let diffx = drag.getAttribute( "diffx" );
    // let diffy = drag.getAttribute( "diffy" );
    let diffx = drag.dataset.diffx
    let diffy = drag.dataset.diffy
    
    drag.style.left = ( e.clientX - e.currentTarget.clientWidth / 2 - diffx ) + 'px';
    drag.style.top = ( e.pageY - e.currentTarget.clientHeight / 2 - diffy ) + 'px';

    window.getSelection().removeAllRanges()
  }

  stopDragging = ( e ) => {
    drag = panel.get( e.currentTarget );
    drag.classList.remove( DRAGGING );
    e.currentTarget.removeEventListener( 'mousemove', moveElement )
  }

  elem.addEventListener( 'mouseleave', stopDragging )
  elem.addEventListener( 'mouseup', stopDragging )
}

/* others */
restrictDrag = ( elem ) => {
  elem.ondragstart = () => { return false; };
}

changeKeydown = ( e ) => {
  if ( e.keyCode == 13 ) {
    document.execCommand( "DefaultParagraphSeparator", false, "<br><br>" );
    return true;
  }
}

getAbsolutePosition = ( elm ) => {
  const { left, top } = elm.getBoundingClientRect();
  const { left: bleft, top: btop } = document.body.getBoundingClientRect();
  console.log( document.body.width )
  console.log( left - bleft )
  return {
    left: left - bleft,
    top: top - btop,
  };
}