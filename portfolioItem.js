angular.module('rally.hackathon.intel.portfolio', []).service('portfolioItemLoader', function($http, $q, $rootScope){
	
	this.getPortfolioItemsByRelease = function(release){
		return $http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature?workspace='+release.Workspace._ref+'&query=(Release = /release/'+release.ObjectID+')&fetch=Name,ObjectID,FormattedID,Owner,c_CFTeamCommit',
			method: 'JSONP',
			params: {
				'jsonp': 'JSON_CALLBACK'
			}
		});
	};

});
