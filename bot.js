var Steam = require('steam');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var readline = require('readline');
var bot = new Steam.SteamClient();

var counter = 0;
var mostRecentSteamID;

console.log("Starting the bot and will attempt to login.");
bot.setMaxListeners(0);
logOn();
scrape();

function logOn() {
	//login
	bot.logOn({
  		accountName: 'magicka53',
 		password: '1dqqd1'
	});

	//handle logon errors
	bot.on('error', function(e) {
		console.log('[STEAM] ERROR - Logon failed!');
   		if (e.eresult == Steam.EResult.InvalidPassword) {
   			console.log('Reason: invalid password');
   		}
   		else if (e.eresult == Steam.EResult.AlreadyLoggedInElsewhere) {
    		console.log('Reason: already logged in elsewhere');
    	}
    	else if (e.eresult == Steam.EResult.AccountLogonDenied) {
    		console.log('Reason: logon denied - steam guard needed');
    	}
	});
}

function scrape() {
	chat("76561198021869935");
	/*chat("76561198047648275");
	chat("76561198022207633");
	chat("76561198070455731");*/
}

//add steam id and chat some
function chat(steamID) {
	bot.on('loggedOn', function() {
		//set online status and nickname
		bot.setPersonaState(Steam.EPersonaState.Online);
		bot.setPersonaName('Erikdaman #PROJECT7');
		bot.addFriend(steamID);

		bot.on('friend', function(friendID, relationship) {
			if (friendID == steamID && relationship == 3 && relationship != 0) {
				bot.sendMessage(steamID, 'Hi man! :)', Steam.EChatEntryType.ChatMsg);
				bot.on('message', function(source, message, type, chatter) {
					if (message != '' && steamID != mostRecentSteamID) {
						console.log('Received message: ' + message);
						sendChatMessage(source);
						mostRecentSteamID = steamID;
						setTimeout(function() {bot.removeFriend(steamID);}, 5000);
						counter = counter + 1;
						console.log("[COUNTER] Message sent to " + counter + " users.");
					};
				});
			} 
			else {
				chat(steamID);
			};
		});
	});
}

function sendChatMessage(source) {
	bot.sendMessage(source, 'Saw your profile at CSGOLounge :)', Steam.EChatEntryType.ChatMsg);
	bot.sendMessage(source, "I'm wondering if you are interested in one of our products?", Steam.EChatEntryType.ChatMsg);
	bot.sendMessage(source, 'CSGO cheat: http://project7.airforsteam.net', Steam.EChatEntryType.ChatMsg);
	bot.sendMessage(source, 'Steam UI skin: http://airforsteam.net', Steam.EChatEntryType.ChatMsg);
}

/*
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var username;

rl.question("[STEAM] Username: ", function(answer) {
	username = answer;
	logOn();
	rl.close();
});
*/