class FilterItem {
  constructor() {
    this.connectFilter();
    this.getFilteredData();
  }
  connectFilter() {
    const filter = document.querySelector(".filter");
    filter.addEventListener("click", (event) => {
      this.getFilteredData(event.target.id);
    });
  }

  highlightSelectedFilter(filter) {
    const filterItem = document.getElementById(filter);
    const otherFilterItems = document.querySelectorAll(".filter li");
    otherFilterItems.forEach((otherFilter) =>
      otherFilter.classList.remove("selected")
    );
    filterItem.classList.add("selected");
  }
  getFilteredData(filterBy = "weekly") {
    fetch(
      `https://my-json-server.typicode.com/olhachuryk-dev/time-tracker-mock-json/${filterBy}`
    )
      .then((response) => response.json())
      .then((data) => {
        new ActivityItem(filterBy, data.current, data.previous);
      })
      .then(this.highlightSelectedFilter(filterBy));
  }
}

class ActivityItem {
  constructor(filter, current, previous) {
    this.filter = filter;
    this.current = current;
    this.previous = previous;
    this.activityTypes = App.activityTypes;
    this.activityImages = App.activityImages;
    for (const activity of this.activityTypes) {
      this.provideData(activity);
    }
  }

  provideData(activity) {
    const activityItem = document.querySelector(`.${activity}`);
    const currentAmount = activityItem.querySelector(".activity__time");
    const previousAmount = activityItem.querySelector(".activity__time-prev");

    currentAmount.textContent = this.current[activity] + "hrs";
    if (this.filter === "daily") {
      previousAmount.textContent =
        "Yesterday" + " - " + this.previous[activity] + "hrs";
    } else if (this.filter === "weekly") {
      previousAmount.textContent =
        "Last Week" + " - " + this.previous[activity] + "hrs";
    } else {
      previousAmount.textContent =
        "Last Month" + " - " + this.previous[activity] + "hrs";
    }
  }
}

class App {
  static activityTypes = [
    "work",
    "play",
    "study",
    "exercise",
    "social",
    "selfcare",
  ];
  static activityImages = {
    work: "./media/icon-work.svg",
    play: "./media/icon-play.svg",
    study: "./media/icon-study.svg",
    exercise: "./media/icon-exercise.svg",
    social: "./media/icon-social.svg",
    selfcare: "./media/icon-self-care.svg",
  };
  static createActivies() {
    for (const activity of this.activityTypes) {
      const newActivity = document
        .querySelector("template")
        .content.firstElementChild.cloneNode(true);
      newActivity.classList.add(activity);
      newActivity.querySelector(".activity__indicator img").src =
        this.activityImages[activity];
      newActivity.querySelector(".activity__type").textContent =
        activity.slice(0, 1).toUpperCase() + activity.slice(1);
      document.querySelector(".container").appendChild(newActivity);
    }
  }
  static activity = new FilterItem();
  static init() {}
}

App.createActivies();
