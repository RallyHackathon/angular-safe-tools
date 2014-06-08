describe('insights.movers.calculator', function(){
	
	beforeEach(angular.mock.module('insights.movers.calculator'))
	beforeEach(inject(function(variationCalculator){
		this.variationCalculator = variationCalculator;
		this.projectData = {
			scopes: [
				// This is the project scores
				{
					dataPoints: [
						{
							data: {
								'Quality': {
									score: 1
								}
							},
							month: '2014-01'
						}
					]
				},
				// This is the workspace scores
				{
					dataPoints: [
						{
							data: {
								'Quality': {
									score: 2
								}
							},
							month: '2014-01'
						}
					]
				}
			]
		}
	}))
	
	describe('getDimensionScores', function(){
		
		it('should pluck out the dimension scores and return an array', function(){
			var result = this.variationCalculator.getDimensionScores(this.projectData.scopes[0], 'Quality');
			expect(result).toEqual(['1'])
		});
		
	});

	describe('getDifferenceFromScores', function(){
		
		it('should calculate the difference between project and workspace scores', function(){
			var result = this.variationCalculator.getDifferenceFromScores([1,2,3], [4,5,6]);
			expect(result).toEqual([3,3,3])
		});
	});

	describe('calculateVariationForProject', function(){

		it('should calculate the difference relative to the workspace average', function(){
			var result = this.variationCalculator.calculateVariationForProject(this.data)
			expect(result).toBeDefined()
		})

	})

})
