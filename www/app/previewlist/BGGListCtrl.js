'use strict';

(function(){
	angular
		.module('genconPreview')
		.controller('BGGListCtrl', BGGListCtrl);

	BGGListCtrl.$inject = ['BGGService', '$ionicLoading'];
	function BGGListCtrl(BGGService, $ionicLoading){
		var vm = this;

		activate();	

		function activate(){

			vm.orderBy = "-score";
				
			$ionicLoading.show({
				template: "Loading GenCon Preview List"
			});		
			BGGService.loadGenconPreviewList()
			.then(function(data){
				vm.games = data;								
			})
			.catch(function(err){				
				console.error(err);
			})
			.finally(function(){				
				$ionicLoading.hide();
			});

		}
	}
})();