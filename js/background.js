var api = 'http://api.tuenti.com/api';
var baseurl = 'http://www.tuenti.com/';
var sid = false;
var logged;
var timecheck = 2.5*1000;
var t;
var state = false;
var r;
var data;
var notifies = 0;
chrome.browserAction.setBadgeBackgroundColor({color:[130, 178, 75,255]});
 
function setActive (active) {
	if (active!=state) chrome.browserAction.setIcon({path:"images/"+(active===true?"":"de")+"activated.png"});
	if (!active) chrome.browserAction.setBadgeText({text:""});
	state = active;
}
function loadSession() {
	chrome.cookies.get({url:api,name:'sid'},  function(cookie) {
		if (!cookie) {sid=false;logged = false;setActive(false);return;};
		sid = cookie.value;
		logged = true;
		checkNotifies();
	});
}
chrome.cookies.onChanged.addListener(function(changeInfo) {
	var cookie = changeInfo.cookie;
	if (cookie.name == 'sid' && cookie.domain.indexOf('tuenti.com') > -1) {
		loadSession();
	}
});

function checkNotifies () {
	  if (!sid || !logged) {
	  	  return;
	  }
	  t=setTimeout("checkNotifies()",timecheck);
	  var http = new XMLHttpRequest();
	  var params = '{"session_id":"'+sid+'","version":"0.6","requests":[["getUserNotifications",{"max_notifications":8,"types":["unread_friend_messages","unread_spam_messages","new_profile_wall_posts","new_friend_requests","accepted_friend_requests","new_photo_wall_posts","new_tagged_photos","new_event_invitations","new_group_page_invitations","group_admin_promotions","group_member_promotions"]}],["getUserNotifications",{"max_notifications":20,"types":["new_profile_wall_comments"]}]]}';
	  
	  $.ajax({
	  	url: api,
	  	type: "POST",
	  	data: params,
	  	dataType: "json"}).
	  	success(function (r){
	  		d = {};
	  		$.each(r,function(key,value) {
	  			d = $.extend(d,value);
	  		});
	  		if (d.error) {
	  			setActive(false);
	  			return;
	  		}
	  		notifies = 0;
	  		$.each(d,function(key,value) {
	  			notifies += value.count;
	  		});
	  		data = d;
	  		
	  		text = "";
	  		if (notifies>0) text=""+notifies;
	  		chrome.browserAction.setBadgeText({text:text});
	  		setActive(true);
	  	}).error(function(){setActive(false)});
	  
}
function onClick() {
	if (state) {
		chrome.browserAction.setPopup('popup.html')
	}
	else {
		chrome.tabs.create({url:baseurl}, function (tab) {});
	}
}
loadSession();