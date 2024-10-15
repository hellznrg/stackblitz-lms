const MOCK = true;

const m = angular.module("lms", []);

m.service("error", function () {
	this.errors = [];
	this.throw = (message, error) => {
		this.errors.push(`${message}${error ? "\n" + JSON.stringify(error, null, 1) : ""}`);
		throw error;
	};

	this.nextError = () => this.errors[0];

	this.acknowledgeError = () => this.errors.shift();

	this.numErrors = () => this.errors.length;
});

m.service("db", function ($http, error) {
	if (MOCK) {
		this.getData = async () => {
			let [result, cached] = isJson(localStorage.getItem("data"));
			if (!result) {
				$http.get("/api/data.json").then(
					(response) => {
						localStorage.setItem("data", JSON.stringify(response.data));
						return response.data;
					},
					(e) => {
						error.throw("Error occurred when trying to retrieve data", e);
					},
				);
			} else {
				return cached;
			}
		};

		let entityKeys;

		this.getStructure = async () => {
			let [result, cached] = isJson(localStorage.getItem("structure"));
			if (!result) {
				$http.get("/api/structure.json").then(
					(response) => {
						const structure = response.data;
						Object.values(structure).forEach((value) => {
							value.fields.sort((x, y) => x.order - y.order);
						});
						localStorage.setItem("structure", JSON.stringify(structure));
						cached = structure;
					},
					(e) => {
						error.throw("Error occurred when trying to retrieve data", e);
					},
				);
			}

			this.getStructure().then((structure) => {
				entityKeys = {};
				for (let e of Object.keys(structure)) {
					entityKeys[e] = structure[e].fields.find((x) => x.key).name;
				}
			});

			return cached;
		};

		this.getKeyFieldName = (entity) => {
			return entityKeys[entity];
		};

		this.saveRecord = async (entity, entityId, data) => {
			const keyFieldName = this.getKeyFieldName(entity);
			let [result, cached] = isJson(localStorage.getItem("data"));
			if (!result) {
				await this.getData().then((data) => {
					cached = data;
				});
			}

			if (entityId == "") {
				if (cached[entity].some((x) => x[keyFieldName] == data[keyFieldName])) {
					error.throw(`A record with ID=${data[keyFieldName]} already exists.`);
				}
			} else {
				cached[entity] = cached[entity].filter((x) => x[keyFieldName] != entityId);
			}
			cached[entity].push(data);
			localStorage.setItem("data", JSON.stringify(cached));
		};

		this.deleteRecord = async (entity, entityId) => {
			const keyFieldName = this.getKeyFieldName(entity);
			let [result, cached] = isJson(localStorage.getItem("data"));
			if (result) {
				cached[entity] = cached[entity].filter((x) => x[keyFieldName] != entityId);
				localStorage.setItem("data", JSON.stringify(cached));
			} else {
				error.throw(`Unable to delete ${entity} record "${entityId}`);
			}
		};
	}
});

m.controller("mainCtrl", function ($scope, db, error) {
	db.getStructure().then((structure) => {
		$scope.entities = structure;
	});
	$scope.shared = { selectedEntity: "book" };

	$scope.resetData = () => {
		localStorage.removeItem("data");
		location.reload();
	};

	$scope.resetStructure = () => {
		localStorage.removeItem("structure");
		location.reload();
	};

	$scope.numErrors = () => error.numErrors();
	$scope.nextError = () => error.nextError();
	$scope.acknowledgeError = () => error.acknowledgeError();
	$scope.errorButtons = [
		{
			text: "Acknowledge",
			action: () => {
				$scope.acknowledgeError();
			},
		},
	];
});
