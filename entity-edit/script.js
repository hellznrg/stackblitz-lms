m.directive("entityEdit", function () {
	return {
		restrict: "E",
		templateUrl: "entity-edit/template.html",
		scope: {
			entity: "@",
			key: "@",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				$scope.getRecord = function () {
					const structure = $scope.getStructure();
					const keyField = db.data[$scope.entity].find((x) => x);
					return db.data[$scope.entity].find((x) => x);
				};
				$scope.getStructure = function () {
					return db.structure[$scope.entity];
				};
			},
		],
	};
});
