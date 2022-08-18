class User {
  constructor(conn, name, role = "P") {
    this.conn = conn;
    this.name = name;
    this.role = role;
    this.id = null;
    this.__id();
  }

  __id() {
    this.conn.query(
      `SELECT id FROM users WHERE username=${this.name}`,
      function (err, result) {
        if (err) throw err;
        if (result) this.id = result[0]["id"];
        else __createUser();
      }
    );
  }

  __createUser() {
    this.conn.query(
      `INSERT INTO users(name, role) VALUES("${this.name}", "${this.role}")`,
      function (err, result) {
        if (err) throw err;
        console.log(result);
      }
    );
  }

  register(eventId) {
    let events = [];
    let eventRegistrations = 0;
    let userEvent = {};

    this.conn.query(
      `SELECT count(id) FROM registrations WHERE event_id="${eventId}"`,
      function (err, result) {
        if (err) throw err;
        eventRegistrations = result[0]["count(id)"];
      }
    );
    this.conn.query(
      `SELECT start_time, end_time FROM registrations WHERE user_id="${eventId}"`,
      function (err, result) {
        if (err) throw err;
        events = result;
      }
    );
    this.conn.query(
      `SELECT start_time, end_time FROM events WHERE id=${eventId}`,
      function (err, result) {}
    );
  }
}

module.exports.User = User;
