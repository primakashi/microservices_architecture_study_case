import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Pagination from '../../components/Pagination';

const BooksIndex = ({ books }) => {
	let { t } = useTranslation();

	const [page, setPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(8);

	// Get current posts
	const indexOfLastPost = page * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = books.slice(indexOfFirstPost, indexOfLastPost);
	const totalPosts = Math.ceil(books.length / postsPerPage);

	const paginate = number => {
		setPage(number);
	};

	return (
		<div>
			<Head>
				<title>{t('books:title')}</title>
			</Head>

			<main>
				<div className="bg-white max-w-2xl mx-auto py-8 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
					<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
						{t('books:header')}
					</h2>

					<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{currentPosts.map(product => (
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

					<Pagination
						page={page}
						totalPosts={totalPosts}
						paginate={paginate}
						currentPosts={currentPosts.length}
					/>
				</div>
			</main>
		</div>
	);
};

BooksIndex.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/books');
	return { books: data };
};

export default BooksIndex;
