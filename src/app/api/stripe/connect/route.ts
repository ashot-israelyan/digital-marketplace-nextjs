import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';

export async function POST(req: Request) {
	const body = await req.text();

	const signature = headers().get('Stripe-Signature') as string;

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string,
		);
	} catch (error: unknown) {
		console.log(error);
		return new Response('webhook error', { status: 400 });
	}

	switch (event.type) {
		case 'account.updated':
			const account = event.data.object;

			const data = await prisma.user.update({
				where: {
					connectedAccountId: account.id,
				},
				data: {
					stripeConnectedLinked: !['inactive', 'pending'].includes(
						account.capabilities!.transfers!,
					),
				},
			});
			break;
		default: {
			console.log('unhandled event', event.type);
		}
	}

	return new Response(null, { status: 200 });
}
