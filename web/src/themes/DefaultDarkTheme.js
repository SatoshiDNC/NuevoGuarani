class DefaultDarkTheme extends ColorTheme {
	constructor() {
		super();
		this.set('uiBackground'			, [0,0,0, 1]);
		this.set('uiForeground'			, [1,1,1, 1]);
		this.set('uiButton'					, [0.6,0.6,0.6, 1]);
		this.set('uiButtonSel'			, [0.2,1.0,0.2, 1]);
		this.set('uiButtonGhost'		, [0.2,0.2,0.2, 1]);
		this.set('uiVideoOverlayButton'					, [1,1,1, 1]);
		this.set('uiVideoOverlayButtonGhost'		, [1,1,1, 0.33]);
		this.set('uiLedger1'				, [0.00,0.00,0.00, 1]);
		this.set('uiLedger2'				, [0.05,0.05,0.05, 1]);
		this.set('uiSpeechCloud'		, [0.05,0.05,0.05, 1]);
		this.set('uiSilverLining'		, [0.10,0.10,0.10, 1]);
//		Object.defineProperty(this, "uiDataEntryArea", { get : function () { return [1.10,0.10,0.10, 1]; } } );
	}
}
