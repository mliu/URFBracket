(function () {

	var app = angular.module('LeagueBracketDirective', []);

	app.directive('leagueBracket', ['$window', '$timeout', function ($window, $timeout) {
		return {
			restrict: "EA",
			scope: {
				data: '=data',
				depths: '=depths'
			},
			link: function (scope, element, attrs) {
				var svg = d3.select(element[0])
					.append('svg')
					.style('width', '100%')
					.style('height', '100%');

				scope.$watchGroup(['data'], function () {
					if(timer) {
						$timeout.cancel(timer);
						timer = null;
					}
					timer = $timeout(function () {
						scope.render(scope.buildTree(scope.data));
					}, 1000);
				});

				// Recursive function to build the d3 node tree
				scope.buildTree = function (tree, tree_depth, position) {
					if(tree_depth == depths.length) { return; }
					else {
						var batch = scope.data["batch" + scope.depths[tree_depth]];
						tree.team_id = batch[position];
						tree.left = [];
						tree.right = [];
						tree.left.push(buildTree({}, tree_depth + 1, 2 * position));
						tree.right.push(buildTree({}, tree_depth + 1, 2 * position + 1));
						return tree;
					}
				}

				scope.render = function (data) {
					var margin = {top: 30, right: 20, left: 20, bottom: 30},
						width = d3.select(element[0]).node().offsetWidth;
						height = d3.select(element[0]).node().offsetHeight;
				}
			}
		};
	}]);
})();
