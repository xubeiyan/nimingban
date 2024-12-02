export const reduceContent = (text) => {
	const maxLength = 50;
    const splitArray = text.split('\n');
	const reducedSplitArray = splitArray.map(s => {
        if (s.length < maxLength) return s;
        return s.substring(0, maxLength).concat('...');
    });

    return reducedSplitArray.join('\n');
};
