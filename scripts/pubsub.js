export default class PublishSubscribe {
  constructor() {
    this.events = {};
  }

  // on logic can be leveraged to fulfill subscribe
  subscribe(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  // off logic can be leveraged to fulfill unsubscribe
  unsubscribe(event, handler) {
    if (this.events[event]) {
      const index = this.events[event].findIndex((item) => item === handler);
      this.events[event].splice(index, 1);
    }
  }

  // emit logic can be leveraged to fulfill unsubscribe
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler(data));
    }
  }
}
