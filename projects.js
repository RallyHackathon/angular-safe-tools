angular.module('rally.hackathon.intel.projects', []).service('projectLoader', function($http, $q, $rootScope){
	
	// Walk the alm project children tree to get all project/workspace oids
	// Returns all leaf projects
	this.getScopedProjects = function(rootProject){
		var self = this;
		var deferred = $q.defer();
		queue = [rootProject];
		leaves = [];

		var test = function() {
			return queue.length > 0;
		};
		async.whilst(test, function(callback){
			var toLoad = queue.shift();
			self.loadChildren(toLoad).then(function(children){
				if(_.size(children) === 0){
					leaves.push(_.extend({name:toLoad.Name, projectId:toLoad.ObjectID, workspaceId: rootProject.workspaceOid}));
				} else {
					_.each(children, function(child){ 
						queue.push(child);
					});
				}
				callback();
			});
		}, function(err){
			deferred.resolve(leaves);
			if(!$rootScope.$$phase){
				$rootScope.$digest();
			}
		});
		return deferred.promise;

	};

	this.loadChildren = function(project){
		return $http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/project/'+project.ObjectID+'/Children',
			method: 'JSONP',
			params: {
				'jsonp': 'JSON_CALLBACK'
			},
			withCredentials: true
		}).then(function(data){
			return data.data.QueryResult.Results;
		});

	};

});
