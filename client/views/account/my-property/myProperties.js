Template.myProperties.rendered = function() {
  render();

  //switch type
  $("body").off('change',"input[name=propertyStatus]").on('change',"input[name=propertyStatus]",function(){
    var type = $(this).val();
    Session.set('MyProperties.type',type);
  })
}

MyPropertiesController = RouteController.extend({
  data: function () {
    var params = this.params
      , statusType = params.type || 'open'
      , pageLimit = 6
      , pageNum = 1;

    var queryFilter = {
      author: Meteor.userId(),
      status: 'open'
    };

    if(typeof Session.get('MyProperties.type')!="undefined"){
      statusType = Session.get('MyProperties.type');
    }

    if(params.page && CommonHelper.isInteger(params.page)){
      pageNum = params.page;
    }

    if(statusType){
      switch(statusType){
        case 'inactive':
          queryFilter.status = {$in:['closed','deal']};
          break;
        case 'administrated':
          queryFilter.status = {$in:['expired','violate']};
          break;
      }
    }

    var totalDocs = Properties.find(queryFilter).count()
      , totalPages = Math.ceil(totalDocs / pageLimit)

      , paginatedDocs = Properties.find(
                          queryFilter,
                          { _id: 1, address:1, price:1, photos:1, createdAt: 1, sort: {createdAt: -1},
                            skip: (pageNum-1)*pageLimit, limit: pageLimit }
                        )

      , statusCount = Properties.find(
                        {author: Meteor.userId()},
                        {status: 1}
                      ).fetch();

    var statusCountMapping = {};
    for(var i=0; i<statusCount.length; i++){
      var sts = statusCount[i].status;
      if(statusCountMapping[sts] == undefined){
        statusCountMapping[sts] = 1;
      } else {
        statusCountMapping[sts]++;
      }
    }

    return {
      properties: paginatedDocs,
      totalActive: statusCountMapping['open'] || 0,
      totalInactive: (statusCountMapping['closed'] || 0) + (statusCountMapping['deal'] || 0),
      totalAdministered: (statusCountMapping['expired'] || 0) + (statusCountMapping['violate'] || 0),
      totalDocs: totalDocs,
      paginationConfig: {
        'config': {
          pageNum: pageNum,
          pageLimit: pageLimit,
          windowSize: 5, // asa # of pages displayed in the pagination must be odd number
          totalDocs: totalDocs,
          routeName: 'myproperty',
          routeParam: {type: statusType}
        }
      },
      propertyStatus: Config.getAllPropertyStatus()
    }
  }
});