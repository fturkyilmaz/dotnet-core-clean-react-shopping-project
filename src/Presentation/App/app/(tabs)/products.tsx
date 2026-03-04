import ProductsScreen from '@/presentation/features/Product/screens/ProductsScreen';
import { ScrollView } from 'react-native';

export default function ProductsPage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ProductsScreen />
        </ScrollView>
    );
}
