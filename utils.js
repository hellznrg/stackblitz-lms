function isJson(json) {
	if (!json) return [false, undefined];
	try {
		return [true, JSON.parse(json)];
	} catch {
		return [false, undefined];
	}
}
