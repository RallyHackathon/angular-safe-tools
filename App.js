var module = angular.module('rally.hackathon.intel', [
	'rui.alm.projectPicker',
	'rally.hackathon.intel.release',
	'rally.hackathon.intel.projects',
	'rally.hackathon.intel.portfolio'
]);

module.config(function($slmProvider, $httpProvider) {
	$slmProvider.setBaseUrl("https://rally1.rallydev.com/slm/");

	//$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:1337/';
	//$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:''},
    launch: function() {
        angular.bootstrap(document.body, ['rally.hackathon.intel']);
        var scope = angular.element(document.body).scope();
        scope.app = this.getContext().map.map;
        scope.$digest();
        $('#root').attr('style', 'display:block;');
        $('body').removeClass('x-body');
        $('html').removeClass('x-viewport');
    }
});

module.run(function($rootScope, $timeout){
	$rootScope.app = $rootScope.app || {};
	$timeout(function() {
		$('html').removeClass('x-viewport');
	});
});

module.controller('RootCtrl', function($scope, $log, $http, releaseLoader, portfolioItemLoader, projectLoader){
	$scope.art = {
		availableReleases: [],
		portfolioItems: [],
		projects: []
	};

	$scope.teamCommitValues = [
		{name: "Committed", value: "Committed"},
		{name: "Not Committed", value: "Not Committed"},
		{name: "Not Applicable", value: "Not Applicable"}
	];

	$scope.teamCommitSelectShow = {};

	$scope.teamCommitment = {};

	$scope.setTeamCommitment = function(project, pi, teamCommitStatus) {
		$scope.teamCommitment[pi.ObjectID] = {};
		$scope.teamCommitment[pi.ObjectID][project.projectId] = teamCommitStatus.value;

		console.log("saving PI commitments:", pi.ObjectID);
		portfolioItemLoader.save(pi, {c_CFTeamCommit: $scope.teamCommitment[pi.ObjectID]}, $scope.authorizationKey).then(function(data, status) {
			console.log("status", status, "data", data);
		});
	};

	$scope.$watch('art.selectedProject', function(){
		releaseLoader.getProjectReleases($scope.art.selectedProject, $scope.app.workspace).then(function(results) {
			$scope.art.availableReleases = results.data.QueryResult.Results;
		});

		$scope.art.selectedProject.ObjectID = $scope.art.selectedProject.oid;
		projectLoader.getScopedProjects($scope.art.selectedProject).then(function(projects){
			$scope.art.projects = projects;
		});
	});

	$scope.$watch('art.selectedRelease', function(){
		portfolioItemLoader.getPortfolioItemsByRelease($scope.art.selectedRelease).then(function(results) {
			$scope.art.portfolioItems = results.data.QueryResult.Results;
			// TODO fill in teamCommitment from results
		});
	});

	$scope.authorizationKey = undefined;

	var getAuthorizationKey = function() {
		$http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/security/authorize',
			method: 'JSONP',
			params: {
				'jsonp': 'JSON_CALLBACK'
			}
		}).then(function(response) {
			$scope.authorizationKey = response.data.OperationResult.SecurityToken;
		});
	};

	getAuthorizationKey();

});

