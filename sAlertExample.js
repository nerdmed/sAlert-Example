if (Meteor.isClient) {

  var myCounter = new ReactiveVar(0);

  Template.hello.helpers({
    counter: function () {
      return myCounter.get();
    }
  });

  Template.sAlertWithCounter.helpers({
    counter: function () {
      return myCounter.get();
    }
  });

  Template.hello.events({
    'click button': function () {
      myCounter.set( myCounter.get() + 1 );
    }
  });

  // Variant A - just passing the object / this works like i would expect in meteor - i dont need to know that you are using local
  // collections to manage the message
  Template.hello.onRendered(function(){
    var warningThatWeWantToCloseLater = sAlert.warning({ message: 'Please register', counter: myCounter }, {timeout: 'none'});
  })

  // Variant B - tracking / updating
  // this requires understanding of your package, a database call, a tracker, to get the messsage updated. 
  Template.hello.onRendered(function(){
    var warningThatWeWantToCloseLater = sAlert.warning({ message: 'Please register', counter: myCounter.get() }, {timeout: 'none'});
    this.autorun(function(){
      var counter = myCounter.get();
      // check if the message has a counter
      sAlert.collection.update({_id: warningThatWeWantToCloseLater},{$set:{
        counter: counter
      }});
    })
  })

  Meteor.startup(function () {
      sAlert.config({
          effect: 'stackslide',
          position: 'top-right',
          timeout: 3000,
          html: false,
          stack: true,
          offset: 0
      });
  });
}