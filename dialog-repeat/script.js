m.directive("lmsDialogRepeat", function () {
	return {
		restrict: "E",
		templateUrl: "dialog-repeat/template.html",
		transclude: true,
		scope: {
			show: "=",
			title: "@",
			message: "@",
			buttons: "=",
			transclude: "@",
			transcludedScope0: "=",
			transcludedScope1: "=",
			transcludedScope2: "=",
			transcludedScope3: "=",
			transcludedScope4: "=",
			transcludedScope5: "=",
			transcludedScope6: "=",
			transcludedScope7: "=",
			transcludedScope8: "=",
			transcludedScope9: "=",
		},
		controller: [
			"$scope",
			function ($scope) {
				$scope.hide = () => {
					$scope.show = 0;
				};
				$scope.show = 0;

				$scope.showTimes = () => [...Array($scope.show)];

				$scope.choose = (action) => {
					if (action) action();
					$scope.show = 0;
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
