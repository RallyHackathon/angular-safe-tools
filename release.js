angular.module('rally.hackathon.intel.release', []).service('releaseLoader', function($http, $q, $rootScope){
	
	this.getProjectReleases = function(rootProject, workspace){
		return $http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/release?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/'+rootProject.workspaceOid+'&query=(Project = /project/'+rootProject.oid+')&projectScopeDown=true&projectScopeUp=false&fetch=Name,ObjectID,Workspace',
			method: 'JSONP',
			params: {
				'jsonp': 'JSON_CALLBACK'
			},
			withCredentials: true
		});
	};

});
