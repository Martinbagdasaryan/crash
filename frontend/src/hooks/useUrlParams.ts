export const useUrlParams = (): Record<string, string | null> => {
	const params = new URLSearchParams(window.location.search);
	const result: Record<string, string | null> = {};

	params.forEach((value, key) => {
		result[key] = value;
	});

	return result;
};
