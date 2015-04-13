(function () {

	var app = angular.module('LeagueBracketDirective', []);

	app.directive('leagueBracket', ['$window', '$timeout', 'appConfig', function ($window, $timeout, appConfig) {
		return {
			restrict: "EA",
			scope: {
				data: '=data',
				depths: '=depths'
			},
			link: function (scope, element, attrs) {
				var margin = {top: 30, right: 20, left: 20, bottom: 30};
				var imageDimensions = 30;
				var svg = d3.select(element[0])
					.append('svg')
					.style('width', "100%")
					.style('height', "100%")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var diagonal = d3.svg.diagonal()
					.projection(function(d) { return [d.y, d.x]; });

		        $window.onresize = function () {
		          scope.windowInnerWidth = angular.element($window)[0].innerWidth;
		          scope.$apply();
		        };

				var timer = null;
				scope.$watch('data', function () {
					var root = buildTree({}, 0, 0);
					scope.render(root);
				});
				scope.$watch('windowInnerWidth', function () {
					if(timer) {
						$timeout.cancel(timer);
						timer = null;
					}
					timer = $timeout(function () {
						svg.selectAll('*').remove();
						var root = buildTree({}, 0, 0);
						scope.render(root);
					}, 200);
				});

				var getChildren = function(d){
					var a = [];
					if(d.left) for(var i = 0; i < d.left.length; i++){
						d.left[i].isRight = false;
						d.left[i].parent = d;
						a.push(d.left[i]);
					}
					if(d.right) for(var i = 0; i < d.right.length; i++){
						d.right[i].isRight = true;
						d.right[i].parent = d;
						a.push(d.right[i]);
					}
					return a.length?a:null;
				}

				// Flattens the tree back into one big children tree
				var rebuildChildren = function(node) {
					node.children = getChildren(node);
					if(node.children) { node.children.forEach(rebuildChildren); }
				}

				// Recursive function to build the d3 node tree
				var buildTree = function (tree, tree_depth, position, side) {
					if(tree_depth == scope.depths.length) { return; }
					var batch = scope.data["batch" + scope.depths[tree_depth]];
					if(position == batch.length) { return; }
					else {
						tree.team_id = batch[position];
						if(side) {
							tree[side] = [];
							var node = buildTree({}, tree_depth + 1, 2 * position, side);
							if(node) {
								tree[side].push(node);
							}
							var node2 = buildTree({}, tree_depth + 1, 2 * position + 1, side);
							if(node2) {
								tree[side].push(node2);
							}
						} else {
							tree.left = [];
							tree.right = [];
							tree.left.push(buildTree({}, tree_depth + 1, 2 * position, "left"));
							tree.right.push(buildTree({}, tree_depth + 1, 2 * position + 1, "right"));
						}
						return tree;
					}
				}

				var toArray = function(item, arr){
				  arr = arr || [];
				  var i = 0, l = item.children?item.children.length:0;
				  arr.push(item);
				  for(; i < l; i++){
				    toArray(item.children[i], arr);
				  }
				  return arr;
				};

				var openMenu = function(node){
					svg.selectAll("rect.menu").remove();
					svg.selectAll("image.menu-image").remove();
					var rect = svg.append("g")
						.append("rect")
						.attr("class", "menu")
						.attr("width", imageDimensions + 20)
						.attr("height", imageDimensions + 20)
						.attr("transform", "translate(" + (node.y - (imageDimensions + 20)/2) + "," + (node.x + imageDimensions/2) + ")");
					console.log(rect);
					for(var i=0;i<node.children.length;i++) {
						svg.append("image")
							.attr("class", "menu-image")
							.attr("width", imageDimensions)
							.attr("height", imageDimensions)
							.attr("xlink:href", appConfig.IMAGE_BASE_URL + appConfig[node.children[i].team_id] + ".png")
							.attr("transform", "translate(" + (node.y - imageDimensions) + "," + (node.x + 20) + ")");
						svg.append("image")
							.attr("class", "menu-image")
							.attr("width", imageDimensions)
							.attr("height", imageDimensions)
							.attr("xlink:href", appConfig.IMAGE_BASE_URL + appConfig[node.children[i].team_id] + ".png")
							.attr("transform", "translate(" + (node.y + 2) + "," + (node.x + 20) + ")");
					}
				}

				scope.render = function (data) {
					var width = d3.select(element[0]).node().offsetWidth - margin.right - margin.left,
						height = d3.select(element[0]).node().offsetHeight - margin.top - margin.bottom,
						tree = d3.layout.tree()
							.size([height, width]),
						treeLeft = d3.layout.tree()
							.size([height, width/2])
							.children(function(d) { return d.left }),
						treeRight = d3.layout.tree()
							.size([height, width/2])
							.children(function(d) { return d.right });

					treeLeft.nodes(data);
					treeRight.nodes(data);
					rebuildChildren(data);
					data.isRight = false;

					var	nodes = toArray(data),
						links = tree.links(nodes),
						i=0;
					console.log(nodes);
					nodes.forEach(function(d) { var ypos = (d.depth * width / (scope.depths.length * 2 - 1)) + width/2; d.y = (d.isRight ? (-ypos+width):ypos); })

					var node = svg.selectAll("g.node")
						.data(nodes, function(d) { return d.id || (d.id = ++i); });
					var link = svg.selectAll("path.link")
						.data(links, function(d) { return d.target.id; });

					var nodeEnter = node.enter().append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
						.on("click", function(d) { openMenu(d) });
					nodeEnter.append("image")
						.attr("width", imageDimensions)
						.attr("height", imageDimensions)
						.attr("xlink:href", function(d) { return appConfig.IMAGE_BASE_URL + appConfig[d.team_id] + ".png"; })
						.attr("transform", "translate(" + (-imageDimensions) + "," + -(imageDimensions/2) + ")");
					nodeEnter.append("image")
						.attr("width", imageDimensions)
						.attr("height", imageDimensions)
						.attr("xlink:href", function(d) { return appConfig.IMAGE_BASE_URL + appConfig[d.team_id] + ".png"; })
						.attr("transform", "translate(2," + (-imageDimensions/2) + ")");
					link.enter().insert("path", "g")
						.attr("class", "link")
						.attr("d", diagonal);
				}
			}
		};
	}]);
})();
