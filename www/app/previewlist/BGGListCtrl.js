'use strict';

(function(){
	angular
		.module('genconPreview')
		.controller('BGGListCtrl', BGGListCtrl);

	BGGListCtrl.$inject = ['BGGService'];
	function BGGListCtrl(BGGService){
		var vm = this;

		activate();

		function activate(){			
			BGGService.loadGenconPreviewList()
			.then(function(data){
				vm.games = data;
			});
		}

		vm.loadGameDetails = function(game){
			BGGService.loadGameDetails(game["@attributes"].objectid)
			.then(function(details){
				game.details = details;
				console.log(game.details);
			})
			.catch(function(err){
				game.error = err;
			});
		};

		vm.getGameImageUrl = function(game){
			return game.details.boardgames.boardgame.image['#text'];
		}

	}
})();