class ColorTheme {
	constructor() {

		// Colors that are generally theme-independent.
		this.uiPillOrange = [1, 0.55, 0.1, 1];
		this.uiLightningPurple = [0.5, 0, 1, 1];
		this.uiLightningYellow = [1, 0.9, 0, 1];
		this.uiFiatGreen = [112/255, 130/255, 56/255, 1];

		// Colors that generally should be set for each theme.
		this.uiBackground			= [0,0,0, 1];
		this.uiForeground			= [1,1,1, 1];
		this.uiButton					= [0.6,0.6,0.6, 1];
		this.uiButtonSel			= [0.2,1.0,0.2, 1];
		this.uiButtonGhost		= [0.2,0.2,0.2, 1];
		this.uiVideoOverlayButton					= [1.0,1.0,1.0, 1];
		this.uiVideoOverlayButtonSel			= this.uiButtonSel;
		this.uiVideoOverlayButtonGhost		= [1.0,1.0,1.0, 0.33];
		this.uiLedger1				= [0.00,0.00,0.00, 1];
		this.uiLedger2				= [0.05,0.05,0.05, 1];
		this.uiSpeechCloud		= [0.05,0.05,0.05, 1];
		this.uiSilverLining		= [0.10,0.10,0.10, 1];
		this.uiReceiptBg			= [0.9,0.9,0.9, 1];
		this.uiReceiptText		= [0.2,0.2,0.2, 1];

		// Derived colors (can be overridden).
		// If this list is changed, the set function (below) must be updated to correspond.
		this.uiTextLabelArea	= this.uiButtonGhost;
		this.uiTextField			= this.uiBackground;
		this.uiTextFocus			= this.uiButtonSel;
		this.uiText						= this.uiForeground;
		this.uiTextLabel			= this.uiForeground;
		this.uiGhostText			= this.uiButton;

		// For the settings area
		this.uiSettingsBubble		= this.uiSilverLining;
		this.uiSettingsDivider	= this.uiButtonGhost;
		this.uiSettingsText			= this.uiForeground;
		this.uiSettingsSubText	= this.uiGhostText;
		this.uiSettingSelect		= this.uiButtonSel;
	}
	get uiBackgroundPattern() { return colorize([0.5,0.5,0.5,1], this.uiBackground, this.uiSettingsBubble); }
	set(variable, value) {

		// Helper.
		const me = this;
		function subset(variable, sub, value) {
			if (me[sub] == me[variable]) me[sub] = value;
		}

		// This switch block must correspond to derived colors list.
		switch (variable) {
		case 'uiButtonGhost':
			subset(variable, 'uiTextLabelArea', value);
			subset(variable, 'uiSettingsDivider', value);
			break;
		case 'uiBackground': subset(variable, 'uiTextField', value); break;
		case 'uiButtonSel':
			subset(variable, 'uiTextFocus', value);
			subset(variable, 'uiSettingSelect', value);
			break;
		case 'uiSilverLining': subset(variable, 'uiSettingsBubble', value); break;
		case 'uiGhostText': subset(variable, 'uiSettingsSubText', value); break;
		case 'uiForeground':
			subset(variable, 'uiText', value);
			subset(variable, 'uiTextLabel', value);
			subset(variable, 'uiSettingsText', value);
			break;
		case 'uiButton': subset(variable, 'uiGhostText', value); break;
		}

		// Finally, do what we came for.
		this[variable] = value;
	}
}
