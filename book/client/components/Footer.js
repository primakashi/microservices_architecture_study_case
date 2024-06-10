import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
	let { t } = useTranslation();
	return (
		<footer className="flex items-center justify-center w-full h-24 border-t">
			<a className="text-gray-500 ">© 2021, Bookva. {t('common:footer')}</a>
		</footer>
	);
};

export default Footer;
