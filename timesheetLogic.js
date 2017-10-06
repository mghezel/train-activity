/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve train info from the train database.
// 4. Create a way to calculate the hour and minute worked
// 5. Calculate next arrival time and minutes away

// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyAX8YkYCplY8_YcEgWNvw3G8OzeFc-7qxo",
    authDomain: "button-proj.firebaseapp.com",
    databaseURL: "https://button-proj.firebaseio.com",
    projectId: "button-proj",
    storageBucket: "button-proj.appspot.com",
    messagingSenderId: "746121916089"
  };
  firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var firstTrainTime = moment($("#time").val().trim(), "HH:mm").format("HH:mm");
  var trainFrequency = $("#frequency").val().trim();

  // Creates local "temporary" object for holding train data
  var addTrain = {
    name: trainName,
    destination: trainDestination,
    time: firstTrainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(addTrain);

  // Logs everything to console
  console.log(addTrain.name);
  console.log(addTrain.destination);
  console.log(addTrain.time);
  console.log(addTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#time").val("");
  $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrainTime);
  console.log(trainFrequency);

  
  var firstTrainTime = moment(firstTrainTime, "HH:mm").format("HH:mm");
  console.log("f");
  console.log(firstTrainTime);

  var trainMinute = moment(firstTrainTime, "HH:mm").minute();
  var trainHour = moment(firstTrainTime, "HH:mm").hour();
  var trainHour = parseInt(trainHour);
  console.log(trainMinute, trainHour);

  
  var addMinute = parseInt(trainMinute) + parseInt(trainFrequency);
  var addMinute = parseInt(addMinute);
  //var nextArrival1 = moment(trainHour+':'+addMinute,'HH:mm');
  var nextArrival1 = moment(trainHour+':'+trainMinute,'HH:mm');
  var nextArrival = moment(nextArrival1).add(trainFrequency, 'minute').format('HH:mm');
  //var minutesAway = trainMinute + trainFrequency; // this is not correct
  //This is the correct code for minutesAway
  var currentTime = moment().format("HH:mm");
  var minutesAway = moment(nextArrival).diff(currentTime);
  console.log(moment(minutesAway).format("mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextArrival +"</td><td>" + minutesAway + "</td><td>");

});

