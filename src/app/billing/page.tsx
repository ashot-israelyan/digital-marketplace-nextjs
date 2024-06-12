import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';

const getData = async (userId: string) => {
	const data = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			stripeConnectedLinked: true,
		},
	});

	return data;
};

const BillingRoute = async () => {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) {
		throw new Error('Unauthorized');
	}

	const data = await getData(user.id);

	return (
		<section className="max-w-7xl mx-auto px-4 md:px-8 ">
			<Card>
				<CardHeader>
					<CardTitle>Billing</CardTitle>
					<CardDescription>Find all your details regarding your payments</CardDescription>
				</CardHeader>
				<CardContent>
					{data?.stripeConnectedLinked === false && (
						<form>
							<Button>Link your Account to Stripe</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</section>
	);
};

export default BillingRoute;
