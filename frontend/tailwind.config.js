/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			animation: {
				shine: 'shine 2s linear infinite',
				lineAnimat: 'line 2s ease-in-out',
				fadeIn: 'fadeIn 0.3s ease-out',
				popupShow: 'popupShow 0.4s ease-out forwards 0.1s',
				blobSlow1: 'blobSlow1 12s infinite alternate ease-in-out',
				blobSlow2: 'blobSlow2 15s infinite ease-in-out',
				blobSlow3: 'blobSlow3 9s infinite alternate ease-in-out',
				neonBorderGlow: 'neonBorderGlow 3s infinite',
				numberPulsate: 'numberPulsate 1.5s infinite ease-in-out',
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
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				popupShow: {
					'0%': { transform: 'scale(0.3) translateY(50px)', opacity: 0 },
					'100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
				},
				blobSlow1: {
					'0%': { transform: 'rotate(0deg) scale(1)', borderRadius: '45% 55% 60% 40%' },
					'50%': { transform: 'rotate(180deg) scale(1.05)', borderRadius: '60% 40% 50% 50%' },
					'100%': { transform: 'rotate(360deg) scale(1)', borderRadius: '45% 55% 60% 40%' },
				},
				blobSlow2: {
					'0%': { transform: 'rotate(360deg) scale(1)', borderRadius: '60% 40% 50% 50%' },
					'50%': { transform: 'rotate(180deg) scale(0.95)', borderRadius: '55% 45% 40% 60%' },
					'100%': { transform: 'rotate(0deg) scale(1)', borderRadius: '60% 40% 50% 50%' },
				},
				blobSlow3: {
					'0%': { transform: 'scale(0.95)', borderRadius: '55% 45% 40% 60%' },
					'100%': { transform: 'scale(1)', borderRadius: '45% 55% 60% 40%' },
				},
				neonBorderGlow: {
					'0%, 100%': { boxShadow: '0 0 40px rgba(16,185,129,0.3)', borderColor: '#10b981' },
					'50%': { boxShadow: '0 0 60px rgba(16,185,129,0.6)', borderColor: '#fff' },
				},
				numberPulsate: {
					'0%, 100%': { transform: 'scale(1)', opacity: 1 },
					'50%': { transform: 'scale(1.03)', opacity: 0.95 },
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
