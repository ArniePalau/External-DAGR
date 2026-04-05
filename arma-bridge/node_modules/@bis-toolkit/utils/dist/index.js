// src/BinaryReader.ts
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

// src/Lz4.ts
function decompressLz4Block(reader, declaredSize) {
  const startPos = reader.pos;
  const targetSize = reader.readUInt32();
  const target = new Uint8Array(targetSize);
  let targetIdx = 0;
  const LzBlockSize = 65536;
  const dict = new Uint8Array(LzBlockSize);
  let dictSize = 0;
  while (true) {
    const compressedSize = reader.readInt24();
    const flags = reader.readByte();
    if ((flags & ~128) !== 0) {
      throw new Error(`Unknown LZ4 flags 0x${flags.toString(16)}`);
    }
    const compressed = reader.readBytes(compressedSize);
    const decoded = decompressLz4BlockWithDict(compressed, dict, dictSize);
    if (targetIdx + decoded.length > target.length) {
      throw new Error("Decoded LZ4 data overruns target buffer");
    }
    target.set(decoded, targetIdx);
    targetIdx += decoded.length;
    if (decoded.length >= LzBlockSize) {
      dict.set(decoded.subarray(decoded.length - LzBlockSize));
      dictSize = LzBlockSize;
    } else {
      const available = LzBlockSize - dictSize;
      if (decoded.length <= available) {
        dict.set(decoded, dictSize);
        dictSize += decoded.length;
      } else {
        const shift = decoded.length - available;
        dict.copyWithin(0, shift);
        dict.set(decoded, LzBlockSize - decoded.length);
        dictSize = LzBlockSize;
      }
    }
    if ((flags & 128) !== 0) {
      break;
    }
  }
  if (startPos + declaredSize !== reader.pos) {
    throw new Error("LZ4 block length mismatch");
  }
  if (targetIdx !== targetSize) {
    throw new Error(`LZ4 decoded size mismatch (expected ${targetSize}, got ${targetIdx})`);
  }
  return target;
}
function decompressLz4BlockWithDict(compressed, dict, dictSize) {
  const output = [];
  let src = 0;
  while (src < compressed.length) {
    const token = compressed[src++];
    let literalLength = token >> 4;
    if (literalLength === 15) {
      let len = 0;
      do {
        len = compressed[src++];
        literalLength += len;
      } while (len === 255 && src < compressed.length);
    }
    for (let i = 0; i < literalLength; i++) {
      output.push(compressed[src++]);
    }
    if (src >= compressed.length) {
      break;
    }
    const offset = compressed[src] | compressed[src + 1] << 8;
    src += 2;
    let matchLength = token & 15;
    if (matchLength === 15) {
      let len = 0;
      do {
        len = compressed[src++];
        matchLength += len;
      } while (len === 255 && src < compressed.length);
    }
    matchLength += 4;
    if (offset === 0) {
      throw new Error("Invalid LZ4 offset");
    }
    const totalAvailable = dictSize + output.length;
    if (offset > totalAvailable) {
      throw new Error("Invalid LZ4 offset");
    }
    for (let i = 0; i < matchLength; i++) {
      const backPos = output.length - offset;
      if (backPos >= 0) {
        output.push(output[backPos]);
      } else {
        const dictPos = dictSize + backPos;
        output.push(dict[dictPos]);
      }
    }
  }
  return Uint8Array.from(output);
}

// src/Lzo.ts
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
function lzoDecompressWithSize(src, expectedSize) {
  const input = src instanceof Uint8Array ? src : new Uint8Array(src);
  const result = LZO.decompressWithSize(input);
  if (result.data.length !== expectedSize) {
    throw new Error(`LZO decompression size mismatch: expected ${expectedSize}, got ${result.data.length}`);
  }
  return result;
}

// src/Lzss.ts
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
export {
  BinaryReader,
  LZO,
  calculateChecksum,
  decompressLz4Block,
  lzoDecompress,
  lzoDecompressWithSize,
  lzssDecompress
};
/**
 * LZO1X compression and decompression
 * Based on https://github.com/thaumictom/lzo-ts
 * @license GPL-3.0
 */
//# sourceMappingURL=index.js.map
