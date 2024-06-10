import Head from 'next/head';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import useRequest from '../hooks/use-request';
import { useEffect } from 'react';
import _ from 'lodash';

const LandingPage = ({ books, stationery, setCartTotal, currentUser }) => {
	let { t } = useTranslation();

	const { doRequest, errors } = useRequest({
		url: '/api/cart?total=true',
		method: 'get',
		onSuccess: ({ products_total }) => setCartTotal(products_total),
	});

	useEffect(() => {
		if (currentUser) {
			doRequest();
		}
	}, []);

	return (
		<div>
			<Head>
				<title>{t('home:title')}</title>
			</Head>

			<main>
				<div className="bg-white max-w-2xl mx-auto py-8 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
					<Link href="/books">
						<a
							rel="noopener noreferrer"
							className="text-2xl font-extrabold tracking-tight text-gray-900 hover:underline"
						>
							{t('home:bookHeader')}
						</a>
					</Link>

					<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{_.shuffle(books)
							.slice(0, 4)
							.map(product => (
								<div key={product.id} className="group relative">
									<div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-center object-cover lg:w-full lg:h-full"
										/>
									</div>
									<div className="mt-4 flex justify-between">
										<div>
											<h3 className="text-sm text-gray-700">
												<Link href={`/books/${product.id}`}>
													<a rel="noopener noreferrer">
														<span
															aria-hidden="true"
															className="absolute inset-0"
														/>
														{product.name}
													</a>
												</Link>
											</h3>
											<p className="mt-1 text-sm text-gray-500">
												{product.author}
											</p>
										</div>
										<p className="text-sm font-medium text-gray-900">
											{'$'}
											{product.price / 100}
										</p>
									</div>
								</div>
							))}
					</div>
					<div className="mt-12">
						<Link href="/stationery">
							<a
								rel="noopener noreferrer"
								className="text-2xl font-extrabold tracking-tight text-gray-900  hover:underline"
							>
								{t('home:stationeryHeader')}
							</a>
						</Link>
						<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
							{_.shuffle(stationery)
								.slice(0, 4)
								.map(product => (
									<div key={product.id} className="group relative">
										<div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-full object-center object-cover lg:w-full lg:h-full"
											/>
										</div>
										<div className="mt-4 flex justify-between">
											<div>
												<h3 className="text-sm text-gray-700">
													<Link href={`/stationery/${product.id}`}>
														<a>
															<span
																aria-hidden="true"
																className="absolute inset-0"
															/>
															{product.name}
														</a>
													</Link>
												</h3>
												<p className="mt-1 text-sm text-gray-500">
													{product.brand}
												</p>
											</div>
											<p className="text-sm font-medium text-gray-900">
												{'$'}
												{product.price / 100}
											</p>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const books = await client.get('/api/books');
	const stationery = await client.get('/api/stationery');

	return { books: books.data, stationery: stationery.data };
};

export default LandingPage;
