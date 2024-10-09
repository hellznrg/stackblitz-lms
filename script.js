const MOCK = true;

const m = angular.module("lms", []);

m.service("db", function ($http) {
	const errorHandler = (error) => {
		console.error("Error fetching structure data:", error);
		throw error;
	};

	if (MOCK) {
		this.getData = (successFn) => {
			let [result, cached] = isJson(localStorage.getItem("data"));
			if (!result) {
				$http.get("/api/data.json").then((response) => {
					localStorage.setItem("data", JSON.stringify(response.data));
					successFn(response.data);
				}, errorHandler);
			} else {
				successFn(cached);
			}
		};

		this.getStructure = (successFn) => {
			let [result, cached] = isJson(localStorage.getItem("structure"));
			if (!result) {
				$http.get("/api/structure.json").then((response) => {
					const structure = response.data;
					Object.values(structure).forEach((value) => {
						value.fields.sort((x, y) => x.order - y.order);
					});
					localStorage.setItem("structure", JSON.stringify(structure));
					successFn(structure);
				}, errorHandler);
			} else {
				successFn(cached);
			}
		};

		this.getKeyFieldName = (entity, successFn) => {
			this.getStructure((structure) => {
				const keyFieldName = Object.values(structure[entity].fields).find((x) => x.key).name;
				successFn(keyFieldName);
			});
		};

		this.deleteRecord = (entity, entityId, successFn) => {
			this.getKeyFieldName(entity, (keyFieldName) => {
				let [result, cached] = isJson(localStorage.getItem("data"));
				if (result) {
					cached[entity] = cached[entity].filter((x) => x[keyFieldName] != entityId);
					localStorage.setItem("data", JSON.stringify(cached));
					successFn();
				}
			});
		};
	}
});

m.controller("mainCtrl", function ($scope, db) {
	db.getStructure((structure) => {
		$scope.entities = structure;
	});
	$scope.shared = { selectedEntity: "book" };
	$scope.dialog = false;

	$scope.resetData = () => {
		localStorage.removeItem("data");
		location.reload();
	};

	$scope.resetStructure = () => {
		localStorage.removeItem("structure");
		location.reload();
	};
});

m.directive("virtual", function () {
	return {
		restrict: "E",
		template: "<div ng-transclude></div>",
		transclude: true,
		replace: true,
		scope: {},
		controller: function ($scope, $element, $transclude) {
			$transclude(function (clone) {
				$element.after(clone);
				$element.css("display", "none");
			});
		},
	};
});
