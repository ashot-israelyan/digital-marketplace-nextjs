'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';

export const SubmitButton: FC<{ title: string }> = ({ title }) => {
	const { pending } = useFormStatus();

	return (
		<>
			{pending ? (
				<Button disabled>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Please Wait
				</Button>
			) : (
				<Button type="submit">{title}</Button>
			)}
		</>
	);
};

export const BuyButton: FC<{ price: number }> = ({ price }) => {
	const { pending } = useFormStatus();

	return (
		<>
			{pending ? (
				<Button disabled>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Please Wait
				</Button>
			) : (
				<Button size="lg" className="w-full mt-10">
					Buy for ${price}
				</Button>
			)}
		</>
	);
};
