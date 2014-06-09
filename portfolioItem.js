angular.module('rally.hackathon.intel.portfolio', []).service('portfolioItemLoader', function($http, $q, $rootScope){

	this.getPortfolioItemsByRelease = function(release) {
		return $http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature?workspace='+release.Workspace._ref+'&query=(Release = /release/'+release.ObjectID+')&fetch=Name,ObjectID,FormattedID,Owner,c_CFTeamCommit',
			method: 'JSONP',
			params: {
				'jsonp': 'JSON_CALLBACK'
			},
			withCredentials: true
		});
	};

	this.save = function(portfolioItem, data, authKey) {
		return $http({
			url: 'https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/'+portfolioItem.ObjectID+'?key='+authKey,
			method: 'POST',
			data: data,
			withCredentials: true
		});
	};

});
