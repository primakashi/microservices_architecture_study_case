import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import { useState } from 'react';
import _ from 'lodash';
import { StarIcon } from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';

const reviews = { href: '#', average: 4, totalCount: 117 };

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const BookOverview = ({
	book,
	status,
	currentUser,
	cartTotal,
	setCartTotal,
}) => {
	let { t } = useTranslation();
	const router = useRouter();

	const [inCart, setInCart] = useState(status);

	const breadcrumbs = [
		{ id: 1, name: `${t('bookid:breadcrumb_home')}`, href: '/' },
		{ id: 2, name: `${t('bookid:breadcrumb_books')}`, href: '/books' },
	];

	const buttons = inCart ? (
		<button
			onClick={() => router.push('/cart')}
			className="shadow-sm mt-10 w-full flex items-center justify-center text-base bg-white border border-gray-300 rounded-md py-3 px-8 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			{t('bookid:InCart')}
		</button>
	) : (
		<button
			onClick={() => doRequest()}
			className="mt-10 w-full flex items-center justify-center text-base bg-indigo-600 border border-transparent rounded-md py-3 px-8  font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			{t('bookid:addToCart')}
		</button>
	);

	const { doRequest, errors } = useRequest({
		url: '/api/cart',
		method: 'post',
		body: {
			id: book.id,
			category: 'books',
		},
		onSuccess: () => {
			setInCart(true);
			setCartTotal(cartTotal + 1);
		},
	});

	return (
		<div className="bg-white">
			<Head>
				<title>{book.name}</title>
			</Head>
			<div className="pt-6">
				<nav aria-label="Breadcrumb">
					<ol
						role="list"
						className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8"
					>
						{breadcrumbs.map(breadcrumb => (
							<li key={breadcrumb.id}>
								<div className="flex items-center">
									<Link href={breadcrumb.href}>
										<a
											rel="noopener noreferrer"
											className="mr-2 text-sm font-medium text-gray-900"
										>
											{breadcrumb.name}
										</a>
									</Link>
									<svg
										width={16}
										height={20}
										viewBox="0 0 16 20"
										fill="currentColor"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										className="w-4 h-5 text-gray-300"
									>
										<path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
									</svg>
								</div>
							</li>
						))}
						<li className="text-sm">
							<Link href={`/books/${book.id}`}>
								<a
									rel="noopener noreferrer"
									aria-current="page"
									className="font-medium text-gray-500 hover:text-gray-600"
								>
									{book.name}
								</a>
							</Link>
						</li>
					</ol>
				</nav>

				{/* Image gallery */}
				<div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
					<div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
						<img
							src={book.image}
							alt={book.name}
							className="w-full h-full object-center object-cover"
						/>
					</div>

					<div className="col-span-2  pr-8 px-4  md:px-0 lg:px-2">
						<div className="flex justify-between pt-10  lg:pt-0 ">
							<h1 className=" text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl ">
								{book.name}
							</h1>
							<p className="font-medium text-3xl text-gray-900">
								{'$'}
								{book.price / 100}
							</p>
						</div>
						{/* Reviews */}
						<div className="mt-6">
							<div className="flex items-center">
								<div className="flex items-center">
									{[0, 1, 2, 3, 4].map(rating => (
										<StarIcon
											key={rating}
											className={classNames(
												reviews.average > rating
													? 'text-gray-900'
													: 'text-gray-200',
												'h-5 w-5 flex-shrink-0'
											)}
											aria-hidden="true"
										/>
									))}
								</div>
								<Link href={reviews.href}>
									<a
										rel="noopener noreferrer"
										className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
									>
										{reviews.totalCount} {t('bookid:reviews')}
									</a>
								</Link>
							</div>
						</div>

						<div className="mt-4">
							<div className="space-y-6">
								<p className="text-base text-gray-900">{book.description}</p>
							</div>
						</div>
						{currentUser ? buttons : null}
					</div>
				</div>
			</div>
		</div>
	);
};

BookOverview.getInitialProps = async (context, client, currentUser) => {
	if (currentUser) {
		const { bookId } = context.query;
		const { data } = await client.get(`/api/books/${bookId}`);
		const response = await client.get(`/api/cart/${bookId}`);

		const inCart = _.isEmpty(response.data) ? false : true;

		return { book: data, status: inCart };
	}

	const { bookId } = context.query;
	const { data } = await client.get(`/api/books/${bookId}`);
	return { book: data };
};

export default BookOverview;
