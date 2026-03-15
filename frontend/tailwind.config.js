/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			animation: {
				shine: 'shine 2s linear infinite',
				lineAnimat: 'line 2s ease-in-out',
			},

			keyframes: {
				line: {
					'0%': { width: '0%' },
					'100%': { width: '100%' },
				},

				shine: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
			},
			dropShadow: {},
			boxShadow: {},
		},
		fontSize: {
			xxs: '8px',
			xs: '12px',
		},
		screens: {
			//@media max-width
			desktop: { min: '1111px' },
			tab: { max: '1110px' },
			mob: { max: '767px' },

			short: { raw: '(max-height: 492px)' },
		},
	},
	plugins: [],
};
