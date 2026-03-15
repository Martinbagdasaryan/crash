import React, { createContext, useContext, useState } from 'react';
import en from './locales/en.json';
import ru from './locales/ru.json';
import hy from './locales/hy.json';

type TFunc = (key: string) => string;

interface I18nContextType {
	t: TFunc;
	setLang: (lang: string) => void;
	lang: string;
}

const I18nContext = createContext<I18nContextType>({
	t: (key) => key,
	setLang: () => {},
	lang: 'en',
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	type Lang = 'en' | 'ru' | 'hy';

	const locales: Record<Lang, Record<string, string>> = { en, ru, hy };

	const storedLang = localStorage.getItem('i18nextLng');
	const initialLang: Lang = storedLang === 'ru' || storedLang === 'hy' ? storedLang : 'en';

	const [lang, setLangState] = useState<Lang>(initialLang);
	const [translations, setTranslations] = useState(locales[initialLang]);

	const setLang = (newLang: string) => {
		const langKey: Lang = newLang === 'ru' || newLang === 'hy' ? newLang : 'en';
		setTranslations(locales[langKey]);
		setLangState(langKey);
		localStorage.setItem('i18nextLng', langKey);
	};

	const t: TFunc = (key) => {
		const parts = key.split('.');
		let cur: any = translations;
		for (const p of parts) {
			if (!cur[p]) return key;
			cur = cur[p];
		}
		return typeof cur === 'string' ? cur : key;
	};

	return <I18nContext.Provider value={{ t, setLang, lang }}>{children}</I18nContext.Provider>;
};

export const useT = () => useContext(I18nContext);
