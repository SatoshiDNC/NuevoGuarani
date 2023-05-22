class DefaultLightTheme extends ColorTheme {
	constructor() {
		super();
		this.set('uiBackground'			, [1,1,1, 1]);
		this.set('uiForeground'			, [0,0,0, 1]);
		this.set('uiButton'					, [0.2,0.2,0.2, 1]);
		this.set('uiButtonSel'			, [0.8,0.0,0.0, 1]);
		this.set('uiButtonGhost'		, [0.8,0.8,0.8, 1]);
		this.set('uiLedger1'				, [1.00,1.00,1.00, 1]);
		this.set('uiLedger2'				, [0.95,0.95,0.95, 1]);
	}
}
