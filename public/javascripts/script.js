//const dotenv = require('dotenv');
//dotenv.config();

//var socket = io.connect(`http://localhost:${process.env.SOCKET_PORT}`);
var socket = io.connect('http://localhost:8010');

// Add dynamic html bot content(Widget style) ----------------------------
// You can also add the html content in html page and still it will work!
var mybot =
  '<div class="chatCont" id="chatCont">' +
  '<div class="bot_profile">' +
  '<img src="../images/jamie.png" class="bot_p_img">' +
  '<div class="close">' +
  '<i class="fa fa-times" aria-hidden="true"></i>' +
  '</div>' +
  '</div><!--bot_profile end-->' +
  '<div id="result_div" class="resultDiv"></div>' +
  '<div class="chatForm" id="chat-div">' +
  '<div class="spinner">' +
  '<div class="bounce1"></div>' +
  '<div class="bounce2"></div>' +
  '<div class="bounce3"></div>' +
  '</div>' +
  '<input type="text" id="chat-input" autocomplete="off" placeholder="Type here to start chatting..."' +
  'class="form-control bot-txt"/>' +
  '</div>' +
  '</div><!--chatCont end-->' +
  '<div class="profile_div">' +
  '<div class="row">' +
  '<div class="col-hgt">' +
  '<img src="../images/jamie.png" class="img-circle img-profile">' +
  '</div><!--col-hgt end-->' +
  '<div class="col-hgt">' +
  '<div class="chat-txt">' +
  'Chat now!' +
  '</div>' +
  '</div><!--col-hgt end-->' +
  '</div><!--row end-->' +
  '</div><!--profile_div end-->';

$('mybot').html(mybot);

// ------------------------------------------ Toggle chatbot -----------------------------------------------
$('.profile_div').click(function () {
  $('.profile_div').toggle();
  $('.chatCont').toggle();
  $('.bot_profile').toggle();
  $('.chatForm').toggle();
  document.getElementById('chat-input').focus();
});

$('.close').click(function () {
  $('.profile_div').toggle();
  $('.chatCont').toggle();
  $('.bot_profile').toggle();
  $('.chatForm').toggle();
});

// Session Init (is important so that each user interaction is unique)--------------------------------------
var session = function () {
  // Retrieve the object from storage
  if (sessionStorage.getItem('session')) {
    var retrievedSession = sessionStorage.getItem('session');
  } else {
    // Random Number Generator
    var randomNo = Math.floor(Math.random() * 1000 + 1);
    // get Timestamp
    var timestamp = Date.now();
    // get Day
    var date = new Date();
    var weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    var day = weekday[date.getDay()];
    // Join random number+day+timestamp
    var session_id = randomNo + day + timestamp;
    // Put the object into storage
    sessionStorage.setItem('session', session_id);
    var retrievedSession = sessionStorage.getItem('session');
  }
  return retrievedSession;
  // console.log('session: ', retrievedSession);
};

// Call Session init
var mysession = session();

// on input/text enter--------------------------------------------------------------------------------------
$('#chat-input').on('keyup keypress', function (e) {
  var keyCode = e.keyCode || e.which;
  var text = $('#chat-input').val();
  if (keyCode === 13) {
    if (text == '' || $.trim(text) == '') {
      e.preventDefault();
      return false;
    } else {
      $('#chat-input').blur();
      setUserResponse(text);
      //send(text);
      send2(text);
      e.preventDefault();
      return false;
    }
  }
});

//------------------------------------------- Send request to API.AI ---------------------------------------
function send2(text) {
  // sending message to chatbot
  socket.emit('fromClient', { client: `${text}` });
  //  console.log('client : ', text);
}

socket.on('fromServer', function (data) {
  // recieveing a reply from chatbot
  //console.log('chatbot : ', data.server);
  //console.log('received server response');
  setBotResponse(data.server);
  //addAction();
});

//------------------------------------------- Send request to API.AI ---------------------------------------
function send(text) {
  $.ajax({
    type: 'GET',
    url: baseUrl + 'query=' + text + '&lang=en-us&sessionId=' + mysession,
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    // data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
    success: function (data) {
      main(data);
      // console.log(data);
    },
    error: function (e) {
      console.log(e);
    },
  });
}

//------------------------------------ Set bot response in result_div -------------------------------------
function setBotResponse(val) {
  setTimeout(function () {
    val = val.replace(new RegExp('\r?\n', 'g'), '<br />');
    val = val.replace(/<p.*?>/g, '');
    val = val.replace(/<\/p>/g, '');
    var BotResponse =
      '<p class="botResult"><strong style="color:#288187";>TaigerBot</strong> :<br>' +
      val +
      '</p><div class="clearfix"></div>';
    console.log(BotResponse);
    $(BotResponse).appendTo('#result_div');
    scrollToBottomOfResults();
    hideSpinner();
    setFocus();
  }, 500);
}

//------------------------------------- Set user response in result_div ------------------------------------
function setUserResponse(val) {
  var UserResponse =
    '<div style="float: right;"><p class="userEnteredText"><strong style="color:#E9AA2E";>You</strong> :<br>' +
    val +
    '</p><div class="clearfix"></div></div>';
  $(UserResponse).appendTo('#result_div');
  $('#chat-input').val('');
  scrollToBottomOfResults();
  showSpinner();
}

//---------------------------------- Scroll to the bottom of the results div -------------------------------
function scrollToBottomOfResults() {
  var terminalResultsDiv = document.getElementById('result_div');
  terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

//---------------------------------------- Ascii Spinner ---------------------------------------------------
function showSpinner() {
  $('.spinner').show();
}
function hideSpinner() {
  $('.spinner').hide();
}
function setFocus() {
  document.getElementById('chat-input').focus();
}

send2('hello');
setFocus();

//$(document).ready(function () {
//}
