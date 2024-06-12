import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/lib/db';
import { createStripeAccountLink, getStripeDashboardLink } from '@/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { unstable_noStore as noStore } from 'next/cache';

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
	noStore();
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
					{!data?.stripeConnectedLinked ? (
						<form action={createStripeAccountLink}>
							<SubmitButton title="Link your Account to Stripe" />
						</form>
					) : (
						<form action={getStripeDashboardLink}>
							<SubmitButton title="View Dashboard" />
						</form>
					)}
				</CardContent>
			</Card>
		</section>
	);
};

export default BillingRoute;
