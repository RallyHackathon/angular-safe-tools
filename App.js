var module = angular.module('rally.hackathon.intel', [
	'rui.alm.projectPicker',
	'rally.hackathon.intel.api',
	'rally.hackathon.intel.release',
	'rally.hackathon.intel.projects',
	'rally.hackathon.intel.portfolio'
]);

module.config(function($slmProvider) {
	$slmProvider.setBaseUrl("https://rally1.rallydev.com/slm/");
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

module.controller('RootCtrl', function($scope, $log, releaseLoader, portfolioItemLoader, projectLoader){
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
		$scope.teamCommitment[project.projectId] = {};
		$scope.teamCommitment[project.projectId][pi.ObjectID] = teamCommitStatus.value;
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
		});
	});
});

