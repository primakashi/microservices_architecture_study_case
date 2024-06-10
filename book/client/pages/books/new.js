import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const BooksNew = () => {
	const [name, setName] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [image, setImage] = useState('');
	const [currency, setCurrency] = useState('USD');

	const { doRequest, errors } = useRequest({
		url: '/api/books',
		method: 'post',
		body: {
			name,
			author,
			description,
			currency,
			price,
			image,
		},
		onSuccess: () => console.log('Added to database'),
	});

	const onSubmit = () => {
		event.preventDefault();

		doRequest();
	};

	const renderForm = (
		<>
			<div>
				<Head>
					<title>Add new book</title>
				</Head>

				<main>
					<div className="bg-white max-w-2xl mx-auto py-8 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="md:col-span-1">
								<div className="px-4 sm:px-0">
									<h3 className="text-lg font-medium leading-6 text-gray-900">
										Add new book to a catalog
									</h3>
									<p className="mt-1 text-sm text-gray-600">
										This book will be added to catalog so be careful. The future
										changes are not possible.
									</p>
								</div>
							</div>
							<div className="mt-5 md:mt-0 md:col-span-2">
								<form onSubmit={onSubmit}>
									<div className="shadow sm:rounded-md sm:overflow-hidden">
										<div className="px-4 py-5 bg-white space-y-6 sm:p-6">
											<div>
												<label
													htmlFor="name"
													className="block text-sm font-medium text-gray-700"
												>
													Title
												</label>
												<input
													type="text"
													name="name"
													id="name"
													autoComplete="name"
													value={name}
													onChange={e => setName(e.target.value)}
													className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												/>
											</div>
											<div>
												<label
													htmlFor="author"
													className="block text-sm font-medium text-gray-700"
												>
													Author
												</label>
												<input
													type="text"
													name="author"
													id="author"
													autoComplete="author"
													value={author}
													onChange={e => setAuthor(e.target.value)}
													className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												/>
											</div>

											<div>
												<label
													htmlFor="description"
													className="block text-sm font-medium text-gray-700"
												>
													Description
												</label>
												<div className="mt-1">
													<textarea
														id="description"
														name="description"
														rows={3}
														value={description}
														onChange={e => setDescription(e.target.value)}
														className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
													/>
												</div>
											</div>

											<div>
												<label
													htmlFor="price"
													className="block text-sm font-medium text-gray-700"
												>
													Price
												</label>
												<div className="mt-1 relative rounded-md shadow-sm">
													<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<input
														type="text"
														name="price"
														id="price"
														value={price}
														onChange={e => setPrice(e.target.value)}
														className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
														placeholder="0.00"
													/>
												</div>
											</div>

											<div>
												<label
													htmlFor="imageSrc"
													className="block text-sm font-medium text-gray-700"
												>
													Image link
												</label>
												<input
													type="text"
													name="imageSrc"
													id="imageSrc"
													autoComplete="imageSrc"
													value={image}
													onChange={e => setImage(e.target.value)}
													className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												/>
											</div>
										</div>
										<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
											<button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												Submit
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);

	return null;
};

export default BooksNew;
