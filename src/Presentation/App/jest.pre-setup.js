// This file runs BEFORE any module loading
// This fixes Expo SDK 54's winter runtime issues
const { TextEncoder, TextDecoder, TransformStream, WritableStream, ReadableStream } = require('stream/web');

global.TextDecoderStream = TextDecoderStream;
global.TextEncoderStream = TextEncoderStream;
global.TransformStream = TransformStream;
global.WritableStream = WritableStream;
global.ReadableStream = ReadableStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Define __ExpoImportMetaRegistry to prevent the winter runtime error
global.__ExpoImportMetaRegistry = {};

// Add structuredClone polyfill
global.structuredClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

// Mock expo before any module loads
jest.mock('expo', () => ({}), { virtual: true });

// Mock AsyncStorage before any module loads
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
