import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
    return (
        <View className="flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
            <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
                <Text className="text-4xl font-bold text-gray-800 mb-2 text-center">
                    Shopping Project
                </Text>
                <Text className="text-gray-500 mb-8 text-center text-base">
                    Your mobile shopping experience
                </Text>

                <Link href="/login" asChild>
                    <TouchableOpacity className="bg-blue-600 px-6 py-4 rounded-xl mb-4 shadow-lg">
                        <Text className="text-white font-bold text-center text-lg">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/products" asChild>
                    <TouchableOpacity className="bg-white border-2 border-blue-600 px-6 py-4 rounded-xl mb-4">
                        <Text className="text-blue-600 font-bold text-center text-lg">
                            Browse Products
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/cart" asChild>
                    <TouchableOpacity className="bg-gray-100 px-6 py-4 rounded-xl">
                        <Text className="text-gray-700 font-semibold text-center text-lg">
                            View Cart
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
