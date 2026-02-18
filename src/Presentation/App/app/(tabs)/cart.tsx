import CartScreen from '@/presentation/features/Cart/screens/CartScreen';
import { ScrollView } from 'react-native';

export default function CartPage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <CartScreen />
        </ScrollView>
    );
}
