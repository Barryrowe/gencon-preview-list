'use strict';

(function(){
	angular
		.module('genconPreview')
		.config(function($stateProvider, $urlRouterProvider) {

			console.log("config started");
		  // Ionic uses AngularUI Router which uses the concept of states
		  // Learn more here: https://github.com/angular-ui/ui-router
		  // Set up the various states which the app can be in.
		  // Each state's controller can be found in controllers.js
		  $stateProvider

		  // setup an abstract state for the tabs directive
		  .state('tab', {
		    url: '/tab',
		    abstract: true,
		    templateUrl: 'app/templates/tabs.html'
		  })

		  // Each tab has its own nav history stack:

		  .state('tab.mylist', {
		    url: '/mylist',
		    views: {
		      'tab-mylist': {
		        templateUrl: 'app/mylist/mylist.html',
		        controller: 'MyListCtrl as vm'
		      }
		    }
		  })

		  .state('tab.chats', {
		      url: '/chats',
		      views: {
		        'tab-chats': {
		          templateUrl: 'app/templates/tab-chats.html',
		          controller: 'ChatsCtrl'
		        }
		      }
		    })
		    .state('tab.chat-detail', {
		      url: '/chats/:chatId',
		      views: {
		        'tab-chats': {
		          templateUrl: 'app/templates/chat-detail.html',
		          controller: 'ChatDetailCtrl'
		        }
		      }
		    })

		  .state('tab.account', {
		    url: '/account',
		    views: {
		      'tab-account': {
		        templateUrl: 'app/templates/tab-account.html',
		        controller: 'AccountCtrl'
		      }
		    }
		  });

		  // if none of the above states are matched, use this as the fallback
		  $urlRouterProvider.otherwise('/tab/mylist');

		});

	console.log("routes ready");
})();