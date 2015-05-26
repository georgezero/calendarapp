CalEvent = new Mongo.Collection('calevent');

if (Meteor.isClient) {
	Template.main.rendered = function() {
		var calendar = $('#calendar').fullCalendar({
			dayClick: function(date, allDay, jsEvent, view) {
				var calendarEvent = {};
				calendar.Event.start = date;
				calendar.Event.end = date;
				calendar.Event.title = 'New Event';
				calendar.Event.owner = Meteor.userId();
				Meteor.call('saveCalEvent', calendarEvent);
			},
			events: function(start, end, callback) {
				var calEvents = CalEvent.find({}, {reactive:false}).fetch();
				callback(calEvents);
			}

		}).data().fullCalendar;

		Deps.autorun(function() {
			CalEvent.find().fetch();
			if (calendar) {
				calendar.refetchEvents();
			}
		})
	}
}

if (Meteor.isServer) {
  Meteor.startup(function () {
		Meteor.methods({
			'saveCalEvent': function(ce) {
				CalEvent.insert(ce);
			}
		});
  });
}
