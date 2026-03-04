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

// Import RNTL matchers - this adds all Jest matchers automatically
import '@testing-library/react-native';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const { View, Text, Pressable, ScrollView, Image, Animated } = require('react-native');
    return {
        default: {
            call: jest.fn(),
            createAnimatedComponent: (component) => component,
            Value: jest.fn(),
            event: jest.fn(),
            add: jest.fn(),
            View: Animated.View,
            Text: Animated.Text,
            ScrollView: Animated.ScrollView,
            Image: Animated.Image,
        },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
        withTiming: jest.fn(),
        withSpring: jest.fn(),
        withDelay: jest.fn(),
        View: Animated.View,
        Text: Animated.Text,
    };
});

// Mock @/tw module - NativeWind components
jest.mock('@/tw', () => {
    const { View, Text, Pressable, ScrollView, Image, TextInput } = require('react-native');
    return {
        View,
        Text,
        Pressable,
        ScrollView,
        Image,
        TextInput,
    };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        gestureHandlerRootHOC: jest.fn(),
        Directions: {},
        PanResponder: {
            create: jest.fn(() => ({
                panHandlers: {},
            })),
        },
    };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {},
    }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Mock useRemoteCommands hook
jest.mock('@/hooks/use-remote-commands', () => ({
    useRemoteCommands: () => ({
        sendNavigation: jest.fn(),
        sendMediaCommand: jest.fn(),
        sendVolumeCommand: jest.fn(),
        sendChannelCommand: jest.fn(),
        sendCommand: jest.fn(),
        powerToggle: jest.fn(),
        goHome: jest.fn(),
        goBack: jest.fn(),
        openMenu: jest.fn(),
        showInfo: jest.fn(),
    }),
}));

// Mock useTVConnection hook
jest.mock('@/hooks/use-tv-connection', () => ({
    useTVConnection: () => ({
        connectionState: 'disconnected',
        tvInfo: null,
        isConnected: false,
        isConnecting: false,
        connectToTV: jest.fn(),
        disconnectFromTV: jest.fn(),
    }),
}));

// Mock useSendCommand hook
jest.mock('@/hooks/use-send-command', () => ({
    useSendCommand: () => ({
        sendNavigation: jest.fn(),
        sendMediaCommand: jest.fn(),
        sendVolumeCommand: jest.fn(),
        sendChannelCommand: jest.fn(),
        sendCommand: jest.fn(),
        powerToggle: jest.fn(),
        goHome: jest.fn(),
        goBack: jest.fn(),
        openMenu: jest.fn(),
        showInfo: jest.fn(),
        isSendingMedia: false,
    }),
}));

// Mock useKeyboardControl hook
jest.mock('@/hooks/use-keyboard-control', () => ({
    useKeyboardControl: () => ({
        config: {
            mode: 'qwerty',
            shiftActive: false,
            capsLock: false,
            hapticFeedback: true,
        },
        sendKey: jest.fn(),
        sendText: jest.fn(),
        toggleShift: jest.fn(),
        toggleCapsLock: jest.fn(),
        switchMode: jest.fn(),
        sendBackspace: jest.fn(),
        sendEnter: jest.fn(),
        sendSpace: jest.fn(),
        clearText: jest.fn(),
        setText: jest.fn(),
    }),
}));

// Mock useMouseControl hook
jest.mock('@/hooks/use-mouse-control', () => ({
    useMouseControl: () => ({
        config: {
            sensitivity: 50,
            hapticFeedback: true,
            invertScrolling: false,
        },
        moveMouse: jest.fn(),
        clickMouse: jest.fn(),
        scrollMouse: jest.fn(),
        startDrag: jest.fn(),
        stopDrag: jest.fn(),
        setCursorPosition: jest.fn(),
        updateSensitivity: jest.fn(),
        updateConfig: jest.fn(),
    }),
}));

// Mock useTVDiscovery hook
jest.mock('@/hooks/use-tv-discovery', () => ({
    useTVDiscovery: () => ({
        isDiscovering: false,
        foundTVs: [],
        discover: jest.fn(),
        stopDiscovery: jest.fn(),
    }),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
    useMutation: (mutationFn) => ({
        mutateAsync: jest.fn(),
        mutate: jest.fn(),
        isPending: false,
        error: null,
    }),
    useQuery: () => ({
        data: null,
        isLoading: false,
        error: null,
    }),
    QueryClient: jest.fn().mockImplementation(() => ({
        invalidateQueries: jest.fn(),
    })),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Global test utilities
global.__DEV__ = true;
