'use strict';

(function(){
	angular
		.module('genconPreview')
		.controller('GameDetailCtrl', GameDetailCtrl);

	GameDetailCtrl.$inject = ['$stateParams', 'BGGService'];
	function GameDetailCtrl($stateParams, BGGService){
		var vm = this;

		activate();

		function activate(){
			vm.game = BGGService.getGameById($stateParams.gameId);
		}
	}
	
})();