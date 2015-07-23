'use strict';

(function(){
	angular
		.module('genconPreview')
		.factory('MyListService', MyListService);

	MyListService.$inject = ['Storage'];
	function MyListService(Storage){

		var MY_GAMES_KEY = "myGamesList",
			_myGames;

		function _getMyGames(){
			if(_myGames === undefined){
				_myGames = Storage.get(MY_GAMES_KEY, true);				
			}

			if(_myGames === undefined){
				_myGames = [
					{name: "Champions of Midgard",
					 description: "Something about Champions of Midgard and Vikings" }
				];
			}

			return _myGames;
		}

		function _saveMyGames(){			
			Storage.save(MY_GAMES_KEY, _myGames);
		}

		var _service = {
			getMyGames: _getMyGames,
			saveMyGames: _saveMyGames
		};

		return _service;
	}
})();