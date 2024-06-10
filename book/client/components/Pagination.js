import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';

const Pagination = ({ page, totalPosts, paginate, currentPosts }) => {
	let { t } = useTranslation();

	const paginationNumbers = _.range(1, totalPosts + 1);

	return (
		<div className="bg-white  mt-6 flex items-center justify-between  ">
			<div className="flex-1 flex justify-between sm:hidden">
				<a
					onClick={() => {
						if (page != 1) {
							paginate(page - 1);
						}
					}}
					rel="noopener noreferrer"
					href="#"
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					{t('common:previous')}
				</a>
				<a
					onClick={() => {
						if (page != totalPosts) {
							paginate(page + 1);
						}
					}}
					rel="noopener noreferrer"
					href="#"
					className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					{t('common:next')}
				</a>
			</div>
			<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
						{t('common:showing')} <span className="font-medium">1</span>{' '}
						{t('common:to')} <span className="font-medium">{currentPosts}</span>{' '}
						{t('common:of')} <span className="font-medium">{totalPosts}</span>{' '}
						{t('common:results')}
					</p>
				</div>
				<div>
					<nav
						className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
						aria-label="Pagination"
					>
						<a
							onClick={() => {
								if (page != 1) {
									paginate(page - 1);
								}
							}}
							rel="noopener noreferrer"
							className={
								page === 1
									? 'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-200 bg-white text-sm font-medium text-gray-200'
									: 'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer'
							}
						>
							<span className="sr-only">{t('common:previous')}</span>
							<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
						</a>
						{_.map(paginationNumbers, number => {
							return (
								<a
									rel="noopener noreferrer"
									key={number}
									onClick={() => paginate(number)}
									aria-current="page"
									className={
										page === number
											? `z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer`
											: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer'
									}
								>
									{number}
								</a>
							);
						})}

						<a
							onClick={() => {
								if (page != totalPosts) {
									paginate(page + 1);
								}
							}}
							className={
								page === totalPosts
									? 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-200 bg-white text-sm font-medium text-gray-200'
									: 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer'
							}
						>
							<span className="sr-only">{t('common:next')}</span>
							<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
						</a>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default Pagination;
