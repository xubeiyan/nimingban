export const reduceContent = (text) => {
	const maxLength = 50;
	const splitArray = text.split('\n');
	const threeLine = splitArray.slice(0, 3);
	const reducedSplitArray = threeLine.map((s) => {
		if (s.length < maxLength) return s;
		return s.substring(0, maxLength).concat('...');
	});

	return reducedSplitArray.join('\n');
};
