const SETTINGS_DESC_TEXT_SCALE = 0.85

var mainsettings = v = new vp.View(null);
v.name = Object.keys({mainsettings}).pop();
v.title = 'settings';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.layoutFunc = function() {
	const v = this;
	v.maxX = v.sw;
	if (v.swipeGad) v.swipeGad.layout.call(v.swipeGad);
	var y = 25;
	var x = v.sw;
	var skipspace = false;
	for (const g of this.gadgets) {
		if (g.hide) {
			skipspace = true;
		} else if (g.layoutFunc) {
			g.w = v.sw; g.h = 0;
			g.x = 0; g.y = y;
			g.autoHull();
			g.layoutFunc();
      y += g.h;
    } else if (g.description) {
			g.w = v.sw
			g.x = 0; g.y = y

      let lines = [], blankLines = 0, extraLines = 0
      let maxw = v.sw - 2 * 20
      let toFit = tr(g.description).split(' ')
      if (g.description.includes('#')) {
        let i = 0
        let all = ''
        let para
        do {
          i++
          let key = g.description.replace('#', i)
          para = tr(key)
          if (para != key) {
            if (lines.length > 0) { lines.push(''); blankLines++ }
            let desc = '', prefix = ''
            for (let i=0; para[i]==' '; i++) prefix += ' '
            if (para.startsWith('x2>')) { prefix += 'x2>'; para = para.substring(3) }
            if (para.startsWith('b>')) { prefix += 'b>'; para = para.substring(2) }
            if (para.startsWith('c>')) { prefix += 'c>'; para = para.substring(2) }
            toFit = para.split(' ')
            do {
              do {
                desc = (desc + ' ' + toFit.shift()).trim()
              } while (toFit.length > 0 && defaultFont.calcWidth(desc + ' ' + toFit[0]) * SETTINGS_DESC_TEXT_SCALE < maxw && toFit[0] != '\n')
              lines.push(prefix + desc)
              desc = ''; prefix = ''
            } while (toFit.length > 0)    
          } else {
            para = undefined
          }
        } while (para)
        toFit = all.split(' ')
      } else {
        let desc = ''
        do {
          do {
            desc = (desc + ' ' + toFit.shift()).trim()
          } while (toFit.length > 0 && defaultFont.calcWidth(desc + ' ' + toFit[0]) * SETTINGS_DESC_TEXT_SCALE < maxw && toFit[0] != '\n')
          if (desc.startsWith('x2>')) { extraLines = 1 }
          lines.push(desc)
          desc = ''
        } while (toFit.length > 0)
      }

      g.h = (16 * (lines.length + extraLines) + 2 * (lines.length - 1)) * SETTINGS_DESC_TEXT_SCALE + blankLines * (-(16 + 2) * SETTINGS_DESC_TEXT_SCALE + 15)
      g.computedLines = lines
			y += g.h; x = v.sw
			g.autoHull()
		} else if (g.list) {
			g.clickFunc = function(p) {
				settingsbuttons.listClickFunc.call(g, p);
			}
			g.actionFlags = vp.GAF_CLICKABLE;
			g.w = v.sw; g.h = 50 * (g.list.length + (g.canAdd?1:0));
			g.x = 0; g.y = y;
			y += g.h; x = v.sw;
			g.autoHull();
		} else if (['button','enable'].includes(g.type) || g.button) {
			g.actionFlags = vp.GAF_CLICKABLE;
			g.w = v.sw; g.h = g.subtitle?65:50;
			g.x = 0; g.y = y;
			y += g.h;
			g.autoHull();
		} else if (g.listToOverlay) {
			g.actionFlags = vp.GAF_CLICKABLE; g.z = 1;
			g.w = 30; g.h = 30;
			g.x = x - 40; g.y = g.listToOverlay.y + 10 + 50 * g.listToOverlay.index;
			x -= 50;
			g.autoHull();
			skipspace = true;
		} else {
			g.clickFunc = function() {
				settingsbuttons.subOptionClickFunc.call(this, this.pane);
			}
			g.actionFlags = vp.GAF_CLICKABLE;
			g.w = v.sw; g.h = 65;
			g.x = 0; g.y = y;
			y += g.h;
			g.autoHull();
		}
		if (!skipspace && !g.daisychain) y += 15;
		skipspace = false;
	}
	v.maxY = y;
}
v.renderFunc = function() {
	const th = config.themeColors;
	drawThemeBackdrop(this, th);
	mainShapes.useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array(th.uiForeground));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	const mat = mat4.create();
	var y = 25, daisychain = false;
	const margin = (th.uiBackground[0] + th.uiBackground[1] + th.uiBackground[2] == 0)? 5:5;
	for (const g of this.gadgets) {
		if (g.hide) {
		} else if (g.renderFunc) {
			g.renderFunc.call(g)
    } else if (g.description) {
      var color = th.uiSettingsSubText
      let i = 0, blankLines = 0
      for (let line of g.computedLines) {
        if (line == '') {
          blankLines++
        } else {
          mat4.identity(mat)
          mat4.translate(mat,mat, [g.x + 20, g.y + blankLines * 15, 0])
          let scale = SETTINGS_DESC_TEXT_SCALE, ii = 1
          if (line.startsWith('x2>')) {
            scale *= 2; ii = 2
            line = line.substring(3)
          }
          let col = color
          if (line.startsWith('b>')) {
            col = th.uiSettingsText
            line = line.substring(2)
          }
          mat4.scale(mat,mat, [scale, scale, 1])
          if (line.startsWith('c>')) {
            let x = ((g.w - 20 * 2) / scale - defaultFont.calcWidth(line.substring(2))) / 2
            defaultFont.draw(x, 14 + (16 + 2) * i, line.substring(2), col, this.mat, mat)
          } else {
            defaultFont.draw(0, 14 + (16 + 2) * i, line, col, this.mat, mat)
          }
          i += ii
        }
      }
		} else if (g.listToOverlay) {
			mainShapes.useProg2();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'),
				false, this.mat);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array([1,1,1,1]));
			mat4.identity(mat);
			//mat4.translate(mat,mat, [g.x,g.y+15+2.5+i*optionheight+14,0]);
			mat4.translate(mat,mat, [g.x,g.y+5+2.5+14,0]);
			var color = th.uiSettingsText;
			iconFont.draw(0,0,g.icon,color, this.mat, mat);
		} else {
			mainShapes.useProg2();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'),
				false, this.mat);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array(g.color&&!g.nonpersistent?colorize(g.color, th.uiBackground, th.uiSettingsBubble):th.uiSettingsBubble));
			mat4.identity(mat);
			mat4.translate(mat,mat, [g.x+margin,g.y,0]);
			mat4.scale(mat,mat, [g.w-2*margin,25,1]);
			if (daisychain) {
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
				mainShapes.drawArrays2('rect');
			} else {
				mat4.scale(mat,mat, [1/16,1/1,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
				mainShapes.drawArrays2('settingstop');
			}

			if (g.daisychain) {
				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+margin,g.y+25,0]);
				mat4.scale(mat,mat, [g.w-2*margin,g.h-25,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			} else {
				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+margin,g.y+g.h-25,0]);
				mat4.scale(mat,mat, [g.w-2*margin,25,1]);
				mat4.scale(mat,mat, [1/16,1/1,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
				mainShapes.drawArrays2('settingsbot');

				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+margin,g.y+25,0]);
				mat4.scale(mat,mat, [g.w-2*margin,g.h-50,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			}
			mainShapes.drawArrays2('rect');

      if (g.nonpersistent) {
        const border = 2
        gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
  				new Float32Array(g.color?colorize(g.color, th.uiBackground, th.uiSettingsBubble):th.uiBackground));
        mat4.identity(mat);
        mat4.translate(mat,mat, [g.x+margin+border,g.y+daisychain?0:border,0]);
        mat4.scale(mat,mat, [g.w-2*(margin+border),25,1]);
        if (daisychain) {
          gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
          mainShapes.drawArrays2('rect');
        } else {
          mat4.scale(mat,mat, [1/16,1/1,1]);
          gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
          mainShapes.drawArrays2('settingstop');
        }

        if (g.daisychain) {
          mat4.identity(mat);
          mat4.translate(mat,mat, [g.x+margin+border,g.y+25,0]);
          mat4.scale(mat,mat, [g.w-2*(margin+border),g.h-25,1]);
          gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
        } else {
          mat4.identity(mat);
          mat4.translate(mat,mat, [g.x+margin+border,g.y+g.h-25,0]);
          mat4.scale(mat,mat, [g.w-2*(margin+border),25-border,1]);
          mat4.scale(mat,mat, [1/16,1/1,1]);
          gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
          mainShapes.drawArrays2('settingsbot');

          mat4.identity(mat);
          mat4.translate(mat,mat, [g.x+margin+border,g.y+25,0]);
          mat4.scale(mat,mat, [g.w-2*(margin+border),g.h-50,1]);
          gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
        }
        mainShapes.drawArrays2('rect');
      }

			if (daisychain) {
				mainShapes.useProg5();
				gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'),
					false, this.mat);
				gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
					new Float32Array([1,1,1,1]));
				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+margin+25,g.y,0]);
				mat4.scale(mat,mat, [g.w-2*margin-50,1,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
				mainShapes.drawArrays5('divSettings');
			}

			if (g.list) {
				var optionheight = 50, gca = false;
				if (g.canAdd) gca = true;
				for (var i=0; i<g.list.length + gca?1:0; i++) {
					var li = i<g.list.length;
					const o = li? g.list[i]: undefined;
					mat4.identity(mat);
					mat4.translate(mat,mat, [g.x+20,g.y+15+2.5+i*optionheight+14,0]);
					if (g.selection !== undefined) {
						var color = g.selection.includes(g.list[i])?
							th.uiSettingSelect : th.uiSettingsText;
						if (li) {
							var str = g.selection.includes(g.list[i])?"\x0E":"\x0D";
							iconFont.draw(0,0,str,color, this.mat, mat);
							defaultFont.draw(0,0,' ',color, this.mat, mat);
						} else {
							iconFont.draw(0,0,"\x0B",color, this.mat, mat);
							defaultFont.draw(0,0,' ',color, this.mat, mat);
						}
					} else {
						var color = (i == g.index)? th.uiSettingSelect : th.uiSettingsText;
						if (li) {
							iconFont.draw(0,0,(i == g.index)?"\x06":"\x05",color, this.mat, mat);
							defaultFont.draw(0,0,' ',color, this.mat, mat);
						} else {
							iconFont.draw(0,0,"\x0B",color, this.mat, mat);
							defaultFont.draw(0,0,' ',color, this.mat, mat);
						}
					}
					var color = th.uiSettingsText;
					var str, str2
					if (li) {
						if (typeof o === 'object') {
							str = o.title; str2 = o.alt
						} else {
							str = o
						}
					} else {
						str = 'add new';
					}
					str = icap(tr(str)); defaultFont.draw(0,0,str,color, this.mat, mat)
          if (str2) {
            str2 = icap(tr(str2)); defaultFont.draw(0,0,' · '+str2,th.uiSettingsSubText, this.mat, mat)
          }

					if (i==0) continue;
					mainShapes.useProg5();
					gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'),
						false, this.mat);
					gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
						new Float32Array([1,1,1,1]));
					mat4.identity(mat);
					mat4.translate(mat,mat, [g.x+25,g.y+i*optionheight,0]);
					mat4.scale(mat,mat, [g.w-50,1,1]);
					gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
					mainShapes.drawArrays5('divSettings');
				}
			} else if (['button','enable'].includes(g.type) || g.button) {
				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+20,g.y+15+(g.subtitle?0:2.5)+14,0]);
				if (g.icon) {
					var color = g.color? g.color: th.uiSettingsText;
					if (g.icon == "\x0E") color = th.uiSettingSelect;
					iconFont.draw(0,0,g.icon,color, this.mat, mat);
					defaultFont.draw(0,0,' ',color, this.mat, mat);
				}
				var color = g.color? g.color: th.uiSettingsText;
				defaultFont.draw(0,0,icap(tr(g.title)),color, this.mat, mat);
				if (g.subtitle) {
					mat4.identity(mat);
					mat4.translate(mat,mat, [g.x+20,g.y+15,0]);
					mat4.translate(mat,mat, [0,16+6,0]);
					mat4.scale(mat,mat, [0.75,0.75,1]);
					var color = th.uiSettingsSubText;
					var str;
					if (typeof g.subtitle === 'object') {
						str = g.subtitle.map(a => icap(tr(a)).trim()).join(' · ');
					} else if (g.subtitle) {
						if (g.subtitle.startsWith(' ')) str = g.subtitle.trim();
						else str = icap(tr(g.subtitle));
					}
					defaultFont.draw(0,14,str,color, this.mat, mat);
				}
			} else {
				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+20,g.y+15,0]);
				var color = th.uiSettingsText;
				var str = icap(tr(g.title));
				defaultFont.draw(0,14,str,color, this.mat, mat);
        if (g.alt) {
          defaultFont.draw(0,0,' · '+g.alt,th.uiSettingsSubText, this.mat, mat);
        }

				mat4.identity(mat);
				mat4.translate(mat,mat, [g.x+20,g.y+15,0]);
				mat4.translate(mat,mat, [0,16+6,0]);
				mat4.scale(mat,mat, [0.75,0.75,1]);
				var color = th.uiSettingsSubText;
				var str;
				if (typeof g.subtitle === 'object') {
					str = g.subtitle.map(a => icap(tr(a))).join(' · ');
				} else if (g.subtitle) {
					if (g.subtitle.startsWith(' ')) str = g.subtitle.trim();
					else str = icap(tr(g.subtitle));
				}
				defaultFont.draw(0,14,str,color, this.mat, mat);
			}
		}
		daisychain = g.daisychain;
	}
}
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'account'
	Object.defineProperty(g, "alt", {
		get : function () { try { return icap(tr(getCurrentAccount().title)) } catch (e) {} }
	})
	g.subtitle = 'switch account'
	g.pane = accountsettings
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'language'
	g.subtitle = []
	for (var lang of enabledLangs) {
		g.subtitle.push(icap(tr(lang,lang)))
	}
	g.pane = languagesettings
	g.daisychain = true
v.gadgets.push(v.currencysettings = g = new vp.Gadget(v))
	g.title = 'currencies'
	g.subtitle = supportedCurrencies
	g.pane = currencysettings
v.gadgets.push(v.walletsettings = g = new vp.Gadget(v))
	g.title = 'wallets'
	g.subtitle = ['sales income', '(ex)change outflow'/*, 'invoice payments'*/]
	g.pane = walletsettings
	g.daisychain = true
v.gadgets.push(v.pricelistsettings = g = new vp.Gadget(v))
	g.title = 'price list'
	g.subtitle = ['link to online store']
	g.pane = pricelistsettings
	g.daisychain = true
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'QR code and barcode scanning'
	g.subtitle = ['camera selection', 'product barcodes']
	g.pane = camerasettings
/*
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'layout'
	g.subtitle = 'layout'
	g.pane = layoutsettings
	g.pane.layoutFunc = mainsettings.layoutFunc
	g.pane.renderFunc = mainsettings.renderFunc
	g.daisychain = true
*/
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'themes'
	g.subtitle = ['dark/light mode', 'colors', 'textures']
	g.pane = colorsettings
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'software license'
	g.subtitle = ['options']
	g.pane = softwarelicensesettings
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'danger zone'
	g.subtitle = 'delete data'
	g.pane = dangerzone
for (const pane of [
  maincurrency, cashcurrency, nostrmarketstall,
  salesincomewalletsettings, exchangeoutflowwalletsettings, invoicepaymentswalletsettings, appdevelopmentwalletsettings,
  accountsettings, languagesettings, currencysettings, walletsettings, pricelistsettings, camerasettings, colorsettings,
  softwarelicensesettings, readfulllicensetext, dangerzone,
]) {
	pane.layoutFunc = mainsettings.layoutFunc
	pane.renderFunc = mainsettings.renderFunc
}
