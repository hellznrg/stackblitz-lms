m.filter("format", function () {
	return (input, format) => {
		if (format == "localeDate") return new Date(input).toLocaleDateString();
		else return "";
	};
});
