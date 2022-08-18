class Event {
  constructor(name, location, startTime, endTime) {
    this.name = name;
    this.location = location;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  update(conn) {}
}

module.exports.Event = Event;
