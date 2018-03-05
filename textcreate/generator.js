(function(global) {
	'use strict';
	var m_call;
	var canvas = document.createElement('canvas'),
		buffer = document.createElement('canvas'),
		ctxa = canvas.getContext('2d'),
		ctxb = buffer.getContext('2d'),
		ctx = ctxa;
	canvas.width = 512;
	canvas.height = 512;
	buffer.width = canvas.width * 2;
	buffer.height = canvas.height * 2;
	var fontHeight = 40,
		fontWidth = 26,
		fontFamily = 'Arvo', //'Baumans',/*https://fonts.google.com/*/
		//テキスト
		text = '',
		mono = false, //等幅
		outline = true, //アウトライン
		outlineOffsetX = 0,
		outlineOffsetY = 0,
		outlineWidth = 2.0,
		shadow = false,
		shadowColor = '#000000',
		shadowBlur = 3.0,
		shadowOffsetX = 0,
		shadowOffsetY = 0,
		textColor = '#FFFFFF',
		outlineColor = '#849d19',
		scale = 1.0,
		ss = true,
		bold = false,
		italic = false,
		grad = true,
		endColor = '#FF7700',
		grid = false,
		baselineOffset = 0,
		marginLeft = 0,
		marginTop = 0,
		background = false,
		backgroundColor = '#000000';
	var fontRects = [];

	function setcall(call) {
		m_call = call;
	}
	function Release()
	{
		canvas = null;
		buffer = null;
		ctxa = null;
		ctxb = null;
		ctx = null;
		fontHeight = null;
		fontWidth = null;
		fontFamily = null;
		//テキスト
		text = null;
		mono = null;
		outline  = null;
		outlineOffsetX = null;
		outlineOffsetY = null;
		outlineWidth  = null;
		shadow  = null;
		shadowColor = null;
		shadowBlur = null;
		shadowOffsetX = null;
		shadowOffsetY = null;
		textColor  = null;
		outlineColor = null;
		scale = null;
		ss = null;
		bold = null;
		italic = null;
		grad = null;
		endColor = null;
		grid = null;
		baselineOffset = null;
		marginLeft = null;
		marginTop = null;
		background = null;
		backgroundColor = null;
	}
	//png
	function createFonturl() {
		var imgUrl = canvas.toDataURL("image/png");
		return imgUrl;
	}
	//json data
	function createFontRects() {
		var ff = {};
		for (var i = 0; i < fontRects.length; i++) {
			var f = {};
			f.u = fontRects[i][1];
			f.v = fontRects[i][2];
			f.w = fontRects[i][3];
			f.h = fontRects[i][4];
			f.vx = fontRects[i][5];
			f.vy = fontRects[i][6];
			f.vw = fontRects[i][7];
			f.vh = -fontRects[i][8];
			ff[fontRects[i][0]] = f;
		}
		return ff;
	}

	function opt() {
		var t = [];
		for (var i = 0; i < text.length; i++) {
			if (t.indexOf(text[i]) < 0) {
				t.push(text[i]);
			}
		}
		text = t.join('');
	}

	function loadFont(font,loaded) {
		WebFont.load({
			google: {
				families: [font]
			},
			active: function() {
				render();
				loaded();
				Release();
			},
			inactive: function() {
				console.log('inactive(not support)');
				render();
				loaded();
				Release();
			},
			fontinactive: function(fontFamily, fontDescription) {
				console.log('Do Not have fontFamily');
				Release();
			}
		});
	}

	function render() {
		ctx = ss ? ctxb : ctxa;
		ctx.save();
		if (ss) {
			ctx.scale(2.0, 2.0);
		}
		if (background) {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		var w = 0;
		if (outline) {
			w = outlineWidth;
		}
		var fontStyle = '';
		fontStyle += italic ? 'italic ' : '',
			fontStyle += bold ? 'bold ' : '',
			fontStyle += fontHeight + 'px ',
			fontStyle += fontFamily;
		ctx.font = fontStyle;
		ctx.strokeStyle = outlineColor;
		ctx.lineWidth = w;
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'center';
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		if (!mono) {
			fontWidth = ctx.measureText(text[0]).width;
		} else {
			fontWidth = 0;
			for (var j = 0; j < text.length; j++) {
				var m = ctx.measureText(text[j]).width;
				if (m > fontWidth) {
					fontWidth = m;
				}
			}
		}
		ctx.fillStyle = textColor;
		if (shadow) {
			ctx.shadowBlur = shadowBlur;
			ctx.shadowColor = shadowColor;
			ctx.shadowOffsetX = shadowOffsetX;
			ctx.shadowOffsetY = shadowOffsetY;
			w += shadowBlur * 0.5;
		}
		var offsetX = w * 0.5 + fontWidth * 0.5,
			offsetY = canvas.height - w * 0.5 - outlineOffsetY;
		if (grad) {
			var gradColor = ctx.createLinearGradient(0, offsetY - fontHeight, 0, offsetY);
			gradColor.addColorStop(0, textColor);
			gradColor.addColorStop(1, endColor);
			ctx.fillStyle = gradColor;
		}
		var prevFontWidth = fontWidth;
		var rect = [];
		var col = 0,
			row = 0;
		fontRects.length = 0;
		var fontH = fontHeight + marginTop;
		for (var i = 0; i < text.length; i++) {
			var c = text[i],
				m = ctx.measureText(c);
			if (!mono) {
				offsetX -= fontWidth * 0.5;
				offsetX += m.width * 0.5;
				fontWidth = m.width;
			}
			if (offsetX + fontWidth * 0.5 + w + marginLeft > canvas.width) {
				offsetY -= fontH + w + outlineOffsetY;
				offsetX = w * 0.5 + fontWidth * 0.5;
				if (grad) {
					var gradColor = ctx.createLinearGradient(0, offsetY - fontH, 0, offsetY);
					gradColor.addColorStop(0, textColor);
					gradColor.addColorStop(1, endColor);
					ctx.fillStyle = gradColor;
				}
				col = 0;
				row++;
			}
			offsetX += marginLeft;
			var size = {
				x: 0,
				y: 0,
				w: fontWidth + w,
				h: -(fontH + w)
			};
			var uv = {
				x: (offsetX - w * 0.5 - fontWidth * 0.5) / canvas.width,
				y: (canvas.height - (offsetY + w * 0.5)) / canvas.height + 0.01,
				w: size.w / canvas.width,
				h: (fontH + w) / canvas.height
			};
			if (grid) {
				ctx.save();
				ctx.fillStyle = (row & 1) ^ (col & 1) ? '#0F0' : '#F0F';
				ctx.fillRect(offsetX - size.w / 2, offsetY, size.w, size.h);
				ctx.restore();
			}
			if (outline) {
				ctx.strokeText(c, offsetX + outlineOffsetX, offsetY + outlineOffsetY - baselineOffset);
			}
			ctx.fillText(c, offsetX, offsetY - baselineOffset);
			col++;
			var r = [
				c.charCodeAt(), uv.x, uv.y, uv.w, uv.h,
				size.x, size.y, size.w, size.h
			];
			rect.push(r.join(','));
			fontRects.push(r);
			offsetX += fontWidth + w;
		}
		ctx.restore();
		if (ss) {
			var ctx2 = canvas.getContext('2d');
			ctx2.clearRect(0, 0, canvas.width, canvas.height);
			ctx2.drawImage(buffer, 0, 0, canvas.width, canvas.height);
		}		
	}

	//コンストラクタ
	var fontGenerator = function(t) {
		text = t;
		opt();
	};
	fontGenerator.prototype.create = function(init) {
		loadFont(fontFamily,init);
	};
	fontGenerator.prototype.createRect = function() {
		return createFontRects();
	};
	fontGenerator.prototype.createurl = function() {
		return createFonturl();
	};
	global.fontGenerator = fontGenerator;
})(this);