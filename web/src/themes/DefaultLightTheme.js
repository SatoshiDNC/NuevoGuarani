class DefaultLightTheme extends ColorTheme {
	constructor() {
		super();
		this.set('uiLightningYellow'	, [0.9,0.8,0, 1])
		this.set('uiBackground'			, [1,1,1, 1])
		this.set('uiForeground'			, [0,0,0, 1])
		this.set('uiButton'					, [0.2,0.2,0.2, 1])
		this.set('uiButtonSel'			, [0.0,0.8,0.0, 1])
		this.set('uiButtonGhost'		, [0.8,0.8,0.8, 1])
		this.set('uiVideoOverlayButton'					, [0,0,0, 1])
		this.set('uiVideoOverlayButtonGhost'		, [0,0,0, 0.25])
		this.set('uiLedger1'				, [1.00,1.00,1.00, 1])
		this.set('uiLedger2'				, [0.95,0.95,0.95, 1])
		this.set('uiSpeechCloud'		, [1.00,1.00,1.00, 1])
		this.set('uiSilverLining'		, [0.90,0.90,0.90, 1])
    this.set('uiSettingsSubText', [0.3,0.3,0.3, 1])
	}
}
