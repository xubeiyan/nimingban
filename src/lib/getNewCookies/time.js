export const isMoreThanTillNow = (dateString, period = '1 day') => {
	if (dateString == undefined || dateString == null) {
		return false;
	}

	const milisecondPeriod =
		period == '1 day'
			? 24 * 60 * 60 * 1000
			: period == '30 days'
				? 30 * 24 * 60 * 60 * 1000
				: period == '90 days'
					? 90 * 24 * 60 * 60 * 1000
					: period == '180 days'
						? 180 * 24 * 60 * 60 * 1000
						: period == '365 days'
							? 365 * 24 * 60 * 60 * 1000
							: Number.MAX_VALUE;

	const date1 = new Date(dateString);
	const date2 = new Date();

	// console.log(date2.getTime(), date1.getTime(), milisecondPeriod);

	if (date2.getTime() - date1.getTime() > milisecondPeriod) {
		return true;
	}

	return false;
};
