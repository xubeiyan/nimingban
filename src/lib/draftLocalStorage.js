const getCertainTypeDraft = () => {
	let draft = window.localStorage.getItem('draft');

	if (draft == undefined) {
		draft = '[]';
	}

	const draftArray = JSON.parse(draft);

	return draftArray;
};

// 向 localstorage 中保存 type 类型的草稿
const saveToLocalStorage = (type, content, id = null) => {
	if (content == null) return;
	const draftArray = getCertainTypeDraft(type);
	const filtered = draftArray.filter((one) => one.type == type);

	if (filtered.length == 1) {
		filtered[0].content = content;
		if (id != null) {
			filtered[0].id = id;
		}
	} else {
		if (id == null) {
			draftArray.push({ type, content });
		} else {
			draftArray.push({ type, id, content });
		}
	}

	window.localStorage.setItem('draft', JSON.stringify(draftArray));
};

// 从 localstorage 中获取 type 类型的草稿
const loadFromLocalStorage = (type, id) => {
	const draftArray = getCertainTypeDraft(type);
	const filtered = draftArray.filter((one) => one.type == type);

	if (filtered.length == 1 && filtered[0].id == id) {
		return filtered[0].content;
	}

	return null;
};

// 从 localstorage 中移除 type 类型的草稿
const removeFromLocalStorage = (type) => {
	const draftArray = getCertainTypeDraft(type);
	const filtered = draftArray.filter((one) => one.type != type);
	window.localStorage.setItem('draft', JSON.stringify(filtered));
};

export { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage };
