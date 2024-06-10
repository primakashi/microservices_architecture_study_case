import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Head from 'next/head';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const Login = () => {
	let { t } = useTranslation();
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [emailErrMsg, setEmailErrMsg] = useState(false);
	const [passwordErrMsg, setPasswordErrMsg] = useState(false);

	const { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {
			email,
			password,
		},
		onSuccess: () => router.push('/'),
	});

	const onSubmit = async event => {
		event.preventDefault();

		doRequest();
	};

	const handlePasswordValidation = () => {
		if (password.length > 20 || password.length < 4) {
			setPasswordErrMsg(true);
		} else {
			setPasswordErrMsg(false);
		}
	};

	const handleEmailValidation = () => {
		let regex = new RegExp(
			"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
		);

		if (regex.test(email)) {
			setEmailErrMsg(false);
		} else {
			setEmailErrMsg(true);
		}
	};

	return (
		<>
			<Head>
				<title>{t('login:title')}</title>
			</Head>
			<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div>
						<img
							className="mx-auto h-12 w-auto"
							src="/owl.png"
							alt="Owl Icon in Line Style By Jemis Mali"
						/>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							{t('login:header')}
						</h2>
					</div>
					<form
						className="mt-8 space-y-6 shadow p-8 bg-white rounded-lg"
						action="#"
						onSubmit={onSubmit}
					>
						<div className="grid gap-6">
							<div>
								<label
									htmlFor="email-address"
									className="block text-sm font-medium text-gray-700"
								>
									{t('login:email')}
								</label>
								<div className="mt-1 relative rounded-md shadow-sm">
									<input
										id="email-address"
										name="email"
										type="text"
										autoComplete="email"
										onBlur={handleEmailValidation}
										className={classNames(
											emailErrMsg
												? 'border-red-400 block w-full  pr-12 sm:text-sm rounded-md'
												: 'focus:ring-indigo-500 focus:border-indigo-500 block w-full  pr-12 sm:text-sm border-gray-300 rounded-md'
										)}
										onChange={e => setEmail(e.target.value)}
										required
									/>
								</div>
								<p className="mt-2 text-sm text-red-500">
									{emailErrMsg ? t('login:emailError') : ''}
								</p>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									{t('login:password')}
								</label>
								<div className="mt-1 relative rounded-md shadow-sm">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										id="password"
										onBlur={handlePasswordValidation}
										className={classNames(
											passwordErrMsg
												? ' border-red-400 block w-full  pr-12 sm:text-sm rounded-md'
												: 'focus:ring-indigo-500 focus:border-indigo-500 block w-full  pr-12 sm:text-sm border-gray-300 rounded-md'
										)}
										onChange={e => setPassword(e.target.value)}
										required
									/>
									<a
										onClick={() => setShowPassword(!showPassword)}
										className={classNames(
											passwordErrMsg
												? 'absolute inset-y-0 right-0 px-2 text-red-400 flex items-center cursor-pointer  hover:text-red-500'
												: 'absolute inset-y-0 right-0 px-2 text-gray-400 flex items-center cursor-pointer  hover:text-gray-500'
										)}
									>
										{showPassword ? (
											<EyeOffIcon className="h-6 w-6" />
										) : (
											<EyeIcon className="h-6 w-6" />
										)}
									</a>
								</div>
								<p className="mt-2 text-sm text-red-500">
									{passwordErrMsg ? t('login:passError') : ''}
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-900"
								>
									{t('login:remember_me')}
								</label>
							</div>

							<div className="text-sm">
								<Link href="#">
									<a
										rel="noopener noreferrer"
										className="font-medium text-indigo-600 hover:text-indigo-500"
									>
										{t('login:forgot_password')}
									</a>
								</Link>
							</div>
						</div>

						<div>
							<button className="group   w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								{t('login:login')}
							</button>
							<div className="mt-6 flex justify-center text-sm text-center text-gray-500">
								<p>
									{t('login:do_not_have_an_account')}{' '}
									<Link href="/auth/register">
										<a
											rel="noopener noreferrer"
											className="text-indigo-600 font-medium hover:text-indigo-500"
										>
											{t('login:register')}
										</a>
									</Link>
								</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

Login.getInitialProps = async (context, client, currentUser) => {
	if (currentUser) {
		// Redirect if the user is logged in
		context.res.writeHead(303, { Location: '/' });
		context.res.end();
	}
};

export default Login;
