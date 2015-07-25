'use strict';

describe('The BGG Preview List Controller', function(){

    var bggListCtrl;

    beforeEach(function(){
        bard.appModule('genconPreview');
        bard.inject('$q', '$rootScope', '$controller', 'BGGService', 'Storage');
        bard.mockService(BGGService, {
            loadGenconPreviewList: $q.when([])
        });


        bggListCtrl = $controller('BGGListCtrl');
    });

    it('should exist', function(){
        expect(bggListCtrl).toBeDefined();
    });
});
