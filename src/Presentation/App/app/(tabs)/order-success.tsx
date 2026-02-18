import OrderSuccessScreen from '@/presentation/features/Cart/screens/OrderSuccessScreen';
import { ScrollView } from 'react-native';

export default function OrderSuccessPage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <OrderSuccessScreen />
        </ScrollView>
    );
}
