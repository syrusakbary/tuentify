$(document).ready(function () {
	var bg = chrome.extension.getBackgroundPage();
	$('a').live('click',function(){chrome.tabs.create({url:$(this).attr('href')});});
	
	if (bg.logged) {
		if (bg.notifies==0) {
			$( "#notifications" ).hide(0);
			$( "#no-notifications" ).show(0);
		}
		else {
			var tmpl = [];
			$( "#notifications" ).show(0);
			$( "#no-notifications").hide(0);
			$.each(["unread_friend_messages","unread_spam_messages","new_profile_wall_comments","new_profile_wall_posts","new_event_invitations","new_tagged_photos","new_photo_wall_posts","new_group_page_invitations",/*"group_admin_promotions","group_member_promotions",*/"new_friend_requests","accepted_friend_requests"],function(index,key) {
				try {
				var t = '#'+key+'-template';
				value = bg.data[key];
				data = $.extend(value,{singular:value.count==1});
				if (value.count>0) $.tmpl( '{{tmpl "'+t+'" }}',value).appendTo( "#notifications" );
				if (key=="new_tagged_photos") $.tmpl( '<li class="tags_thumbs">{{tmpl "#photos-template" }}</li>',value.photos).appendTo( "#notifications" );
				
				}
				catch (e) {}
			});
		}
	}
	else {
		chrome.tabs.create({url:'http://www.tuenti.com'});
		window.close();
	}
});