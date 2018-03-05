(function(global) {
	'use strict';
	
	var mesh = {};
	
	var position = [],
		uv = [],
		uniforms = [],
		attributes = [],
		program;
	
	var gl;

	// default shader
	var defualtFS =
		"precision highp float;\n" +
		"uniform sampler2D sampler;\n" +
		"varying vec2 v_uv;\n" +
		"varying vec4 v_color;\n" +
		"void main() {\n" +
		"vec4 tex = texture2D(sampler, v_uv);\n" +
		"gl_FragColor = tex * v_color;\n" +
		"}";
	
	var defaultVS =
		"attribute vec3 position;\n" +
		"attribute vec2 uv;\n" +
		"attribute vec4 color;\n" +
		"uniform vec2 screen;\n" +
		"varying vec2 v_uv;\n" +
		"varying vec4 v_color;\n" +
		"void main() {" +
		"v_uv = uv;\n" +
		"v_color = max(color, 0.0);\n" +
		"gl_Position = vec4(position.xy / screen.xy, 0.0, 1.0);\n" +
		"}";
	
	function getShader(src, kind) {
		var s = gl.createShader(kind);
		gl.shaderSource(s, src);
		gl.compileShader(s);
//		console.log(gl.getShaderInfoLog(s));
		return s;
	}
	
	var Font = function(max) {
		if(!max)max=256;
		this.create(max);
	};
	
	Font.init = function(context) {
		gl = context;
		var vs = getShader(defaultVS, gl.VERTEX_SHADER),
			fs = getShader(defualtFS, gl.FRAGMENT_SHADER);
		program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
	};
	
	
	Font.prototype.create = function(max) {
		var buffer = new Float32Array(max * 9 * 4),
			indexStream = new Uint16Array(max * 6),
			k = 0;
		for(var i = 0; i < max * 6; i += 6) {
			indexStream[i + 0] = k + 0;
			indexStream[i + 1] = k + 1;
			indexStream[i + 2] = k + 2;
			indexStream[i + 3] = k + 0;
			indexStream[i + 4] = k + 2;
			indexStream[i + 5] = k + 3;
			k += 4;
		}
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		var ibo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexStream, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		this.uniforms = [];
		this.uniforms[0] = gl.getUniformLocation(program, 'sampler');
		this.uniforms[1] = gl.getUniformLocation(program, 'screen');
		this.attributes = [];
		this.attributes[0] = gl.getAttribLocation(program, 'position');
		this.attributes[1] = gl.getAttribLocation(program, 'uv');
		this.attributes[2] = gl.getAttribLocation(program, 'color');
		
		this.indexStream = indexStream;
		this.buffer = buffer;

		this.ibo = ibo;
		this.vbo = vbo;
		this.context = gl;
		this.offset = 0;
		this.count = 0;
		this.dirty = true;
		this.size = [1, 1];
		this.textAlign = 'left';
		this.font = null;
		this.texture = null;
	};
	
	Font.prototype.shader = function(p) {
		if(p) {
			
		}
	};
	
	Font.prototype.setTexture = function(image) {
		if(this.texture) gl.deleteTexture(this.texture);
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	
	Font.loadFont = function(name, cb) {
	};
	Font.loadTexture = function(name, cb) {
	}
	Font.prototype.getCharacter = function(code) {
		return this.font && (code in this.font) ? this.font[code] : null;
	};
	
	Font.prototype.getTextWidth = function(text) {
		var w = 0;
		for(var i = 0; i < text.length; i++) {
			var t = text[i],
				uv = this.getCharacter(t.charCodeAt());
			if(uv) {
				w += uv.vw;
			}
		}
		return w;
	};
	
	Font.prototype.setSize = function(x, y) {
		this.size[0] = x;
		this.size[1] = y;
	}
	
	Font.prototype.textAlign = function(a) {
		this.textAlign = a;
	}

	/**
	 * draw text
	 */
	Font.prototype.drawText = function(text, x, y, color) {

		if(!this.dirty) {
			this.count = 0;
			this.offset = 0;
		}
		if(typeof text !== 'string') {
			text = '' + text;
		}
		color = color || [1, 1, 1, 1];
		var offsetX = 0,
			offsetY = 0;
		
		if(this.textAlign === 'center') {
			offsetX -= this.getTextWidth(text) * this.size[0] * 0.5;
		}
		var offset = this.offset,
			buffer = this.buffer;
		for(var i = 0; i < text.length; i++) {
			if(typeof text[i] === 'string') {
				var uv = this.getCharacter(text[i].charCodeAt());
				if(uv) {
					var vw = uv.vw * this.size[0],
						vh = uv.vh * this.size[1],
						vx = [x, x, x + vw, x + vw],
						vy = [y + vh, y, y, y + vh],
						u = [uv.u, uv.u, uv.u + uv.w, uv.u + uv.w],
						v = [uv.v + uv.h, uv.v, uv.v, uv.v + uv.h];
					
					if(text[i] === '\n') {
						offsetY -= uv.vh;
						if(this.textAlign === 'center') {
						offsetX = -(this.getTextWidth(text) * this.size[0] * 0.5);
						}else
							offsetX = -uv.vw;
					}
					
					for(var j = 0; j < 4; j++) {
						buffer[offset + 0] = vx[j] + offsetX;
						buffer[offset + 1] = vy[j] + offsetY;
						buffer[offset + 2] = 0;
						buffer[offset + 3] = u[j];
						buffer[offset + 4] = v[j];
						buffer[offset + 5] = color[0];
						buffer[offset + 6] = color[1];
						buffer[offset + 7] = color[2];
						buffer[offset + 8] = color[3];
						offset += 9;
					}
					offsetX += vw;
				}
			}
		}
		this.count += text.length;
		this.offset = offset;
		this.dirty = true;
		return offsetX;
	};
	
	/**
	 * draw
	 */
	Font.prototype.draw = function() {
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
		
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		if(this.dirty) {
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.subarray(0, this.offset));
			this.dirty = false;
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.uniforms[0], 0);
		var w = gl.canvas.width * 0.5,
			h = gl.canvas.height * 0.5;
		gl.uniform2f(this.uniforms[1], w, h);
		gl.enableVertexAttribArray(this.attributes[0]);
		gl.enableVertexAttribArray(this.attributes[1]);
		gl.enableVertexAttribArray(this.attributes[2]);
		var size = Float32Array.BYTES_PER_ELEMENT,
			stride = 9 * size;
		gl.vertexAttribPointer(this.attributes[0], 3, gl.FLOAT, false, stride, 0);
		gl.vertexAttribPointer(this.attributes[1], 2, gl.FLOAT, false, stride, 3 * size);
		gl.vertexAttribPointer(this.attributes[2], 4, gl.FLOAT, false, stride, 5 * size);
		gl.drawElements(gl.TRIANGLES, this.count * 6, gl.UNSIGNED_SHORT, 0);
	};
	
	global.Font = Font;
})(this);