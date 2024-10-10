m.directive("lmsDialog", function () {
	return {
		restrict: "E",
		templateUrl: "dialog/template.html",
		transclude: true,
		scope: {
			show: "=",
			showAttr: "@",
			title: "@",
			message: "@",
			buttons: "=",
			transclude: "@",
		},
		controller: [
			"$scope",
			function ($scope) {
				$scope.show = false;
				$scope.showAttr = "false";

				$scope.showResult = () => $scope.show === true || ($scope.showAttr?.toLowerCase() || "") === "true";

				$scope.choose = (action) => {
					if (action) action();
					$scope.show = false;
					$scope.showAttr = "false";
				};

				$scope.parseTransclude = () => {
					if ($scope.transclude === undefined || $scope.transclude.toLowerCase() === "false") return false;
					if ($scope.transclude === "" || $scope.transclude.toLowerCase() === "true") return true;
					throw "Invalid 'transclude' value";
				};
			},
		],
	};
});
