import { Card } from '@/components/ui/card';
import SellForm from '@/components/form/Sellform';

const SellRoute = () => {
	return (
		<section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
			<Card>
				<SellForm />
			</Card>
		</section>
	);
};

export default SellRoute;
