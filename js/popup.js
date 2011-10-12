$(document).ready(function () {
	try {var bg = chrome.extension.getBackgroundPage();}
	catch (e) {var bg={notifies:1,logged:true,data:{new_group_page_invitations:{ count: 0, pages:{ }}, group_admin_promotions:{ count: 0, pages:{ }}, unread_friend_messages:{ count: 2}, unread_spam_messages:{ count: 0}, new_profile_wall_posts:{ count: 2}, new_friend_requests:{ count: 0, users:{ 0:{ user_id: 1234, name: "Amigo invisible", message: "Hola!"}, 1:{ user_id: 12345, name: "Amigo Imaginario", message: "Es hora de buscar amigos"}, 2:{ user_id: 123456, name: "El hombre del saco", message: "Cuidado, te estoy observando!"}}}, accepted_friend_requests:{ count: 0, friends:{ }}, new_photo_wall_posts:{ count: 0, photos:{ }}, new_tagged_photos:{ count: 0, photos:{ }}, new_event_invitations:{ count: 1, events:{ 0:{ event_id: "12345678_12345678", event_name: "¿Eres cani?"}}}, new_profile_wall_comments:{ count: 0, comments:{ }}}};}
	$('a').live('click',function(){chrome.tabs.create({url:$(this).attr('href')});});
	var content = $('.content');
	content.empty();
	var notifies = ["unread_friend_messages","unread_spam_messages","new_profile_wall_comments","new_profile_wall_posts","new_event_invitations","new_tagged_photos","new_photo_wall_posts","new_group_page_invitations",/*"group_admin_promotions","group_member_promotions",*/"new_friend_requests","accepted_friend_requests"];
	var notifies = ["unread_friend_messages","unread_spam_messages","new_profile_wall_comments","new_profile_wall_posts","new_event_invitations","new_tagged_photos","new_photo_wall_posts","new_group_page_invitations","new_friend_requests"];
	$('#content-template').tmpl(
		{notifications:notifies,notifications_count:bg.notifies,logged:bg.logged,template_name:function(key){return '#'+key+'-template'},template_data:function(key){value = bg.data[key];data = $.extend(value,{singular:value.count==1});return data;}}).appendTo(content);
	return;
	if (bg.logged) {
		if (bg.notifies==0) {
			$( "#notifications" ).hide(0);
			$( "#no-notifications" ).show(0);
		}
		else {
			var tmpl = [];
			$( "#notifications" ).show(0);
			$( "#no-notifications").hide(0);
			$.each(notifies,function(index,key) {
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
	}
});