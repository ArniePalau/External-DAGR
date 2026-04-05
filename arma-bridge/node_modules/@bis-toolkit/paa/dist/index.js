// src/PaaType.ts
var PaaType = /* @__PURE__ */ ((PaaType2) => {
  PaaType2[PaaType2["DXT1"] = 65281] = "DXT1";
  PaaType2[PaaType2["DXT2"] = 65282] = "DXT2";
  PaaType2[PaaType2["DXT3"] = 65283] = "DXT3";
  PaaType2[PaaType2["DXT4"] = 65284] = "DXT4";
  PaaType2[PaaType2["DXT5"] = 65285] = "DXT5";
  PaaType2[PaaType2["RGBA_5551"] = 5461] = "RGBA_5551";
  PaaType2[PaaType2["RGBA_4444"] = 17476] = "RGBA_4444";
  PaaType2[PaaType2["RGBA_8888"] = 34952] = "RGBA_8888";
  PaaType2[PaaType2["AI88"] = 32896] = "AI88";
  return PaaType2;
})(PaaType || {});

// src/PaaColor.ts
var PaaColor = class _PaaColor {
  constructor(valueOrRed, green, blue, alpha = 255) {
    if (green === void 0) {
      this._value = valueOrRed >>> 0;
    } else {
      this._value = _PaaColor.colorToUint(valueOrRed, green, blue ?? 0, alpha ?? 0);
    }
  }
  get alpha() {
    return this._value >>> 24 & 255;
  }
  get red() {
    return this._value >>> 16 & 255;
  }
  get green() {
    return this._value >>> 8 & 255;
  }
  get blue() {
    return this._value & 255;
  }
  get color() {
    return this._value;
  }
  static colorToUint(r, g, b, a) {
    return (a << 24 | r << 16 | g << 8 | b) >>> 0;
  }
  static fromFloat(red, green, blue, alpha) {
    return new _PaaColor(
      Math.floor(red * 255),
      Math.floor(green * 255),
      Math.floor(blue * 255),
      Math.floor(alpha * 255)
    );
  }
};

// src/Palette.ts
var Palette = class {
  constructor() {
    this.colors = [];
  }
  read(br) {
    const nPaletteTriplets = br.readUInt16();
    this.colors = [];
    for (let i = 0; i < nPaletteTriplets; i++) {
      const b = br.readByte();
      const g = br.readByte();
      const r = br.readByte();
      this.colors.push(new PaaColor(r, g, b));
    }
  }
};

// ../utils/dist/index.js
var BinaryReader = class {
  constructor(buffer) {
    this.position = 0;
    this.buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }
  get length() {
    return this.buffer.length;
  }
  get pos() {
    return this.position;
  }
  seek(offset, origin = "begin") {
    switch (origin) {
      case "begin":
        this.position = offset;
        break;
      case "current":
        this.position += offset;
        break;
      case "end":
        this.position = this.buffer.length + offset;
        break;
    }
  }
  readByte() {
    const value = this.view.getUint8(this.position);
    this.position += 1;
    return value;
  }
  readUInt16() {
    const value = this.view.getUint16(this.position, true);
    this.position += 2;
    return value;
  }
  readUInt32() {
    const value = this.view.getUint32(this.position, true);
    this.position += 4;
    return value;
  }
  readInt32() {
    const value = this.view.getInt32(this.position, true);
    this.position += 4;
    return value;
  }
  readInt24() {
    const b1 = this.view.getUint8(this.position);
    const b2 = this.view.getUint8(this.position + 1);
    const b3 = this.view.getUint8(this.position + 2);
    this.position += 3;
    return b1 | b2 << 8 | b3 << 16;
  }
  readBytes(count) {
    const bytes = this.buffer.subarray(this.position, this.position + count);
    this.position += count;
    return bytes;
  }
  readRawString(length) {
    const bytes = this.buffer.subarray(this.position, this.position + length);
    this.position += length;
    return String.fromCharCode(...bytes);
  }
  readFloat() {
    const value = this.view.getFloat32(this.position, true);
    this.position += 4;
    return value;
  }
  readBoolean() {
    return this.readByte() !== 0;
  }
  /**
   * Read a null-terminated C-style string
   */
  readCString() {
    const start = this.position;
    let end = start;
    while (end < this.buffer.length && this.buffer[end] !== 0) {
      end++;
    }
    const bytes = this.buffer.subarray(start, end);
    this.position = end + 1;
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  }
  /**
   * Alias for readRawString for compatibility
   */
  readString(length) {
    return this.readRawString(length);
  }
};
var LZO = class _LZO {
  constructor() {
    this._blockSize = 128 * 1024;
    this._minNewSize = this.blockSize;
    this._out = new Uint8Array(256 * 1024);
    this._cbl = 0;
    this._t = 0;
    this._inputPointer = 0;
    this._outputPointer = 0;
    this._matchPosition = 0;
    this._skipToFirstLiteralFunc = false;
  }
  get blockSize() {
    return this._blockSize;
  }
  set blockSize(value) {
    if (value <= 0) throw new Error("Block size must be a positive integer");
    this._blockSize = value;
  }
  _extendBuffer() {
    const newBuffer = new Uint8Array(
      this._minNewSize + (this.blockSize - this._minNewSize % this.blockSize)
    );
    newBuffer.set(this._out);
    this._out = newBuffer;
    this._cbl = this._out.length;
  }
  _matchNext() {
    this._minNewSize = this._outputPointer + 3;
    if (this._minNewSize > this._cbl) this._extendBuffer();
    this._out[this._outputPointer++] = this._buffer[this._inputPointer++];
    if (this._t > 1) {
      this._out[this._outputPointer++] = this._buffer[this._inputPointer++];
      if (this._t > 2) {
        this._out[this._outputPointer++] = this._buffer[this._inputPointer++];
      }
    }
    this._t = this._buffer[this._inputPointer++];
  }
  _matchDone() {
    this._t = this._buffer[this._inputPointer - 2] & 3;
    return this._t;
  }
  _copyMatch() {
    this._t += 2;
    this._minNewSize = this._outputPointer + this._t;
    if (this._minNewSize > this._cbl) {
      this._extendBuffer();
    }
    do {
      this._out[this._outputPointer++] = this._out[this._matchPosition++];
    } while (--this._t > 0);
  }
  _copyFromBuffer() {
    this._minNewSize = this._outputPointer + this._t;
    if (this._minNewSize > this._cbl) {
      this._extendBuffer();
    }
    do {
      this._out[this._outputPointer++] = this._buffer[this._inputPointer++];
    } while (--this._t > 0);
  }
  _match() {
    while (true) {
      if (this._t >= 64) {
        this._matchPosition = this._outputPointer - 1 - (this._t >> 2 & 7) - (this._buffer[this._inputPointer++] << 3);
        this._t = (this._t >> 5) - 1;
        this._copyMatch();
      } else if (this._t >= 32) {
        this._t &= 31;
        if (this._t === 0) {
          while (this._buffer[this._inputPointer] === 0) {
            this._t += 255;
            this._inputPointer++;
          }
          this._t += 31 + this._buffer[this._inputPointer++];
        }
        this._matchPosition = this._outputPointer - 1 - (this._buffer[this._inputPointer] >> 2) - (this._buffer[this._inputPointer + 1] << 6);
        this._inputPointer += 2;
        this._copyMatch();
      } else if (this._t >= 16) {
        this._matchPosition = this._outputPointer - ((this._t & 8) << 11);
        this._t &= 7;
        if (this._t === 0) {
          while (this._buffer[this._inputPointer] === 0) {
            this._t += 255;
            this._inputPointer++;
          }
          this._t += 7 + this._buffer[this._inputPointer++];
        }
        this._matchPosition -= (this._buffer[this._inputPointer] >> 2) + (this._buffer[this._inputPointer + 1] << 6);
        this._inputPointer += 2;
        if (this._matchPosition === this._outputPointer) {
          return this._out.subarray(0, this._outputPointer);
        } else {
          this._matchPosition -= 16384;
          this._copyMatch();
        }
      } else {
        this._matchPosition = this._outputPointer - 1 - (this._t >> 2) - (this._buffer[this._inputPointer++] << 2);
        this._minNewSize = this._outputPointer + 2;
        if (this._minNewSize > this._cbl) {
          this._extendBuffer();
        }
        this._out[this._outputPointer++] = this._out[this._matchPosition++];
        this._out[this._outputPointer++] = this._out[this._matchPosition];
      }
      if (this._matchDone() === 0) {
        return true;
      }
      this._matchNext();
    }
  }
  _decompressBuffer(buffer) {
    this._buffer = buffer;
    this._cbl = this._out.length;
    this._t = 0;
    this._inputPointer = 0;
    this._outputPointer = 0;
    this._matchPosition = 0;
    this._skipToFirstLiteralFunc = false;
    if (this._buffer[this._inputPointer] > 17) {
      this._t = this._buffer[this._inputPointer++] - 17;
      if (this._t < 4) {
        this._matchNext();
        const matched = this._match();
        if (matched !== true) return matched;
      } else {
        this._copyFromBuffer();
        this._skipToFirstLiteralFunc = true;
      }
    }
    while (true) {
      if (!this._skipToFirstLiteralFunc) {
        this._t = this._buffer[this._inputPointer++];
        if (this._t >= 16) {
          const matched2 = this._match();
          if (matched2 !== true) return matched2;
          continue;
        } else if (this._t === 0) {
          while (this._buffer[this._inputPointer] === 0) {
            this._t += 255;
            this._inputPointer++;
          }
          this._t += 15 + this._buffer[this._inputPointer++];
        }
        this._t += 3;
        this._copyFromBuffer();
      } else this._skipToFirstLiteralFunc = false;
      this._t = this._buffer[this._inputPointer++];
      if (this._t < 16) {
        this._matchPosition = this._outputPointer - (1 + 2048);
        this._matchPosition -= this._t >> 2;
        this._matchPosition -= this._buffer[this._inputPointer++] << 2;
        this._minNewSize = this._outputPointer + 3;
        if (this._minNewSize > this._cbl) {
          this._extendBuffer();
        }
        this._out[this._outputPointer++] = this._out[this._matchPosition++];
        this._out[this._outputPointer++] = this._out[this._matchPosition++];
        this._out[this._outputPointer++] = this._out[this._matchPosition];
        if (this._matchDone() === 0) continue;
        else this._matchNext();
      }
      const matched = this._match();
      if (matched !== true) return matched;
    }
  }
  /**
   * Decompresses the given buffer using the LZO1X-1 algorithm.
   * @param buffer The buffer to decompress.
   * @returns The decompressed buffer.
   */
  static decompress(buffer) {
    return new _LZO()._decompressBuffer(buffer);
  }
  /**
   * Decompresses the given buffer and returns both the decompressed data and bytes read.
   * @param buffer The buffer to decompress.
   * @returns Object containing decompressed data and number of bytes consumed from input.
   */
  static decompressWithSize(buffer) {
    const lzo = new _LZO();
    const decompressed = lzo._decompressBuffer(buffer);
    return {
      data: decompressed,
      bytesRead: lzo._inputPointer
    };
  }
};
function lzoDecompress(src, expectedSize) {
  const input = src instanceof Uint8Array ? src : new Uint8Array(src);
  const decompressed = LZO.decompress(input);
  if (decompressed.length !== expectedSize) {
    throw new Error(`LZO decompression size mismatch: expected ${expectedSize}, got ${decompressed.length}`);
  }
  return decompressed;
}
var N = 4096;
var F = 18;
var THRESHOLD = 2;
function lzssDecompress(input, inputOffset, expectedSize, useSignedChecksum = false) {
  const buffer = new Array(N + F - 1);
  const dst = new Uint8Array(expectedSize);
  if (expectedSize <= 0) {
    return { data: new Uint8Array(0), bytesRead: 0 };
  }
  const startPos = inputOffset;
  let inPos = inputOffset;
  let iDst = 0;
  let calculatedChecksum = 0;
  let r = N - F;
  for (let i = 0; i < r; i++) {
    buffer[i] = 32;
  }
  let flags = 0;
  while (expectedSize > 0) {
    if (((flags >>>= 1) & 256) === 0) {
      const c = input[inPos++];
      flags = c | 65280;
    }
    if ((flags & 1) !== 0) {
      const c = input[inPos++];
      calculatedChecksum = calculatedChecksum + (useSignedChecksum ? c << 24 >> 24 : c) | 0;
      dst[iDst++] = c;
      expectedSize--;
      buffer[r] = c;
      r = r + 1 & N - 1;
    } else {
      const i = input[inPos++];
      const j = input[inPos++];
      const offset = i | (j & 240) << 4;
      const length = (j & 15) + THRESHOLD;
      if (length + 1 > expectedSize + length - THRESHOLD) {
        throw new Error("LZSS overflow");
      }
      let ii = r - offset;
      const jj = length + ii;
      for (; ii <= jj; ii++) {
        const c = buffer[ii & N - 1];
        calculatedChecksum = calculatedChecksum + (useSignedChecksum ? c << 24 >> 24 : c) | 0;
        dst[iDst++] = c;
        expectedSize--;
        buffer[r] = c;
        r = r + 1 & N - 1;
      }
    }
  }
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const checksum = view.getInt32(inPos, true);
  inPos += 4;
  if (checksum !== calculatedChecksum) {
    throw new Error(`Checksum mismatch: expected ${checksum}, got ${calculatedChecksum}`);
  }
  return {
    data: dst,
    bytesRead: inPos - startPos
  };
}
function calculateChecksum(data, signed = false) {
  let checksum = 0;
  for (const byte of data) {
    checksum = checksum + (signed ? byte << 24 >> 24 : byte) | 0;
  }
  return checksum;
}

// ../bcn/dist/index.js
var ColorRgb565 = class {
  constructor(r, g, b) {
    if (r !== void 0 && g !== void 0 && b !== void 0) {
      const r5 = r >> 3 & 31;
      const g6 = g >> 2 & 63;
      const b5 = b >> 3 & 31;
      this.data = r5 << 11 | g6 << 5 | b5;
    } else {
      this.data = 0;
    }
  }
  toColorRgb24() {
    const r5 = this.data >> 11 & 31;
    const g6 = this.data >> 5 & 63;
    const b5 = this.data & 31;
    const r = r5 << 3 | r5 >> 2;
    const g = g6 << 2 | g6 >> 4;
    const b = b5 << 3 | b5 >> 2;
    return { r, g, b };
  }
};
function interpolateHalf(c0, c1) {
  return {
    r: (c0.r + c1.r) / 2 | 0,
    g: (c0.g + c1.g) / 2 | 0,
    b: (c0.b + c1.b) / 2 | 0
  };
}
function interpolateThird(c0, c1, step) {
  if (step === 1) {
    return {
      r: (2 * c0.r + c1.r) / 3 | 0,
      g: (2 * c0.g + c1.g) / 3 | 0,
      b: (2 * c0.b + c1.b) / 3 | 0
    };
  } else {
    return {
      r: (c0.r + 2 * c1.r) / 3 | 0,
      g: (c0.g + 2 * c1.g) / 3 | 0,
      b: (c0.b + 2 * c1.b) / 3 | 0
    };
  }
}
function interpolateByteFifth(e0, e1, step) {
  if (step === 1) return (4 * e0 + e1) / 5 | 0;
  if (step === 2) return (3 * e0 + 2 * e1) / 5 | 0;
  if (step === 3) return (2 * e0 + 3 * e1) / 5 | 0;
  return (e0 + 4 * e1) / 5 | 0;
}
function interpolateByteSeventh(e0, e1, step) {
  if (step === 1) return (6 * e0 + e1) / 7 | 0;
  if (step === 2) return (5 * e0 + 2 * e1) / 7 | 0;
  if (step === 3) return (4 * e0 + 3 * e1) / 7 | 0;
  if (step === 4) return (3 * e0 + 4 * e1) / 7 | 0;
  if (step === 5) return (2 * e0 + 5 * e1) / 7 | 0;
  return (e0 + 6 * e1) / 7 | 0;
}
function decodeBC1(data, width, height, useAlpha = false) {
  const rgba = new Uint8Array(width * height * 4);
  const blocksX = Math.ceil(width / 4);
  const blocksY = Math.ceil(height / 4);
  let offset = 0;
  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const color0Data = data.getUint16(offset, true);
      const color1Data = data.getUint16(offset + 2, true);
      const indices = data.getUint32(offset + 4, true);
      const color0 = new ColorRgb565();
      color0.data = color0Data;
      const color1 = new ColorRgb565();
      color1.data = color1Data;
      const c0 = color0.toColorRgb24();
      const c1 = color1.toColorRgb24();
      const hasAlphaOrBlack = color0Data <= color1Data;
      const actualUseAlpha = useAlpha && hasAlphaOrBlack;
      const colors = hasAlphaOrBlack ? [
        c0,
        c1,
        interpolateHalf(c0, c1),
        { r: 0, g: 0, b: 0 }
      ] : [
        c0,
        c1,
        interpolateThird(c0, c1, 1),
        interpolateThird(c0, c1, 2)
      ];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const px = bx * 4 + x;
          const py = by * 4 + y;
          if (px < width && py < height) {
            const i = y * 4 + x;
            const colorIndex = indices >> i * 2 & 3;
            const color = colors[colorIndex];
            const dstIdx = (py * width + px) * 4;
            if (actualUseAlpha && colorIndex === 3) {
              rgba[dstIdx] = 0;
              rgba[dstIdx + 1] = 0;
              rgba[dstIdx + 2] = 0;
              rgba[dstIdx + 3] = 0;
            } else {
              rgba[dstIdx] = color.r;
              rgba[dstIdx + 1] = color.g;
              rgba[dstIdx + 2] = color.b;
              rgba[dstIdx + 3] = 255;
            }
          }
        }
      }
      offset += 8;
    }
  }
  return rgba;
}
function decodeBC2(data, width, height) {
  const rgba = new Uint8Array(width * height * 4);
  const blocksX = Math.ceil(width / 4);
  const blocksY = Math.ceil(height / 4);
  let offset = 0;
  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const alphaLow = data.getUint32(offset, true);
      const alphaHigh = data.getUint32(offset + 4, true);
      const color0Data = data.getUint16(offset + 8, true);
      const color1Data = data.getUint16(offset + 10, true);
      const indices = data.getUint32(offset + 12, true);
      const color0 = new ColorRgb565();
      color0.data = color0Data;
      const color1 = new ColorRgb565();
      color1.data = color1Data;
      const c0 = color0.toColorRgb24();
      const c1 = color1.toColorRgb24();
      const colors = [
        c0,
        c1,
        interpolateThird(c0, c1, 1),
        interpolateThird(c0, c1, 2)
      ];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const px = bx * 4 + x;
          const py = by * 4 + y;
          if (px < width && py < height) {
            const i = y * 4 + x;
            const colorIndex = indices >> i * 2 & 3;
            const color = colors[colorIndex];
            const alphaIndex = i * 4;
            let alpha;
            if (alphaIndex < 32) {
              alpha = alphaLow >> alphaIndex & 15;
            } else {
              alpha = alphaHigh >> alphaIndex - 32 & 15;
            }
            alpha = alpha << 4 | alpha;
            const dstIdx = (py * width + px) * 4;
            rgba[dstIdx] = color.r;
            rgba[dstIdx + 1] = color.g;
            rgba[dstIdx + 2] = color.b;
            rgba[dstIdx + 3] = alpha;
          }
        }
      }
      offset += 16;
    }
  }
  return rgba;
}
function decodeAlphaBlock(alphaData) {
  const alpha = new Array(16);
  const alpha0 = Number(alphaData & 0xFFn);
  const alpha1 = Number(alphaData >> 8n & 0xFFn);
  const alphas = alpha0 > alpha1 ? [
    alpha0,
    alpha1,
    interpolateByteSeventh(alpha0, alpha1, 1),
    interpolateByteSeventh(alpha0, alpha1, 2),
    interpolateByteSeventh(alpha0, alpha1, 3),
    interpolateByteSeventh(alpha0, alpha1, 4),
    interpolateByteSeventh(alpha0, alpha1, 5),
    interpolateByteSeventh(alpha0, alpha1, 6)
  ] : [
    alpha0,
    alpha1,
    interpolateByteFifth(alpha0, alpha1, 1),
    interpolateByteFifth(alpha0, alpha1, 2),
    interpolateByteFifth(alpha0, alpha1, 3),
    interpolateByteFifth(alpha0, alpha1, 4),
    0,
    255
  ];
  for (let i = 0; i < 16; i++) {
    const bitOffset = 16 + i * 3;
    const index = Number(alphaData >> BigInt(bitOffset) & 0x7n);
    alpha[i] = alphas[index];
  }
  return alpha;
}
function decodeBC3(data, width, height) {
  const rgba = new Uint8Array(width * height * 4);
  const blocksX = Math.ceil(width / 4);
  const blocksY = Math.ceil(height / 4);
  let offset = 0;
  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const alphaBlock = data.getBigUint64(offset, true);
      const alphas = decodeAlphaBlock(alphaBlock);
      const color0Data = data.getUint16(offset + 8, true);
      const color1Data = data.getUint16(offset + 10, true);
      const indices = data.getUint32(offset + 12, true);
      const color0 = new ColorRgb565();
      color0.data = color0Data;
      const color1 = new ColorRgb565();
      color1.data = color1Data;
      const c0 = color0.toColorRgb24();
      const c1 = color1.toColorRgb24();
      const colors = [
        c0,
        c1,
        interpolateThird(c0, c1, 1),
        interpolateThird(c0, c1, 2)
      ];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const px = bx * 4 + x;
          const py = by * 4 + y;
          if (px < width && py < height) {
            const i = y * 4 + x;
            const colorIndex = indices >> i * 2 & 3;
            const color = colors[colorIndex];
            const dstIdx = (py * width + px) * 4;
            rgba[dstIdx] = color.r;
            rgba[dstIdx + 1] = color.g;
            rgba[dstIdx + 2] = color.b;
            rgba[dstIdx + 3] = alphas[i];
          }
        }
      }
      offset += 16;
    }
  }
  return rgba;
}

// src/FormatConverter.ts
var PixelFormatConversion = class {
  static setColor(img, offset, a, r, g, b) {
    img[offset] = b;
    img[offset + 1] = g;
    img[offset + 2] = r;
    img[offset + 3] = a;
  }
  static argb16ToArgb32(src) {
    const dst = new Uint8Array(src.length * 2);
    const nPixel = Math.floor(src.length / 2);
    for (let index = 0; index < nPixel; index++) {
      const hbyte = src[index * 2 + 1];
      const lbyte = src[index * 2];
      const lhbyte = hbyte & 15;
      const hhbyte = (hbyte & 240) >> 4;
      const llbyte = lbyte & 15;
      const hlbyte = (lbyte & 240) >> 4;
      const b = Math.floor(lhbyte * 255 / 15);
      const a = Math.floor(hhbyte * 255 / 15);
      const r = Math.floor(llbyte * 255 / 15);
      const g = Math.floor(hlbyte * 255 / 15);
      this.setColor(dst, index * 4, a, r, g, b);
    }
    return dst;
  }
  static argb1555ToArgb32(src) {
    const dst = new Uint8Array(src.length * 2);
    const nPixel = Math.floor(src.length / 2);
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    for (let index = 0; index < nPixel; index++) {
      const s = view.getUint16(index * 2, true);
      const abit = (s & 32768) >> 15 === 1;
      const b5bit = s & 31;
      const g5bit = (s & 992) >> 5;
      const r5bit = (s & 31744) >> 10;
      const b = Math.floor(b5bit * 255 / 31);
      const a = abit ? 255 : 0;
      const r = Math.floor(r5bit * 255 / 31);
      const g = Math.floor(g5bit * 255 / 31);
      this.setColor(dst, index * 4, a, r, g, b);
    }
    return dst;
  }
  static ai88ToArgb32(src) {
    const dst = new Uint8Array(src.length * 2);
    const nPixel = Math.floor(src.length / 2);
    for (let index = 0; index < nPixel; index++) {
      const grey = src[index * 2];
      const alpha = src[index * 2 + 1];
      this.setColor(dst, index * 4, alpha, grey, grey, grey);
    }
    return dst;
  }
  static p8ToARGB32(src, palette) {
    const dst = new Uint8Array(src.length * 4);
    const colors = palette.colors;
    const nPixel = src.length;
    for (let index = 0; index < nPixel; index++) {
      const color = colors[src[index]];
      this.setColor(dst, index * 4, color.alpha, color.red, color.green, color.blue);
    }
    return dst;
  }
  static dxtToRgba32(data, width, height, format, useAlpha = true) {
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let rgba;
    switch (format) {
      case "BC1":
        rgba = decodeBC1(dataView, width, height, useAlpha);
        break;
      case "BC2":
        rgba = decodeBC2(dataView, width, height);
        break;
      case "BC3":
        rgba = decodeBC3(dataView, width, height);
        break;
      default:
        throw new Error(`Unsupported DXT format: ${format}`);
    }
    const bgra = new Uint8Array(rgba.length);
    for (let i = 0; i < rgba.length; i += 4) {
      bgra[i] = rgba[i + 2];
      bgra[i + 1] = rgba[i + 1];
      bgra[i + 2] = rgba[i];
      bgra[i + 3] = rgba[i + 3];
    }
    return bgra;
  }
  static convertToARGB32(data, width, height, type) {
    switch (type) {
      case 65281 /* DXT1 */:
        return this.dxtToRgba32(data, width, height, "BC1");
      case 65282 /* DXT2 */:
        return this.dxtToRgba32(data, width, height, "BC2");
      case 65283 /* DXT3 */:
        return this.dxtToRgba32(data, width, height, "BC2");
      case 65284 /* DXT4 */:
        return this.dxtToRgba32(data, width, height, "BC3");
      case 65285 /* DXT5 */:
        return this.dxtToRgba32(data, width, height, "BC3");
      case 5461 /* RGBA_5551 */:
        return this.argb1555ToArgb32(data);
      case 17476 /* RGBA_4444 */:
        return this.argb16ToArgb32(data);
      case 32896 /* AI88 */:
        return this.ai88ToArgb32(data);
      case 34952 /* RGBA_8888 */:
        return data instanceof Uint8Array ? data : new Uint8Array(data);
      default:
        throw new Error(`Unsupported PaaType: ${String(type)}`);
    }
  }
};

// src/Mipmap.ts
var Mipmap = class {
  constructor(formatOrWidth, height, data, format) {
    this.width = 0;
    this.height = 0;
    this.isLzss = false;
    this.isLzo = false;
    this.dataOffset = 0;
    this.dataSize = 0;
    this.rawData = null;
    if (height !== void 0 && data !== void 0 && format !== void 0) {
      this.width = formatOrWidth;
      this.height = height;
      this.format = format;
      if (this.width * this.height > 16384) {
        this.isLzo = true;
      }
      this.dataOffset = -1;
      if (this.isLzo) {
        this.rawData = data instanceof Uint8Array ? data : data;
        this.dataSize = this.rawData?.length ?? 0;
      } else {
        this.rawData = data instanceof Uint8Array ? data : data;
        this.dataSize = data?.length ?? 0;
      }
    } else {
      this.format = formatOrWidth;
    }
  }
  read(br) {
    this.width = br.readUInt16();
    this.height = br.readUInt16();
    if (this.width === 1234 && this.height === 8765) {
      this.width = br.readUInt16();
      this.height = br.readUInt16();
      this.isLzss = true;
    }
    if ((this.width & 32768) !== 0) {
      this.width &= 32767;
      this.isLzo = true;
    }
    this.dataSize = br.readInt24();
    this.dataOffset = br.pos;
    br.seek(this.dataSize, "current");
  }
  getRawPixelData(buffer) {
    if (this.dataOffset === -1) {
      throw new Error("Data offset is not set");
    }
    const br = new BinaryReader(buffer);
    br.seek(this.dataOffset);
    let uncompressedSize = this.width * this.height;
    switch (this.format) {
      case 65281 /* DXT1 */:
        uncompressedSize = Math.floor(uncompressedSize / 2);
      // Fall through
      case 65282 /* DXT2 */:
      case 65283 /* DXT3 */:
      case 65284 /* DXT4 */:
      case 65285 /* DXT5 */:
        if (!this.isLzo) {
          uncompressedSize = this.dataSize;
        }
        break;
      case 5461 /* RGBA_5551 */:
      case 17476 /* RGBA_4444 */:
      case 32896 /* AI88 */:
        uncompressedSize *= 2;
        this.isLzss = uncompressedSize > 1023;
        break;
      case 34952 /* RGBA_8888 */:
        uncompressedSize *= 4;
        break;
    }
    if (this.isLzo) {
      const compressedData = br.readBytes(this.dataSize);
      return lzoDecompress(compressedData, uncompressedSize);
    }
    if (!this.isLzss) {
      return br.readBytes(this.dataSize);
    }
    const result = lzssDecompress(buffer, br.pos, uncompressedSize, false);
    br.seek(result.bytesRead, "current");
    return result.data;
  }
  getRgba32PixelData(buffer) {
    const data = this.getRawPixelData(buffer);
    return PixelFormatConversion.convertToARGB32(data, this.width, this.height, this.format);
  }
};

// src/ChannelSwizzler.ts
var ChannelSwizzle = /* @__PURE__ */ ((ChannelSwizzle3) => {
  ChannelSwizzle3[ChannelSwizzle3["Alpha"] = 0] = "Alpha";
  ChannelSwizzle3[ChannelSwizzle3["Red"] = 1] = "Red";
  ChannelSwizzle3[ChannelSwizzle3["Green"] = 2] = "Green";
  ChannelSwizzle3[ChannelSwizzle3["Blue"] = 3] = "Blue";
  ChannelSwizzle3[ChannelSwizzle3["InvertedAlpha"] = 4] = "InvertedAlpha";
  ChannelSwizzle3[ChannelSwizzle3["InvertedRed"] = 5] = "InvertedRed";
  ChannelSwizzle3[ChannelSwizzle3["InvertedGreen"] = 6] = "InvertedGreen";
  ChannelSwizzle3[ChannelSwizzle3["InvertedBlue"] = 7] = "InvertedBlue";
  ChannelSwizzle3[ChannelSwizzle3["One"] = 8] = "One";
  return ChannelSwizzle3;
})(ChannelSwizzle || {});
var _RgbaSwizzle = class _RgbaSwizzle {
  constructor() {
    this.swizBlue = 3 /* Blue */;
    this.swizGreen = 2 /* Green */;
    this.swizRed = 1 /* Red */;
    this.swizAlpha = 0 /* Alpha */;
  }
  equals(other) {
    return this.swizBlue === other.swizBlue && this.swizGreen === other.swizGreen && this.swizRed === other.swizRed && this.swizAlpha === other.swizAlpha;
  }
};
_RgbaSwizzle.Default = new _RgbaSwizzle();
var RgbaSwizzle = _RgbaSwizzle;
var ChannelSwizzler = class {
  static apply(rgbaData, swizzle) {
    if (swizzle.equals(RgbaSwizzle.Default)) {
      return;
    }
    for (let pixOffset = 0; pixOffset < rgbaData.length; pixOffset += 4) {
      const pixel = (rgbaData[pixOffset + 2] | // Red at bit 0
      rgbaData[pixOffset + 1] << 8 | // Green at bit 8
      rgbaData[pixOffset] << 16 | // Blue at bit 16
      rgbaData[pixOffset + 3] << 24) >>> 0;
      rgbaData[pixOffset + 2] = this.transformChannel(pixel, swizzle.swizRed);
      rgbaData[pixOffset + 1] = this.transformChannel(pixel, swizzle.swizGreen);
      rgbaData[pixOffset + 0] = this.transformChannel(pixel, swizzle.swizBlue);
      rgbaData[pixOffset + 3] = this.transformChannel(pixel, swizzle.swizAlpha);
    }
  }
  static transformChannel(pixel, swizzle) {
    if (swizzle === 8 /* One */) {
      return 255;
    }
    const isInverted = swizzle >= 4 /* InvertedAlpha */ && swizzle <= 7 /* InvertedBlue */;
    if (isInverted) {
      swizzle = swizzle - 4 /* InvertedAlpha */ + 0 /* Alpha */;
    }
    let offset;
    switch (swizzle) {
      case 1 /* Red */:
        offset = 0;
        break;
      case 2 /* Green */:
        offset = 8;
        break;
      case 3 /* Blue */:
        offset = 16;
        break;
      case 0 /* Alpha */:
        offset = 24;
        break;
      default:
        throw new Error(`Invalid swizzle: ${swizzle}`);
    }
    const result = pixel >>> offset & 255;
    return isInverted ? 255 - result : result;
  }
};

// src/Paa.ts
var Paa = class {
  constructor() {
    this.type = 65285 /* DXT5 */;
    this.isAlpha = false;
    this.isTransparent = false;
    this.averageColor = null;
    this.maxColor = null;
    this.palette = new Palette();
    this.mipmaps = [];
    this.channelSwizzle = RgbaSwizzle.Default;
    this.procedure = "";
  }
  /**
   * Read a PAA file from a buffer
   */
  read(buffer) {
    const br = new BinaryReader(buffer);
    this.type = br.readUInt16();
    let mipMapOffsets = null;
    while (br.readRawString(4) === "GGAT") {
      const name = br.readRawString(4).split("").reverse().join("");
      const len = br.readInt32();
      switch (name) {
        case "AVGC":
          this.averageColor = new PaaColor(br.readUInt32());
          break;
        case "MAXC":
          this.maxColor = new PaaColor(br.readUInt32());
          break;
        case "FLAG":
          const flag = br.readInt32();
          if ((flag & 1) !== 0) {
            this.isAlpha = true;
          }
          if ((flag & 2) !== 0) {
            this.isTransparent = true;
          }
          break;
        case "SWIZ":
          this.channelSwizzle = new RgbaSwizzle();
          this.channelSwizzle.swizAlpha = br.readByte();
          this.channelSwizzle.swizRed = br.readByte();
          this.channelSwizzle.swizGreen = br.readByte();
          this.channelSwizzle.swizBlue = br.readByte();
          break;
        case "PROC":
          this.procedure = br.readRawString(len);
          break;
        case "OFFS":
          const nOffsets = Math.floor(len / 4);
          mipMapOffsets = [];
          for (let i = 0; i < nOffsets; i++) {
            mipMapOffsets.push(br.readUInt32());
          }
          break;
        default:
          throw new Error(`Got unknown tag: ${name}`);
      }
    }
    br.seek(-4, "current");
    this.palette.read(br);
    this.mipmaps = [];
    if (mipMapOffsets !== null) {
      for (const mipMapOffset of mipMapOffsets) {
        if (mipMapOffset === 0) {
          break;
        }
        br.seek(mipMapOffset, "begin");
        const mipmap = new Mipmap(this.type);
        mipmap.read(br);
        this.mipmaps.push(mipmap);
      }
    }
    const terminator = br.readUInt16();
    if (terminator !== 0) {
      throw new Error("Invalid format: terminator bytes not found");
    }
  }
  /**
   * Get ARGB32 pixel data for a specific mipmap level
   */
  getArgb32PixelData(buffer, mipLevel = 0) {
    if (mipLevel < 0 || mipLevel >= this.mipmaps.length) {
      throw new RangeError(`mipLevel ${mipLevel} out of range`);
    }
    const data = this.mipmaps[mipLevel].getRgba32PixelData(buffer);
    ChannelSwizzler.apply(data, this.channelSwizzle);
    return data;
  }
};
export {
  BinaryReader,
  ChannelSwizzle,
  ChannelSwizzler,
  Mipmap,
  Paa,
  PaaColor,
  PaaType,
  Palette,
  PixelFormatConversion,
  RgbaSwizzle,
  calculateChecksum,
  lzoDecompress,
  lzssDecompress
};
/**
 * LZO1X compression and decompression
 * Based on https://github.com/thaumictom/lzo-ts
 * @license GPL-3.0
 */
//# sourceMappingURL=index.js.map
