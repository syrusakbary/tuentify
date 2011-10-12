var api = 'http://api.tuenti.com/api';
var baseurl = 'http://www.tuenti.com/';
var sid = false;
var logged;
var timecheck = 5*1000;
var t;
var state = false;
var r;
var reqs_i = 0;
var data;
var notifies = 0;
var first_login = true;
chrome.browserAction.setBadgeBackgroundColor({color:[130, 178, 75,255]});
 
function setActive (active) {
	//if (active!=state) chrome.browserAction.setIcon({path:"images/"+(active===true?"":"de")+"activated.png"});
	if (!active) chrome.browserAction.setBadgeText({text:""});
	state = active;
}
function loadSession() {
	chrome.cookies.get({url:api,name:'sid'},  function(cookie) {
		if (!cookie) {sid=false;logged = false;setActive(false);return;};
		sid = cookie.value;
		logged = true;
		first_login = true;
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
	console.log('si');
	  if (!sid || !logged) {
	  	  return;
	  }
	  t=setTimeout("checkNotifies()",timecheck);
	  var http = new XMLHttpRequest();
	  var reqs;
	  var requests = ['[["getUserNotifications",{"max_notifications":10,"types":["unread_friend_messages","unread_spam_messages","new_profile_wall_posts","new_photo_wall_posts","new_tagged_photos"]}]]',
	  				  '[["getUserNotifications",{"max_notifications":10,"types":["new_friend_requests","accepted_friend_requests","new_event_invitations","new_group_page_invitations","group_admin_promotions","group_member_promotions"]}]]',
	  				  '[["getUserNotifications",{"max_notifications":20,"types":["new_profile_wall_comments"]}]]'];
	  if (first_login) {
	  	reqs = '[["getUserNotifications",{"max_notifications":10,"types":["unread_friend_messages","unread_spam_messages","new_profile_wall_posts","new_friend_requests","accepted_friend_requests","new_photo_wall_posts","new_tagged_photos","new_event_invitations","new_group_page_invitations","group_admin_promotions","group_member_promotions"]}],["getUserNotifications",{"max_notifications":20,"types":["new_profile_wall_comments"]}]]';
		first_login = false;  
	  }
	  else {
	  	reqs = requests[reqs_i];
	  }
	  var params = '{"session_id":"'+sid+'","version":"0.6","requests":'+reqs+'}';
	  $.ajax({
	  	url: api,
	  	type: "POST",
	  	data: params,
	  	dataType: "json"}).
	  	success(function (r){
	  		d = data;
	  		$.each(r,function(key,value) {
	  			d = $.extend(d,value);
	  		});
	  		if (d.error) {
	  			data = {};
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
	  		reqs_i = (reqs_i+1)%requests.length;
	  	}).error(function(){setActive(false)});
	  
}
function onClick() {
	chrome.browserAction.setPopup('popup.html')
}
loadSession();