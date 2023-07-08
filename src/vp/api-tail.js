  function setDebugFlags(debug, cont) { showdebug=!!debug; continuous=!!cont; }
  function beep(type = '') {
		if (!beepSound) return;
		switch (type) {
		case 'qr-scan':
			beepSound.setValueAtTime(2, ac.currentTime);
			beepSound.setValueAtTime(3, ac.currentTime+0.05);
			beepSound.setValueAtTime(0, ac.currentTime+0.1);
			break;
		case 'qr-part':
			beepSound.setValueAtTime(2, ac.currentTime);
			beepSound.setValueAtTime(0, ac.currentTime+0.05);
			break;
		case 'click':
			clickSound.setValueAtTime(0.1, ac.currentTime);
			clickSound.setValueAtTime(0, ac.currentTime+0.001);
			break;
		default:
			beepSound.setValueAtTime(1, ac.currentTime);
			beepSound.setValueAtTime(0, ac.currentTime+0.1);
		}
	};

  return {
    initialize: initialize,
    start: start,
    setDebugFlags: setDebugFlags,
    getContext: getContext,
    getPointerRadius: getPointerRadius,
    isMouseEnabled: isMouseEnabled,
		getInputGad: getInputGad,
		beginInput: beginInput,
		endInput: endInput,
		setImage: setImage,
		drawImage: drawImage,
		beep: beep,
    View: View,
    DividerView: DividerView,
    SliceView: SliceView,
    PagesView: PagesView,
		PopupView: PopupView,
    ViewOverlay: ViewOverlay,
    ViewMultiverse: ViewMultiverse,
    ViewPicker: ViewPicker,
    Gadget: Gadget,
    MatrixGadget: MatrixGadget,
    SwipeGadget: SwipeGadget,
    MiddleDividerGadget: MiddleDividerGadget,
    GAF_CLICKABLE: GAF_CLICKABLE,
    GAF_HOLDABLE: GAF_HOLDABLE,
    GAF_CONTEXTMENU: GAF_CONTEXTMENU,
    GAF_STRETCHABLE: GAF_STRETCHABLE,
    GAF_DRAGGABLE_UPDOWN: GAF_DRAGGABLE_UPDOWN,
    GAF_DRAGGABLE_LEFTRIGHT: GAF_DRAGGABLE_LEFTRIGHT,
    GAF_DRAGGABLE: GAF_DRAGGABLE,
    GAF_SWIPEABLE_UPDOWN: GAF_SWIPEABLE_UPDOWN,
    GAF_SWIPEABLE_LEFTRIGHT: GAF_SWIPEABLE_LEFTRIGHT,
    GAF_SWIPEABLE: GAF_SWIPEABLE,
    GAF_SCROLLABLE_UPDOWN: GAF_SCROLLABLE_UPDOWN,
    GAF_SCROLLABLE_LEFTRIGHT: GAF_SCROLLABLE_LEFTRIGHT,
    GAF_SCROLLABLE: GAF_SCROLLABLE,
    GAF_SCALABLE: GAF_SCALABLE,
    GAF_ROTATABLE: GAF_ROTATABLE,
    GAF_PINCHABLE: GAF_PINCHABLE,
    GAF_NUMINPUT: GAF_NUMINPUT,
    GAF_TEXTINPUT: GAF_TEXTINPUT,
		GAF_GONEXT: GAF_GONEXT,
    GAF_ALL: GAF_ALL,
    HitList: HitList,
    LayoutState: LayoutState,
  };
})();
