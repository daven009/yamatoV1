//Messages
Template.messages.rendered = function () {
  $('body').popover({
    html : true, 
    selector : '#messageHelper',
    content: function() {
      return $('#message-box').html();
    },
    title: "回复助手",
    placement: "bottom",
    trigger: "click",
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content background-color-grey-light"></div></div>'
  });
};

Template.messages.helpers({
  messages: function(){
    var unreads = Messages.find(
      {
        owner: Meteor.userId(),
        isRead: false,
        isValid: true
      }
    );
    if (unreads.count() > 0) {
      var returnTopics = [];
      var groupedTopics = _.groupBy(_.pluck(unreads.fetch(), 'topicId'));
      _.each(_.values(groupedTopics), function(topics) {
        var topic = Topics.find({_id:topics[0]}).fetch();
        returnTopics.push(topic);
      });
      return returnTopics;
    }
    else {
      return false;
    };
  }
});