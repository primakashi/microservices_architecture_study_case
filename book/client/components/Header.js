import { Fragment, useState, useEffect } from 'react';
import { Dialog, Popover, Transition, Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import _ from 'lodash';
import {
	ShoppingBagIcon,
	MenuIcon,
	CogIcon,
	UserIcon,
	CreditCardIcon,
	XIcon,
	LogoutIcon,
	SearchIcon,
} from '@heroicons/react/outline';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const Header = ({ currentUser, prod_total, locale }) => {
	const [open, setOpen] = useState(false);
	const [selectedLocale, setSelectedLocale] = useState(locale);

	let { t } = useTranslation();
	const router = useRouter();

	const handleLanguageChange = localeToChange => {
		const { pathname, asPath, query } = router;
		setSelectedLocale(localeToChange);
		router.push({ pathname, query }, asPath, { locale: localeToChange });
	};

	const navigation = {
		pages: [
			{ name: `${t('header:books')}`, href: '/books' },
			{ name: `${t('header:stationery')}`, href: '/stationery' },
		],
	};

	const profileMenu = [
		{
			name: `${t('header:account')}`,
			href: '#',
			icon: UserIcon,
		},
		{
			name: `${t('header:cart')}`,
			href: '/cart',
			icon: ShoppingBagIcon,
		},
		{
			name: `${t('header:orders')}`,
			href: '/orders',
			icon: CreditCardIcon,
		},
		{
			name: `${t('header:settings')}`,
			href: '#',
			icon: CogIcon,
		},
		{
			name: `${t('header:logout')}`,
			href: '/auth/logout',
			icon: LogoutIcon,
		},
	];

	const languages = [
		{
			id: 'ru',
			name: 'RU',
			imgSrc: '/languages/russia.png',
		},
		{
			id: 'en',
			name: 'US',
			imgSrc: '/languages/eng.png',
		},
		{
			id: 'zh',
			name: 'CH',
			imgSrc: '/languages/china.png',
		},
	];

	const languageMenu = (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex justify-center w-full rounded-md   px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
					{_.map(languages, language => {
						return (
							<a
								key={language.id}
								className={classNames(
									language.id === selectedLocale
										? 'text-gray-400 hover:text-gray-500 flex items-center'
										: 'hidden'
								)}
							>
								<img
									src={language.imgSrc}
									alt={language.name}
									className="w-5 h-auto block flex-shrink-0"
								/>
								<span className="ml-3 block text-sm font-medium">
									{language.name}
								</span>
							</a>
						);
					})}
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
					<div className="py-1">
						{_.map(languages, language => {
							return (
								<Menu.Item key={language.id}>
									{({ active }) => (
										<a
											onClick={() => handleLanguageChange(language.id)}
											className={classNames(
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
												language.id === selectedLocale
													? 'bg-gray-100 text-gray-900'
													: 'text-gray-700',

												'flex items-center px-4 py-2 text-sm'
											)}
										>
											<img
												src={language.imgSrc}
												alt={language.name}
												className="w-5 h-auto block flex-shrink-0"
											/>
											<span className="ml-3 block text-sm font-medium">
												{language.name}
											</span>
										</a>
									)}
								</Menu.Item>
							);
						})}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);

	return (
		<div className="bg-white">
			{/* Mobile menu */}
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 flex z-40 lg:hidden"
					onClose={setOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<Transition.Child
						as={Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
							<div className="px-4 pt-5 pb-2 flex">
								<button
									type="button"
									className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
									onClick={() => setOpen(false)}
								>
									<span className="sr-only">Close menu</span>
									<XIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>

							{/* Profile Menu */}
							{currentUser && (
								<div className="border-t border-gray-200 py-6 px-4 space-y-6">
									<nav className="grid gap-y-8">
										{profileMenu.map(item => (
											<Link key={item.name} href={item.href}>
												<a
													rel="noopener noreferrer"
													className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
												>
													<item.icon
														className="flex-shrink-0 h-6 w-6 text-indigo-600"
														aria-hidden="true"
													/>
													<span className="ml-3 text-base font-medium text-gray-900">
														{item.name}
													</span>
												</a>
											</Link>
										))}
									</nav>
								</div>
							)}

							{/* Links */}

							<div className="border-t border-gray-200 py-6 px-4 space-y-6">
								{navigation.pages.map(page => (
									<div key={page.name} className="flow-root">
										<Link href={page.href}>
											<a
												rel="noopener noreferrer"
												className="-m-2 p-2 block font-medium text-gray-900"
											>
												{page.name}
											</a>
										</Link>
									</div>
								))}
							</div>

							{!currentUser && (
								<div className="border-t border-gray-200 py-6 px-4 space-y-6">
									<div className="flow-root">
										<Link href="/auth/login">
											<a
												rel="noopener noreferrer"
												className="-m-2 p-2 block font-medium text-gray-900"
											>
												{t('header:login')}
											</a>
										</Link>
									</div>
									<div className="flow-root">
										<Link href="/auth/register">
											<a
												rel="noopener noreferrer"
												className="-m-2 p-2 block font-medium text-gray-900"
											>
												{t('header:register')}
											</a>
										</Link>
									</div>
								</div>
							)}

							<div className="border-t border-gray-200 py-4 px-4 -m-2 p-2 flex items-center">
								{languageMenu}
							</div>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition.Root>

			<header className="relative bg-white">
				{/* <p className="bg-indigo-600 h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
					Get free delivery on orders over $100
				</p> */}

				<nav
					aria-label="Top"
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
				>
					<div className="border-b border-gray-200">
						<div className="h-16 flex items-center">
							<button
								type="button"
								className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
								onClick={() => setOpen(true)}
							>
								<span className="sr-only">Open menu</span>
								<MenuIcon className="h-6 w-6" aria-hidden="true" />
							</button>

							{/* Logo */}
							<div className="ml-4 flex lg:ml-0">
								<Link href="/">
									<a rel="noopener noreferrer">
										<span className="sr-only">Workflow</span>
										<img
											className="h-8 w-auto"
											src="/owl.png"
											alt="Owl Icon in Line Style By Jemis Mali"
										/>
									</a>
								</Link>
							</div>

							{/* Flyout menus */}
							<Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
								<div className="h-full flex space-x-8">
									{navigation.pages.map(page => (
										<Link key={page.name} href={page.href}>
											<a
												rel="noopener noreferrer"
												className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
											>
												{page.name}
											</a>
										</Link>
									))}
								</div>
							</Popover.Group>

							{/* Authentification */}
							<div className="ml-auto flex items-center">
								{!currentUser && (
									<div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
										<Link href="/auth/login">
											<a
												rel="noopener noreferrer"
												className="text-sm font-medium text-gray-700 hover:text-gray-800"
											>
												{t('header:login')}
											</a>
										</Link>
										<span className="h-6 w-px bg-gray-200" aria-hidden="true" />
										<Link href="/auth/register">
											<a
												rel="noopener noreferrer"
												className="text-sm font-medium text-gray-700 hover:text-gray-800"
											>
												{t('header:register')}
											</a>
										</Link>
									</div>
								)}

								{/* Localization */}
								<div className="hidden lg:ml-8 lg:flex">{languageMenu}</div>

								{/* Search */}
								<div className="flex lg:ml-6">
									<a href="#" className="p-2 text-gray-400 hover:text-gray-500">
										<SearchIcon className="w-6 h-6" aria-hidden="true" />
									</a>
								</div>

								{/* Profile Menu */}
								{currentUser && (
									<Popover className="lg:flex hidden lg:ml-6 items-center justify-center z-10 ">
										<Popover.Button className="bg-white rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 p-2">
											<UserIcon className="h-6 w-6" aria-hidden="true" />
										</Popover.Button>

										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="opacity-0 translate-y-1"
											enterTo="opacity-100 translate-y-0"
											leave="transition ease-in duration-150"
											leaveFrom="opacity-100 translate-y-0"
											leaveTo="opacity-0 translate-y-1"
										>
											<Popover.Panel className="absolute z-10  transform translate-y-44 max-w-md sm:px-0">
												<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
													<div className="relative  grid justify-end gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
														{profileMenu.map(item => (
															<Link key={item.name} href={item.href}>
																<a
																	rel="noopener noreferrer"
																	className="-m-3 p-3 flex items-end rounded-lg hover:bg-gray-50"
																>
																	<item.icon
																		className="flex-shrink-0 h-6 w-6 text-indigo-600"
																		aria-hidden="true"
																	/>
																	<div className="ml-4">
																		<p className="text-base font-medium text-gray-900">
																			{item.name}
																		</p>
																	</div>
																</a>
															</Link>
														))}
													</div>
												</div>
											</Popover.Panel>
										</Transition>
									</Popover>
								)}

								{/* Cart */}
								<div className="ml-4 flow-root lg:ml-6">
									<Link href="/cart">
										<a
											rel="noopener noreferrer"
											className="group -m-2 p-2 flex items-center"
										>
											<ShoppingBagIcon
												className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
												aria-hidden="true"
											/>
											<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
												{prod_total}
											</span>
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
};

export default Header;
