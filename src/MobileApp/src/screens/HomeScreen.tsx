import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Products: undefined;
    Cart: undefined;
};

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const dispatch = useDispatch<AppDispatch>();
    return (
        <View className="flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
            <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
                <Text className="text-4xl font-bold text-gray-800 mb-2 text-center">
                    Shopping Project
                </Text>
                <Text className="text-gray-500 mb-8 text-center text-base">
                    Your mobile shopping experience
                </Text>

                <TouchableOpacity
                    className="bg-red-500 px-6 py-4 rounded-xl mb-4 shadow-lg"
                    onPress={() => dispatch(logout())}
                >
                    <Text className="text-white font-bold text-center text-lg">
                        Logout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white border-2 border-blue-600 px-6 py-4 rounded-xl mb-4"
                    onPress={() => navigation.navigate('Products')}
                >
                    <Text className="text-blue-600 font-bold text-center text-lg">
                        Browse Products
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-100 px-6 py-4 rounded-xl"
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text className="text-gray-700 font-semibold text-center text-lg">
                        View Cart
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
