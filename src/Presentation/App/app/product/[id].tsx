import ProductDetailScreen from '@/presentation/features/Product/screens/ProductDetailScreen';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProductDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ProductDetailScreen productId={id} />
        </ScrollView>
    );
}
