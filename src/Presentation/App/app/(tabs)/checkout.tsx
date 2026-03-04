import CheckoutScreen from '@/presentation/features/Cart/screens/CheckoutScreen';
import { ScrollView } from 'react-native';

export default function CheckoutPage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <CheckoutScreen />
        </ScrollView>
    );
}
