'use server';
import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/lib/db';
import { CategoryTypes } from '@prisma/client';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';

export type State = {
	status: 'error' | 'success' | undefined;
	errors?: {
		[key: string]: string[];
	};
	message?: string | null;
};

const productSchema = z.object({
	name: z.string().min(3, { message: 'The name has to be a min charackter length of 5' }),
	category: z.string().min(1, { message: 'Category is required' }),
	price: z.number().min(1, { message: 'The Price has to be bigger then 1' }),
	smallDescription: z.string().min(10, { message: 'Please summerize your product more' }),
	description: z.string().min(10, { message: 'Description is required' }),
	images: z.array(z.string(), { message: 'Images are required' }),
	productFile: z.string().min(1, { message: 'Pleaes upload a zip of your product' }),
});

const userSettingsSchema = z.object({
	firstName: z
		.string()
		.min(3, { message: 'Minimum length of 3 required' })
		.or(z.literal(''))
		.optional(),

	lastName: z
		.string()
		.min(3, { message: 'Minimum length of 3 required' })
		.or(z.literal(''))
		.optional(),
});

export async function sellProduct(_: State | undefined, formData: FormData) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) {
		throw new Error('Something went wrong');
	}

	const validateFields = productSchema.safeParse({
		name: formData.get('name'),
		category: formData.get('category'),
		price: Number(formData.get('price')),
		smallDescription: formData.get('smallDescription'),
		description: formData.get('description'),
		images: JSON.parse(formData.get('images') as string),
		productFile: formData.get('productFile'),
	});

	if (!validateFields.success) {
		const state: State = {
			status: 'error',
			errors: validateFields.error.flatten().fieldErrors,
			message: 'Oops, I think there is a mistake with you inputs.',
		};

		return state;
	}

	const data = await prisma.product.create({
		data: {
			name: validateFields.data.name,
			category: validateFields.data.category as CategoryTypes,
			smallDescription: validateFields.data.smallDescription,
			price: validateFields.data.price,
			images: validateFields.data.images,
			productFile: validateFields.data.productFile,
			userId: user.id,
			description: JSON.parse(validateFields.data.description),
		},
	});

	return redirect(`/product/${data.id}`);
}

export async function updateUserSettings(_: State | undefined, formData: FormData) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) {
		throw new Error('Something went wrong');
	}

	const validateFields = userSettingsSchema.safeParse({
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
	});

	if (!validateFields.success) {
		const state: State = {
			status: 'error',
			errors: validateFields.error.flatten().fieldErrors,
			message: 'Oops, I think there is a mistake with you inputs.',
		};

		return state;
	}

	const data = await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			firstName: validateFields.data.firstName,
			lastName: validateFields.data.lastName,
		},
	});

	const state: State = {
		status: 'success',
		message: 'Your Settings have been updated',
	};

	return state;
}

export async function buyProduct(formDta: FormData) {
	const id = formDta.get('id') as string;

	const data = await prisma.product.findUnique({
		where: {
			id,
		},
		select: {
			name: true,
			smallDescription: true,
			price: true,
			images: true,
			productFile: true,
			User: {
				select: {
					connectedAccountId: true,
				},
			},
		},
	});

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: Math.round(data!.price * 100),
					product_data: {
						name: data!.name,
						description: data!.smallDescription,
						images: data!.images,
					},
				},
				quantity: 1,
			},
		],
		metadata: {
			link: data!.productFile,
		},
		payment_intent_data: {
			application_fee_amount: Math.round(data!.price * 100) * 0.1,
			transfer_data: {
				destination: data?.User?.connectedAccountId as string,
			},
		},
		success_url: 'http://localhost:3000/payment/success',
		cancel_url: 'http://localhost:3000/payment/cancel',
	});

	return redirect(session.url as string);
}

export async function createStripeAccountLink() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) {
		throw new Error('Something went wrong');
	}

	const data = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		select: {
			connectedAccountId: true,
		},
	});

	const accountLink = await stripe.accountLinks.create({
		account: data!.connectedAccountId,
		refresh_url: 'http://localhost:3000/billing',
		return_url: `http://localhost:3000/return/${data!.connectedAccountId}`,
		type: 'account_onboarding',
	});

	return redirect(accountLink.url);
}

export async function getStripeDashboardLink() {
	const { getUser } = getKindeServerSession();

	const user = await getUser();

	if (!user) {
		throw new Error('Unauthorized');
	}

	const data = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		select: {
			connectedAccountId: true,
		},
	});

	const loginLink = await stripe.accounts.createLoginLink(data!.connectedAccountId);

	return redirect(loginLink.url);
}
