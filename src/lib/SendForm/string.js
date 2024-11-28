const nullStringToEmpty = (input) => {
	if (input == 'null') {
		return null;
	}

	return input;
};

const nullToDefaultString = ({ type, value }) => {
	const defaultString = {
		poster_name: '无名氏',
		poster_email: 'no@name.net',
		title: '无标题'
	};

	if (value != null) return value;

	if (type == 'poster_name') {
		return defaultString.poster_name;
	} else if (type == 'poster_email') {
		return defaultString.poster_email;
	} else if (type == 'title') {
		return defaultString.title;
	} else {
		return value;
	}
};

export { nullStringToEmpty, nullToDefaultString };
