var autoCompl = new GoogleAutoComplete();
Template.routeHelper.events({
  'focus input[name="route-origin"]': function(e, t){
    autoCompl.geolocate();
  },
  'focus input[name="route-destination"]': function(e, t){
    autoCompl.geolocate();
  }
})


Template.routeHelper.rendered = function() {
  //删除路线信息
  Session.set('Direction.routes',null);
  
  autoCompl.init('route-origin', function(place){
    searchForRoute(place);
  });

  autoCompl.init('route-destination', function(place){
    searchForRoute(place);
  });

  //交换出发地按钮
  //保存原有的data，然后塞进后来形成的DOM
  $('body').off('click','.switchPlace').on('click','.switchPlace',function(){
    
  })

  function searchForRoute(place){
    //删除路线信息
    Session.set('Direction.routes',null);
    //get lat, lng from searched location
    if (typeof place != "undefined") {
      if(place.geometry.location){
        $('#route-destination').data('mapLat',place.geometry.location.k).data('mapLng',place.geometry.location.D);
      }
    }

    var origin = $('#route-origin').data('mapLat')+","+$('#route-origin').data('mapLng');
    var destination = $('#route-destination').data('mapLat')+","+$('#route-destination').data('mapLng');
    if (!CommonHelper.isEmptyString(origin) && !CommonHelper.isEmptyString(destination)){
      var mode;
      $('.travel-mode').each(function(){
        if ($(this).hasClass('selected')) {
          mode = $(this).data('travel-mode');
        }
      })
      if (typeof mode == "undefined") {
        mode = 'driving';
      }
      GoogleDirection.to(origin,destination,mode,function(data){
        if (data) {
          Session.set('Direction.routes',data.routes);
        }
      })
    }
  }

  $('body').off('click','.travel-mode').on('click','.travel-mode',function(){
    $('.travel-mode').removeClass('selected');
    $(this).addClass('selected');
    searchForRoute();
  })
}

Template.routeHelper.helpers({
  routes: function(){
    return Session.get('Direction.routes');
  }
})