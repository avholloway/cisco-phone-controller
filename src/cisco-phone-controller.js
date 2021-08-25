(function() {
	
var app = {

	log: function(msg) {
		console.log(msg);
	},

	phone: {},
	
	macro: {},

	init: function() {
		
		// Try to find our entry point on the page, if this is a Cisco Phone page
		// which we support, and in a locale we support.  We're just looking
		// for the large page header in white to put "Control Me" next to it
		app.ui.$title = $('font:contains("Device Information")')
			.add('font:contains("Device information")')
			.add('font:contains("Info. périphérique")')
			.add('font:contains("Info. sur le périph")')
			.add('font:contains("Information périphérique")')
			.add('font:contains("Renseignements sur le périphérique")')
			.add('font:contains("Informazioni dispositivo")'); //italian language
		
		// Found it?
		if (app.ui.$title.length !== 1) {
			// Nope
			app.log('Could not find entry point on this page; doing nothing for now.');
			return;
		}
		
		// Yep
		app.log('Found entry point on this page; injecting app launcher.');
		
		app.ui.$title.text(app.ui.$title.text() + ' ');
		
		// Create the app launcher link, attach a click event, and put it next to the page title
		$('<span/>')
			.text('(Control Me)')
			.css({
				'color': 'red',
				'font-weight': 'bold',
				'font-family': 'sans-serif',
				'cursor': 'pointer'
			})
			.click(app.launch)
			.appendTo(app.ui.$title);
		
		// Find the phone model on this page (important for model specific features)
		app.phone.model = $('b:contains("Model number")')
							.parent()
							.siblings('td:last-child')
							.find('b')
							.text()
							.match(/\d\d\d\d/)[0] * 1;
		//thinking about how to add support for multiple languages from here...
	},

	launch: function() {
		
		// If our app is already launched, just run that one, don't launch a second instance
		if (app.launched) return;
		
		app.launched = true;
		app.phone.ip = window.location.host;
		
		// Build out our various interesting URLs for this phone
		app.phone.url = {
			'screenshot': window.location.protocol + '//' + app.phone.ip + '/CGI/Screenshot',
			'execute': window.location.protocol + '//' + app.phone.ip + '/CGI/Execute'
		};
		
		// Draw the User Interface for the controller app
		app.ui.draw();
		
		// Time to run the app (E.g., Even when the app is idle, it's refreshing the screen every so often)
		app.run();
	},

	ui: {
		draw: function() {
			app.ui.$main = $('body > table > tbody > tr > td > div');
			if (app.ui.$main.length !== 1) return;
			
			app.ui.$main.css({
				'float': 'left',
				'width': '30%'
			});
			
			$('<div/>')
				.attr({
					'id': 'app-ui'
				})
				.css({
					'float': 'right',
					'width': '70%',
					'padding-top': '10px',
					'font-family': 'sans-serif'
				})
				.appendTo(app.ui.$main.parent());
				
			app.ui.screen();
			app.ui.buttons();
		},

		screen: function() {
			$('<div/>')
				.attr({
					'id': 'app-ui-screen'
				})
				.css({
					'float': 'left',
					'border': '1px solid lightgrey'
				})
				.appendTo('#app-ui');
				
			$('<img/>')
				.attr({
					'usemap': '#app-screen-map'
				})
				.css({
					'width': '533px',
					'height': '320px'
				})
				.appendTo('#app-ui-screen');
				
			app.ui.screen_map();
		},
		
		screen_map: function() {
			html = '<map name="app-screen-map">' +
					'<area shape="rect" coords="000, 285, 133, 320" href="#" id="app-Soft1" />' +
					'<area shape="rect" coords="134, 285, 267, 320" href="#" id="app-Soft2" />' +
					'<area shape="rect" coords="268, 285, 401, 320" href="#" id="app-Soft3" />' +
					'<area shape="rect" coords="402, 285, 533, 320" href="#" id="app-Soft4" />' +
					
					'<area shape="rect" coords="000, 045, 266, 090" href="#" id="app-Line1" />' +
					'<area shape="rect" coords="000, 091, 266, 136" href="#" id="app-Line2" />' +
					'<area shape="rect" coords="000, 137, 266, 182" href="#" id="app-Line3" />' +
					'<area shape="rect" coords="000, 183, 266, 228" href="#" id="app-Line4" />' +
					'<area shape="rect" coords="000, 229, 266, 274" href="#" id="app-Line5" />' +
					
					'<area shape="rect" coords="267, 045, 533, 090" href="#" id="app-Session1" />' +
					'<area shape="rect" coords="267, 091, 533, 136" href="#" id="app-Session2" />' +
					'<area shape="rect" coords="267, 137, 533, 182" href="#" id="app-Session3" />' +
					'<area shape="rect" coords="267, 183, 533, 228" href="#" id="app-Session4" />' +
					'<area shape="rect" coords="267, 229, 533, 274" href="#" id="app-Session5" />' +
					
					'</map>';
					
			$(html).appendTo('#app-ui-screen');
			
			$('#app-ui-screen').click(function(e) {
				app.fn.send_key(e.target.id.replace('app-', ''));
			});
		},
		
		buttons: function() {
			app.ui.key_pad();
			app.ui.cmd_center();
			
			app.ui.$inputs = $('div#app-ui-cmdcenter input');
			app.ui.$keypadbuttons = $('div#app-ui-keypad div');
			app.ui.$cmdcenterbuttons = $('div#app-ui-cmdcenter div');
			app.ui.$allbuttons = app.ui.$keypadbuttons.add(app.ui.$cmdcenterbuttons);
			
			app.ui.$inputs
				.css({
					'width': '294px',
					'height': '42px',
					'float': 'left',
					'margin': '0 10px 10px 0',
					'border': '1px solid lightgrey',
					'font-size': '100%',
					'font-weight': 'bold',
					'color': '#666'
				});
				
			app.ui.$keypadbuttons
				.css({
					'width': '70px',
					'height': '61px',
					'background-color': '#EFEFEF'
				})
				.hover(function(e) {
					$(this).css('background-color', e.type === 'mouseenter' ? '#66CDAA' : '#EFEFEF') 
				});
				
			app.ui.$cmdcenterbuttons
				.css({
					'width': '140px',
					'height': '30px'
				})
				.hover(function(e) {
					$(this).css('background-color', e.type === 'mouseenter' ? '#66CDAA' : 'transparent') 
				});
			
			app.ui.$allbuttons
				.css({
					'padding-top': '10px',
					'float': 'left',
					'margin': '0 10px 10px 0',
					'text-align': 'center',
					'cursor': 'pointer',
					'border': '1px solid lightgrey',
					'font-weight': 'bold',
					'color': '#666'
				})
				.click(function() {
					var id = $(this).attr('id').replace('app-', '');
					
					switch(id) {
						case 'Buzz':
							app.fn.buzz();
							break;
						case 'Unlock':
							app.log('not implemented');
							break;
						case 'Reset':
							app.log('not implemented');
							break;
						case 'MakeCall':
							app.fn.make_call($('#app-data-number').val());
							break;
						case 'Macro':
							app.fn.macro($('#app-data-macro').val());
							break;
						case 'MCast':
							app.fn.mcast($('#app-data-mcast').val());
							break;
						case 'MCastStop':
							app.fn.mcast_stop();
							break;
						case 'Display':
							app.fn.display($('#app-data-display').val());
							break;
						default:
							app.fn.send_key(id);
					}
				});
		},
		
		key_pad: function() {
			$('<div/>')
				.attr({
					'id': 'app-ui-keypad'
				})
				.css({
					'float': 'left',
					'width': '300px',
					'margin-left': '10px'
				})
				.appendTo('#app-ui');

			for (var i = 1; i < 10; i++) {
				$('<div/>')
					.attr({
						'id': 'app-KeyPad' + i
					})
					.text(i)
					.appendTo('#app-ui-keypad');
			}
			
			$('<div/>')
				.attr({
					'id': 'app-KeyPadStar'
				})
				.text('*')
				.css('font-size', '200%')
				.appendTo('#app-ui-keypad');
				
			$('<div/>')
				.attr({
					'id': 'app-KeyPad0'
				})
				.text('0')
				.appendTo('#app-ui-keypad');
				
			$('<div/>')
				.attr({
					'id': 'app-KeyPadPound'
				})
				.text('#')
				.appendTo('#app-ui-keypad');
		},
		
		cmd_center: function() {
			$('<div/>')
				.attr({
					'id': 'app-ui-cmdcenter'
				})
				.css({
					'clear': 'left',
					'width': '800px',
				})
				.appendTo('#app-ui');
			
			var actions = [
				'Messages',
				'NavUp',
				'Directories',
				'VolUp',
				'Buzz',
				
				'NavLeft',
				'NavSelect',
				'NavRight',
				'VolDwn',
				'Unlock',
				
				'NavBack',
				'NavDwn',
				'Applications',
				'Settings',
				'Reset',
				
				'Speaker',
				'Headset',
				'Mute',
				
			];
			
			$(actions).each(function(index, item) {
				
				$('<div/>')
					.attr({
						'id': 'app-' + item
					})
					.text(item)
					.appendTo('#app-ui-cmdcenter');
					
			});
			
			$('<p/>')
				.css({
					'clear': 'left',
					'font-size': '33%'
				})
				.html('&nbsp;')
				.appendTo('#app-ui-cmdcenter');
				
			$('<div/>')
					.attr({
						'id': 'app-MakeCall'
					})
					.text('Make Call')
					.appendTo('#app-ui-cmdcenter');
					
			$('<input/>')
				.attr({
					'id': 'app-data-number',
					'type': 'text',
					'placeholder': 'E.g., A Diable Pattern'
				})
				.appendTo('#app-ui-cmdcenter');
				
			$('<p/>')
				.css({
					'clear': 'left',
					'font-size': '33%'
				})
				.html('&nbsp;')
				.appendTo('#app-ui-cmdcenter');
				
			$('<div/>')
					.attr({
						'id': 'app-Macro'
					})
					.text('Run Macro')
					.appendTo('#app-ui-cmdcenter');
					
			$('<input/>')
				.attr({
					'id': 'app-data-macro',
					'type': 'text',
					'placeholder': 'E.g., Settings, Pause, KeyPad5'
				})
				.appendTo('#app-ui-cmdcenter');
				
			$('<p/>')
				.css({
					'clear': 'left',
					'font-size': '33%'
				})
				.html('&nbsp;')
				.appendTo('#app-ui-cmdcenter');
				
			$('<div/>')
					.attr({
						'id': 'app-MCast'
					})
					.text('Join Audio')
					.appendTo('#app-ui-cmdcenter');
					
			$('<input/>')
				.attr({
					'id': 'app-data-mcast',
					'type': 'text',
					'placeholder': 'E.g., 239.1.1.13:20480'
				})
				.appendTo('#app-ui-cmdcenter');
						
			$('<div/>')
					.attr({
						'id': 'app-MCastStop'
					})
					.text('Stop Audio')
					.appendTo('#app-ui-cmdcenter');
					
			$('<p/>')
				.css({
					'clear': 'left',
					'font-size': '33%'
				})
				.html('&nbsp;')
				.appendTo('#app-ui-cmdcenter');
				
			$('<div/>')
					.attr({
						'id': 'app-Display'
					})
					.text('Display Text')
					.appendTo('#app-ui-cmdcenter');
					
			$('<input/>')
				.attr({
					'id': 'app-data-display',
					'type': 'text',
					'placeholder': 'E.g., Good morning!'
				})
				.appendTo('#app-ui-cmdcenter');
			
		}
		
	},

	fn: {
		xml: {
			key: '<CiscoIPPhoneExecute><ExecuteItem URL="Key:%KEY%" /></CiscoIPPhoneExecute>',
			buzz: '<CiscoIPPhoneExecute><ExecuteItem URL="Play:CallBack.raw" /></CiscoIPPhoneExecute>',
			call: '<CiscoIPPhoneExecute><ExecuteItem URL="Dial:%NUMBER%" /></CiscoIPPhoneExecute>',
			mcast: '<CiscoIPPhoneExecute><ExecuteItem URL="RTPMRx:%ADDRESS%:100" /></CiscoIPPhoneExecute>',
			mcast_stop: '<CiscoIPPhoneExecute><ExecuteItem URL="RTPMRx:Stop" /></CiscoIPPhoneExecute>',
			display: '<CiscoIPPhoneText><Title>Informational Message</Title><Prompt></Prompt><Text>%MSG%</Text></CiscoIPPhoneText>',
		},
		
		buzz: function() {
			app.fn.post(app.fn.xml.buzz);
		},
		
		make_call: function(number) {
			number = number.replace('+', '%2B');
			app.fn.post(app.fn.xml.call.replace('%NUMBER%', number));
		},
		
		macro: function(list) {
			if (list) {
				app.macro.list = [];
				
				$(list.split(',')).each(function(i, key) {
					app.macro.list.push($.trim(key));				
				});
				
				app.macro.timer = window.setTimeout(app.fn.macro, 500);
				
				return;
			}
			
			if (!app.macro.list.length) return;
			
			var this_key = app.macro.list.slice(0, 1);
			
			app.log('running macro key ' + this_key);
			
			if (this_key !== 'Pause')
				app.fn.send_key(this_key);
			
			app.macro.list = app.macro.list.slice(1);
			
			app.macro.timer = window.setTimeout(app.fn.macro, 500);
			
		},
		
		mcast: function(address) {
			app.fn.post(app.fn.xml.mcast.replace('%ADDRESS%', address));
		},
		
		mcast_stop: function() {
			app.fn.post(app.fn.xml.mcast_stop);
		},
		
		display: function(msg) {
			app.fn.post(app.fn.xml.display.replace('%MSG%', msg));
		},
		
		send_key: function(key) {
			app.fn.post(app.fn.xml.key.replace('%KEY%', key));
		},
		
		post: function(xml) {
			try {
			  var request = new XMLHttpRequest();
			  request.open('POST', app.phone.url.execute, true);
			  request.send('XML=' + xml);
			} catch(err) {
			  app.log(err.message);
			  return;
			}
			// Force a refresh sooner than normal
			if (app.phone.timer)
				window.clearTimeout(app.phone.timer);
			app.phone.timer = window.setTimeout(app.run, 750);
		}  
	},

	run: function() {
		var id = new Date().getTime().toString();
		app.log('Controller app tick ' + id);

		$('#app-ui-screen > img')
			.attr({
				src: app.phone.url.screenshot + '?id=' + id
			});
			
		if (app.phone.timer)
			window.clearTimeout(app.phone.timer);

		app.phone.timer = window.setTimeout(app.run, 6006);
	}

};

app.log('Initializing Cisco Phone Controller Application');
app.init();

})();
