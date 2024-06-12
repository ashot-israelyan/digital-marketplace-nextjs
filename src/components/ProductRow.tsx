import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import { Skeleton } from './ui/skeleton';
import { LoadingProductCard, ProductCard } from './ProductCard';
import Link from 'next/link';

interface IProductRowProps {
	category: 'newest' | 'templates' | 'uikits' | 'icons';
}

const getData = async ({ category }: IProductRowProps) => {
	const select = {
		price: true,
		name: true,
		smallDescription: true,
		id: true,
		images: true,
	};
	switch (category) {
		case 'icons':
			const iconsData = await prisma.product.findMany({
				where: {
					category: 'icon',
				},
				select,
				take: 3,
			});

			return {
				data: iconsData,
				title: 'Icons',
				link: '/products/icon',
			};
		case 'newest':
			const newestData = await prisma.product.findMany({
				select,
				orderBy: {
					createdAt: 'desc',
				},
				take: 3,
			});

			return {
				data: newestData,
				title: 'Newest Products',
				link: '/products/all',
			};
		case 'templates':
			const tempaltesData = await prisma.product.findMany({
				where: {
					category: 'template',
				},
				select,
				take: 3,
			});

			return {
				title: 'Templates',
				data: tempaltesData,
				link: '/products/template',
			};
		case 'uikits':
			const uikitData = await prisma.product.findMany({
				where: {
					category: 'uikit',
				},
				select,
				take: 3,
			});

			return {
				title: 'UI Kits',
				data: uikitData,
				link: '/products/uikit',
			};
		default:
			return notFound();
	}
};

const LoadingState = () => {
	return (
		<div>
			<Skeleton className="h-8 w-56" />
			<div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-10 lg:grid-cols-3">
				<LoadingProductCard />
				<LoadingProductCard />
				<LoadingProductCard />
			</div>
		</div>
	);
};

const LoadRows: FC<IProductRowProps> = async ({ category }) => {
	const data = await getData({ category });

	return (
		<>
			<div className="md:flex md:items-center md:justify-between">
				<h2 className="text-2xl font-extrabold tracking-lighter">{data.title}</h2>
				<Link
					href={data.link}
					className="text-sm hidden font-medium text-primary hover:text-primary/90 md:block"
				>
					All Products <span>&rarr;</span>
				</Link>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
				{data.data.map((product) => (
					<ProductCard
						images={product.images}
						key={product.id}
						id={product.id}
						name={product.name}
						price={product.price}
						smallDescription={product.smallDescription}
					/>
				))}
			</div>
		</>
	);
};

const ProductRow: FC<IProductRowProps> = ({ category }) => {
	return (
		<section className="mt-12">
			<Suspense fallback={<LoadingState />}>
				<LoadRows category={category} />
			</Suspense>
		</section>
	);
};

export default ProductRow;
