"use strict";
// [3:55:07 PM] Louis Murphy: https://chirperlouism.firebaseio.com/chat/.json

var chirperApp = {};
chirperApp.Tweets = [];
chirperApp.showAllMyTweets = true;
chirperApp.showAllTimelineTweets = true;
chirperApp.showAllFriendTweets = true;
chirperApp.urlBase = 'https://chirperlouism.firebaseio.com/';
chirperApp.users = [];
chirperApp.friends = [];
chirperApp.friendsUntilDisplay = 0;
chirperApp.friendsTweetsUntilDisplay = 0;


Array.prototype.remove = function (index) {
    if (index < this.length) {
        this.splice(index, 1);
    }
}

chirperApp.Tweet = function (user, timestamp, tweet) {
    this.user = user;
    this.timestamp = timestamp;
    this.tweet = tweet;
}

/*
  <label for="userID">Enter Your Name:</label>
                        <input type="text" id="userID" /><br />
                        <label for="timestampID">Timestamp:</label>
                        <input type="text" id="timestampID" /><br />
                        <label for="tweetID">Tweet:</label>
                        <input type="text" id="tweetID" /><br />
                        <label for="locationID">Location:</label>
                        <input type="text" id="locationID"/><br />
                        <label for="photoID">Photo:</label>
                        <input type="text" id="photoID" label>
*/

chirperApp.showAllModalFields = function () {
    $("#timestampDiv, #tweetDiv, #photoDiv, #userNameDiv, #locationDiv, #friendURLDiv").show();
    //$("#tweetDiv").show();
    //$("#photoDiv").show();
    //$("#userNameDiv").show();
    //$("#locationDiv").show();
    //$("#friendURLDiv").show();
}

chirperApp.launchUserForm = function () {
    this.showAllModalFields();
    // Hide timestamp
    $("#timestampDiv, #tweetDiv, #friendURLDiv").hide();
    //$("#tweetDiv").hide();
    //$("#friendURLDiv").hide();
    document.getElementById('saveTweetID').onclick = function () { chirperApp.addUser(); }

    $('#myModal1').modal();
}

// Only want url
chirperApp.launchFriendForm = function () {
    this.showAllModalFields();
    // Hide timestamp
    $("#timestampDiv, #tweetDiv, #photoDiv, #userNameDiv, #locationDiv").hide();
    //$("#tweetDiv").hide();
    //$("#photoDiv").hide();
    //$("#userNameDiv").hide();
    //$("#locationDiv").hide();
    document.getElementById('saveTweetID').onclick = function () { chirperApp.addFriend(); }
    $('#myModal1').modal();
}

chirperApp.updateFriendForm = function (index) {
    this.showAllModalFields();
    // Hide timestamp
    $("#timestampDiv, #tweetDiv, #photoDiv, #userNameDiv,#locationDiv").hide();
    //$("#tweetDiv").hide();
    //$("#photoDiv").hide();
    //$("#userNameDiv").hide();
    //$("#locationDiv").hide();
    $('#saveTweetID').html('Update Friend Info');
    $('#myModalLabel').html('Edit Friend Info');
    // Put existing url into field
    var friend = this.friends[index];
    var url = friend.url;
    $('#friendURLID').val(url);
    document.getElementById('saveTweetID').onclick = function () { chirperApp.updateFriend(index); }
    $('#myModal1').modal();
}

chirperApp.updateUserForm = function () {
    this.showAllModalFields();
    // Hide timestamp
    $("#timestampDiv, #tweetDiv, #friendURLDiv").hide();
    //$("#tweetDiv").hide();
    //$("#photoDiv").hide();
    //$("#userNameDiv").hide();
    //$("#locationDiv").hide();
    $('#saveTweetID').html('Update User Info');
    $('#myModalLabel').html('Edit User Info');
    // Put existing url into field
    var user = this.users[0];

    $('#userID').val(user.profile.name);
    $('#photoID').val(user.profile.photo);
    $('#locationID').val(user.profile.location);
    document.getElementById('saveTweetID').onclick = function () { chirperApp.updateUser(); }
    $('#myModal1').modal();
}


chirperApp.launchTweetForm = function () {
    this.showAllModalFields();
    var tStamp = new Date();
    $("#photoDiv, #locationDiv, #friendURLDiv").hide();
    //$("#locationDiv").hide();
    //$("#friendURLDiv").hide();
    $('#timestampID').val(tStamp);
    // disable so timestamp can't be changed
    $("#timestampID").prop('disabled', true);

    document.getElementById('saveTweetID').onclick = function () { chirperApp.addTweet(); }
    $('#myModal1').modal();
}

chirperApp.displayAllMyTweets = function (all) {
    this.showAllMyTweets = all ? true : false;
    this.displayTweets(-2);
}
chirperApp.displayAllTimelineTweets = function (all) {
    this.showAllTimelineTweets = all ? true : false;
    this.displayTweets(-1);
}
chirperApp.displayAllFriendTweets = function (all, index) {
    this.showAllFriendTweets = all ? true : false;
    this.displayTweets(index);
}


// Dislay the Tweets - index represents friend index. 
// index == -1 represents all friends i.e. show timeline
// index == -2 represents user
chirperApp.displayTweets = function (index) {
    var tweetsToDisplay = [];
//    alert('entered display tweets');
    // Show user
    if (index == -2) {
        //$('#myTweetsTab').addClass('active');
        tweetsToDisplay = this.Tweets;
    }
    // Show timeline - put all tweets into one array
    else if (index == -1) {
        //$('#timelineTab').addClass('active');
         for (var i = 0; i < this.friends.length; i++){
            var tweets = this.friends[i].tweets;
            for (var ii = 0; ii < tweets.length; ii++){
                tweetsToDisplay.push(tweets[ii]);
            }
        }
    }
    // just showing tweets of one friend
    else if ((index < this.friends.length) && (index >= 0)) {
        $('#myTweetsTab, #timelineTab, #panel0, #panel1').removeClass('active');
 //       $('#timelineTab').removeClass('active');
        $('#singleFriendTweets, #panel2').addClass('active');
 //       $('#panel2').addClass('active');
        tweetsToDisplay = this.friends[index].tweets;
    }

    if (!tweetsToDisplay.length) {
        console.log('made display without having any tweets!')
        return;
    }
    var h = ''; 
 
    // Start by sorting tweets
    tweetsToDisplay.sort(function (a, b) {
        if (moment(a.timestamp).unix() < moment(b.timestamp).unix()) {
            return -1;
        }
        else if (moment(a.timestamp).unix() > moment(b.timestamp).unix()) {
            return 1;
        }
        else {
            return 0;
        }

    });

    var start = 0;
    if ((!this.showAllMyTweets && index == -2) || (!this.showAllTimelineTweets && index == -1) || (!this.showAllFriendTweets && index >= -1)) {
        if (tweetsToDisplay.length > 5) {
            var start = tweetsToDisplay.length - 5;
        }
    }
//    alert('building list in display tweets');
    for (var i = start; i < tweetsToDisplay.length; i++) {
        var tweet = tweetsToDisplay[i];
        h += '<div class="row tweet">';
        // If showing user tweets, allow delete button - 4 columns
        if (index == -2) {
            h += '<div class="col-md-2 column center-block">' + tweet.user + '</div>';
            h += '<div class="col-md-5 column center-block">' + tweet.message + '</div>';
            h += '<div class="col-md-3 column center-block">' + moment(tweet.timestamp).format('lll') + '</div>';
            h += '<div class="col-md-2 column center-block"><button class="btn btn-primary btn-xs" onclick="chirperApp.deleteTweet(' + i + ')">Delete Tweet</button></div>';
        }
            // only 3 columns
        else { 
            h += '<div class="col-md-4 column center-block">' + tweet.user + '</div>';
            h += '<div class="col-md-4 column center-block">' + tweet.message + '</div>';
            h += '<div class="col-md-4 column center-block">' + moment(tweet.timestamp).format('lll') + '</div>';            
        }

        h += '</div> <br />'; //row
    }

 //   alert('ready to write tweets in display tweets');

    // Display user tweets
    if (index == -2){
        if (this.showAllMyTweets) {
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllMyTweets(false)">Show Fewer Tweets</button><br/>';
        }
        else{
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllMyTweets(true)">Show All Tweets</button><br/>';
        }
        document.getElementById('tweetTable').innerHTML = h;
    }
    else if (index == -1){
        if (this.showAllTimelineTweets) {
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllTimelineTweets(false)">Show Fewer Tweets</button><br/>';
        }
        else{
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllTimelineTweets(true)">Show All Tweets</button><br/>';
        }
        document.getElementById('timelineTable').innerHTML = h;
    }
    else if (index >= 0) {
        if (this.showAllFriendTweets) {
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllFriendTweets(false, ' + index + ')">Show Fewer Tweets</button><br/>';
        }
        else {
            h += '<button class="btn btn-primary center-block btn-sm" onclick="chirperApp.displayAllFriendTweets(true, ' + index + ')">Show All Tweets</button><br/>';
        }
        document.getElementById('friendsTweetTable').innerHTML = h;
    }

}


// Add user
chirperApp.addUser = function () {
    var data = {
        name: $('#userID').val(),
        photo: $('#photoID').val(),
        location: $('#locationID').val()
    }

    var config = {
        verb: 'POST',
        uRL: this.buildRequestURL('profile/.json'),
        success: function (config, data) {
            var user = config.data;
            user.id = data.name;
            chirperApp.users[0] = user;
        },
        error: chirperApp.errorCallback,
        data: data
    }
    firebaseRequest(config);
}

// Getting the friend profile was succesfull, now push friend into the friends array and write their URL to local users database
chirperApp.putNewFriend = function (friendBaseURL) {
    var newFriend = {
        url: friendBaseURL
    };
     var config = {
        verb: 'POST',
        uRL: this.buildRequestURL('friends/.json'),
        error: chirperApp.errorCallback,
        data: newFriend
    }
    firebaseRequest(config);
}

// Getting the friend profile was succesfull, now push friend into the friends array and write their URL to local users database
chirperApp.patchFriend = function (friendBaseURL, index) {
    var newFriend = {
        url: friendBaseURL
    };
    var id = this.friends[index].id;
    var config = {
        verb: 'PATCH',
        uRL: this.buildRequestURL(id, '/.json'),
        error: chirperApp.errorCallback,
        data: newFriend
    }
    firebaseRequest(config);
}

// Add user - take url from dialog, read item from their database an them put in friends array, and write their url to our database
chirperApp.addFriend = function () {
    var friendBaseURL = $('#friendURLID').val();
    var config = {
        verb: 'GET',
        uRL: friendBaseURL + 'profile/.json',
        success: function (config, data) {
            for (var m in data) {
                var friend = data[m];
                friend.id = m;
                friend.url = friendBaseURL;
                friend.tweets = [];
                chirperApp.friends.push(friend);
            };
            // now write friend URL to local user database
            chirperApp.putNewFriend(friendBaseURL);
        },
        error: chirperApp.errorCallback,
    }
    firebaseRequest(config);
}


// Update Friend - take url from dialog, read item from their database and replace in friends array, and patch their url to our database
chirperApp.updateFriend = function (index) {

    var friendBaseURL = $('#friendURLID').val();
    var id = this.friends[index].id;
    var newFriend = {
        url: friendBaseURL
    };
    var config = {
        verb: 'PATCH',
        uRL: this.buildRequestURL('friends/', id, '/.json'),
        index: index,
        data: newFriend,
        success: function (config, data) {
            var friend = chirperApp.friends[index];
            friend.url = friendBaseURL;
            friend.tweets = [];
            chirperApp.loadUserAndFriends();
        },
        error: chirperApp.errorCallback,
    }
    firebaseRequest(config);
}

// Update user - take url from dialog, read item from their database and replace in friends array, and patch their url to our database
chirperApp.updateUser = function () {

    var friendBaseURL = $('#friendURLID').val();
    var id = this.users[0].id;
    var updateUser = {
        name: $('#userID').val(),
        photo: $('#photoID').val(),
        location: $('#locationID').val()
    };
    var config = {
        verb: 'PATCH',
        uRL: this.buildRequestURL('profile/', id, '/.json'),
        data: updateUser,
        success: function (config, data) {
            var user = chirperApp.users[0];
            user.name = config.data.name;
            user.photo = config.data.photo;
            user.location = config.data.location;
            chirperApp.loadUserAndFriends();
        },
        error: chirperApp.errorCallback,
    }
    firebaseRequest(config);
}

// Create Tweet
chirperApp.addTweet = function () {
    var user = $('#userID').val();
    var timestamp = $('#timestampID').val();
    var tweet = $('#tweetID').val();

    var newTweet = new this.Tweet(user, timestamp, tweet);

    var config = {
        verb: 'POST',
        uRL: this.buildRequestURL('tweets/.json'),
        success: chirperApp.createSuccess,
        error: chirperApp.errorCallback,
        data: newTweet
    }
    firebaseRequest(config);
}


chirperApp.deleteTweet = function (index) {
    var tweet = this.Tweets[index];
    var config = {
        verb: 'DELETE',
        uRL: chirperApp.buildRequestURL(tweet.id, '.json'),
        success: function (config, data) {
            chirperApp.Tweets.remove(index);
            chirperApp.displayTweets(-2);
        },
        error: chirperApp.errorCallback
    };
    firebaseRequest(config);
}

var firebaseRequest = function (config) {
    var request = new XMLHttpRequest();
    request.open(config.verb, config.uRL);
    request.onload = function () {
        if (this.status >= '200' && this.status < '400') {
            if (config.success && typeof (config.success) == 'function') {
                var data = JSON.parse(this.response);
                // kind of a hack
                config.success(config, data);
            }
        } else {
            if (config.error && typeof (error) == 'function') {
                config.error(this.status);
            }
        }
    }
    request.onerror = function () {
        if (error && typeof (error) == 'function') {
            error(this.status);
        }
    }

    // Only Put and update have data
    if (config.data) {
        request.send(JSON.stringify(config.data))
    }
    else {
        request.send();
    }

}

chirperApp.buildRequestURL = function () {

    var url = chirperApp.urlBase;
    for (var i = 0; i < arguments.length; i++) {
        url += arguments[i];
    }
    return url;
}

chirperApp.createSuccess = function (config, data) {
    var tweet = config.data;
    tweet.id = data.name;
    chirperApp.Tweets.push(tweet);
    chirperApp.displayTweets(-2);

}
chirperApp.showUserFriendsInfo = function (user){
    var profileDiv = user ? ($('#friendProfiles')) : ($('#friendProfiles'));
    var array = [];
    if (user) {
        array = this.users;
    }
    else {
        array = this.friends;
    }
    var h = '';
    for (var i = 0; i < array.length; i++) {
    var person = array[i];
        h += '<div class="friendsInfo">';
        h += '<img src = "' + person.profile.photo + '" height="50" width="50"/></br />';
        h += '<p>Name: ' + person.profile.name + '<br />Location: ' + person.profile.location + '<p>';
        if (!user) {
            h += '<a href="#panel2" data-toggle="tab"><button class="btn btn-primary btn-default center-block btn-xs" onclick="chirperApp.updateFriendForm(' + i + ')">Edit Friend</button></a><br/>'
            h += '<button class="btn btn-primary btn-default center-block btn-xs" onclick="chirperApp.displayTweets(' + i + ')"> Show Tweets</button>'
        }
        else {
            chirperApp.updateUserForm
            h += '<a href="#panel2" data-toggle="tab"><button class="btn btn-primary btn-default center-block btn-xs" onclick="chirperApp.updateUserForm()">Edit User</button></a><br/>'
        }
        h += '<hr/>'
        h += '</div>';
    }
    if (user) {
        h += '<button class="btn-xs btn-primary btn-default center-block" data-toggle="modal" onclick="chirperApp.launchUserForm()">Add User</button>'
        $('#userProfile').html(h);
    }
    else{
        h += '<button class="btn-xs btn-primary btn-default center-block" data-toggle="modal" onclick="chirperApp.launchFriendForm()">Add A Friend</button>'
        $('#friendProfiles').html(h);
    }

}

chirperApp.showUserInfo = function () {
    var friendProfDiv = $('#friendProfiles');
    var h = '';
    for (var i = 0; i < this.friends.length; i++) {
        var user = this.user[i];
        h += '<div class="friendsInfo">';
        h += '<img src = "' + friend.profile.photo + '" height="50" width="50"/></br />';
        h += '<p>Name: ' + friend.profile.name + '<br />Location: ' + friend.profile.location + '<p>';
        h += '<button class="btn btn-primary btn-default center-block btn-xs" onclick="chirperApp.displayTweets(' + i + ')"> Show Tweets</button><br/>'
        h += '<hr/>'
        h += '</div>';
    }
    h += '<button class="btn-xs btn-primary btn-default center-block" data-toggle="modal" onclick="chirperApp.launchFriendForm()">Add A Friend</button>'
    friendProfDiv.html(h);
   
}
chirperApp.loadUserTweetSuccess = function (config, data) {
//    chirperApp.Tweets.length = 0;

    for (var m in data) {
        var tweet = data[m];
        tweet.id = m;
        chirperApp.Tweets.push(tweet);
    }

    chirperApp.displayTweets(-2);
}

chirperApp.loadFriendTweetSuccess = function (config, data) {
    var friend = chirperApp.friends[config.index];
        friend.tweets.length = 0;
    for (var m in data) {
        var tweet = data[m];
        tweet.id = m;
        friend.tweets.push(tweet);
    }
     chirperApp.friendsTweetsUntilDisplay--;
    if (chirperApp.friendsTweetsUntilDisplay == 0) {
        chirperApp.displayTweets(-1);
    }

}

//Read
chirperApp.loadTweets = function () {
    var config = {
        verb: 'GET',
        uRL: this.buildRequestURL('tweets/.json'),
        success: chirperApp.loadUserTweetSuccess,
        error: chirperApp.errorCallback
    };

    firebaseRequest(config);
}


//change chirpApp.loadmTweets to take in array to push and url so can use on friends or local user
chirperApp.loadUserTweets = function () {
    chirperApp.Tweets.length = 0;
    // first configure to read/add users messaeges
    var that = this;
    var tweetExt = 'tweets/.json';
    var config = {
        verb: 'GET',
        uRL: that.buildRequestURL(tweetExt),
        success: chirperApp.loadUserTweetSuccess,
        error: chirperApp.errorCallback,
    };
    firebaseRequest(config);
}

//change chirpApp.loadmTweets to take in array to push and url so can use on friends or local user
chirperApp.loadFriendsTweets = function () {
    var that = this;
    var tweetExt = 'tweets/.json';
    // ************* when connect tweets with the friend need to send multiple objects so messge array doesn't get killed.
    // Now loop through friends and add their tweets - first just add to local user tweets then come back and add to their own list (spit up display)
    // To avoid displaying friends each time a friend is added, we are going to use a counter
    chirperApp.friendsTweetsUntilDisplay = this.friends.length;
    for (var i = 0; i < this.friends.length; i++) {
        var friend = this.friends[i];
        friend.tweets = [];
        var configFriend = {
            verb: 'GET',
            index: i,
            uRL: friend.url + tweetExt,
            success: chirperApp.loadFriendTweetSuccess,
            error: chirperApp.errorCallback
        }
        firebaseRequest(configFriend);
    }
}

chirperApp.errorCallback = function (status) {
    alert('Error Occurred: ' + status);
}

chirperApp.extractAndPush = function (array, data) {
    //    chirperApp.Tweets.length = 0;

    for (var m in data) {
        var item = data[m];
        item.id = m;
        array.push(item);

    }
}

chirperApp.loadUserSuccess = function (config, data) {
    for (var m in data) {
        var user = {};
  
        user.profile = data[m];
        user.id = m;
        chirperApp.users.push(user);
    }
    chirperApp.loadUserTweets();
    chirperApp.showUserFriendsInfo(true);
}

chirperApp.loadFriendProfileSuccess = function (config, data) {
    var friend = chirperApp.friends[config.index];
    for (var m in data) {
        friend.profile = data[m];
        friend.profile.id = m;

        chirperApp.friendsUntilDisplay--;
    }
    if (chirperApp.friendsUntilDisplay == 0) {
        chirperApp.showUserFriendsInfo(false);
        chirperApp.loadFriendsTweets();
    }
        
}

// Once we get the friends from the local user's database, load each friend's profile info into the friends array
chirperApp.loadFriendSuccess = function (config, data) {
    // Add friends to the friend Array
    var friends = chirperApp.friends;
    chirperApp.extractAndPush(friends, data);
    // Now for each friend, load their profile data
    chirperApp.friendsUntilDisplay = friends.length;
    for (var i = 0; i < friends.length; i++) {
        var profileExt = 'profile/.json';
        var configUser = {
            verb: 'GET',
            uRL: friends[i].url + 'profile/.json',
            index: i,
            success: chirperApp.loadFriendProfileSuccess,
            error: chirperApp.errorCallback
        };
        // Add tweet array to each friend, in case we end up in dispay before tweets are loaded
        friends[i].tweets = [];
        firebaseRequest(configUser);
    }
}

chirperApp.loadUserAndFriends = function () {
    // empty out user and friends. We may be calling this because of a user/friend update
    this.users.length = 0;
    this.friends.length = 0;

    // first load user
    var that = this;
    var profileExt = 'profile/.json';
    var configUser = {
        verb: 'GET',
        uRL: that.buildRequestURL('profile/.json'),
        array: that.users,
        success: that.loadUserSuccess,
        error: that.errorCallback
    };
    firebaseRequest(configUser);
    // use seperate object because we don't want the array field to change before user gets inserted.
    var configFriends = {
        verb: 'GET',
        uRL: that.buildRequestURL('friends/.json'),
        array: that.friends,
        success: that.loadFriendSuccess,
        error: that.errorCallback
    };
    // make request to get friends
    firebaseRequest(configFriends);
}

chirperApp.loadUserAndFriends();
//chirperApp.showUserFriendsInfo();

//chirperApp.loadUserAndFriends();
//chirperApp.loadAllTweets();

// setInterval(function () { chirperApp.loadAllTweets(); chirperApp.displayTweets(-2); chirperApp.displayTweets(-1) }, 10000);
setInterval(function () { chirperApp.loadUserTweets(); chirperApp.loadFriendsTweets(); }, 10000);

//$(document).ready(function () {
//    $("#myTweetsTab, #timelineTab, #singleFriendTweets").click(function () {
//        $("#myTweetsTab, #timelineTab, #singleFriendTweets").removeClass('active');
//        $(this).addClass('active');
//    });


    //$('#myTweetsTab').removeClass('active');
    //$('#timelineTab').removeClass('active');
    //$('#singleFriendTweets').removeClass('active');

//})
