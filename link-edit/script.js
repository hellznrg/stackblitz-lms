m.directive("linkEdit", function () {
	return {
		restrict: "E",
		templateUrl: "link-edit/template.html",
		scope: {
			linkFromField: "=",
			value: "=",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				if ($scope.linkFromField.type == "link") {
					if ($scope.linkFromField.multiplicity == "many" && !Array.isArray($scope.value)) $scope.value = [];

					db.getData((data) => {
						const keyFieldName = db.getKeyFieldName($scope.linkFromField.link);
						$scope.data = data[$scope.linkFromField.link];
						$scope.keys = $scope.data.map((x) => x[keyFieldName]);
					});
				}
			},
		],
	};
});
