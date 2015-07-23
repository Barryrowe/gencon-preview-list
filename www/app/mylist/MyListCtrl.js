'use strict';

(function(){
	angular
		.module('genconPreview')
		.controller('MyListCtrl', MyListCtrl);

	MyListCtrl.$inject = ['MyListService'];
	function MyListCtrl(MyListService){
		var vm = this;

		activate();

		function activate(){
			vm.myGames = MyListService.getMyGames();
			console.log("My Games", vm.myGames);
		}
	}

})();