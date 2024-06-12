'use client';

import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SelectCategory from '@/components/SelectCategory';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '@/components/Editor';
import { UploadDropzone } from '@/lib/uploadthing';
import { useEffect, useState } from 'react';
import { JSONContent } from '@tiptap/react';
import { useFormState } from 'react-dom';
import { sellProduct, State } from '@/actions';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/SubmitButton';

const SellForm = () => {
	const initialState: State = { message: '', status: undefined };
	const [state, formAction] = useFormState(sellProduct, initialState);
	const [json, setJson] = useState<null | JSONContent>(null);
	const [images, setImages] = useState<null | string[]>(null);
	const [productFile, setProductFile] = useState<null | string>(null);

	useEffect(() => {
		if (state.status === 'success') {
			toast.success(state.message);
		} else if (state.status === 'error') {
			toast.error(state.message);
		}
	}, [state]);

	return (
		<form action={formAction}>
			<CardHeader>
				<CardTitle>Sell your product with ease</CardTitle>
				<CardDescription>
					Please describe your product here in detail so that it can be sold
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-y-10 ">
				<div className="flex flex-col gap-y-2">
					<Label>Name</Label>
					<Input
						name="name"
						type="text"
						placeholder="Name of your product"
						required
						minLength={3}
					/>
					{state?.errors?.['name']?.[0] && (
						<p className="text-destructive">{state?.errors?.['name']?.[0]}</p>
					)}
				</div>
				<div className="flex flex-col gap-y-2 ">
					<Label>Category</Label>
					<SelectCategory />
					{state?.errors?.['category']?.[0] && (
						<p className="text-destructive">{state?.errors?.['category']?.[0]}</p>
					)}
				</div>

				<div className="flex flex-col gap-y-2">
					<Label>Price</Label>
					<Input name="price" required min={1} type="number" placeholder="29$" />
					{state?.errors?.['price']?.[0] && (
						<p className="text-destructive">{state?.errors?.['price']?.[0]}</p>
					)}
				</div>

				<div className="flex flex-col gap-y-2">
					<Label>Small Summary</Label>
					<Textarea
						name="smallDescription"
						placeholder="Please describe your product shortly right here..."
						required
						minLength={10}
					/>
					{state?.errors?.['smallDescription']?.[0] && (
						<p className="text-destructive">{state?.errors?.['smallDescription']?.[0]}</p>
					)}
				</div>

				<div className="flex flex-col gap-y-2">
					<input type="hidden" name="description" value={JSON.stringify(json)} />
					<Label>Description</Label>
					<TipTapEditor json={json} setJson={setJson} />
					{state?.errors?.['description']?.[0] && (
						<p className="text-destructive">{state?.errors?.['description']?.[0]}</p>
					)}
				</div>

				<div className="flex flex-col gap-y-2">
					<input type="hidden" name="images" value={JSON.stringify(images)} />
					<Label>Product Images</Label>
					<UploadDropzone
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
							console.log('imageUploader', 'onClientUploadComplete', res);
							setImages(res.map((item) => item.url));
						}}
						onUploadError={() => {
							toast.error('Something went wrong, try again');
						}}
					/>
					{state?.errors?.['images']?.[0] && (
						<p className="text-destructive">{state?.errors?.['images']?.[0]}</p>
					)}
				</div>

				<div className="flex flex-col gap-y-2">
					<input type="hidden" name="productFile" value={productFile ?? ''} />
					<Label>Product File</Label>
					<UploadDropzone
						onClientUploadComplete={(res) => {
							console.log('productFileUpload', 'onClientUploadComplete', res);
							setProductFile(res[0].url);
							toast.success('Your Product file has been uploaded!');
						}}
						endpoint="productFileUpload"
						onUploadError={() => {
							toast.error('Something went wrong, try again');
						}}
					/>
					{state?.errors?.['productFile']?.[0] && (
						<p className="text-destructive">{state?.errors?.['productFile']?.[0]}</p>
					)}
				</div>
			</CardContent>
			<CardFooter className="mt-5">
				<SubmitButton title="Create your Product" />
			</CardFooter>
		</form>
	);
};

export default SellForm;
