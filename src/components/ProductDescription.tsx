'use client';

import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FC } from 'react';

const ProductDescription: FC<{ content: JSONContent }> = ({ content }) => {
	const editor = useEditor({
		editable: false,
		extensions: [StarterKit],
		content,
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose-base',
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<>
			<EditorContent editor={editor} />
		</>
	);
};

export default ProductDescription;
