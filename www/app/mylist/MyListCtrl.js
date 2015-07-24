'use strict';

(function(){
	angular
		.module('genconPreview')
		.controller('MyListCtrl', MyListCtrl);

	MyListCtrl.$inject = ['MyListService', 'BGGService'];
	function MyListCtrl(MyListService, BGGService){
		var vm = this;

		activate();

		function activate(){
			vm.myGames = MyListService.getMyGames();
			console.log("My Games", vm.myGames);

			BGGService.loadGenconPreviewList()
			.then(function(data){
				vm.myGames = data;
			});
		}
	}

})();