# Cisco Phone Controller
FireFox add-on which embeds a Remote Phone Control App on the Phone's Web Page

# Coming Soon!
I have submitted this add-on to addons.mozilla.org (AMO) and am awating approval.  Once approved, I will update this readme to change how you obtain and install the add-on.

# Installation in FireFox
1. Download the .xpi file from this repo to your computer
2. Open Add-ons from Options Menu (or Ctrl+Shift+A or goto about:addons)
3. Click the gear icon and select "Install Add-on From File..."
4. Browse to the .xpi file and select it
5. Confrim you want to add this Add-on to FireFox

# Setup in CUCM
1. Create a new or use an existing End User or Application User
2. Associate the phone(s) to this user (no special groups to assign)
3. Enable the phone's web server on the phone page if not already enabled

# Use the Add-on
1. Navigate to the phone's web page in your FireFox browser
2. If it's a supported phone model, you will see "Control Me" in red at the top of the screen
3. Click "Control Me" and then enter the username and password of your user with control of this phone

Tip: You can even click on the phone screen to access line, softkeys, and session buttons!

Tip: The XPI file is just a zip file, you can inspect the source code pretty easily if you so choose

# Screenshot
![Screenshot](https://i.imgur.com/TdkqKbx.png)

# Troubleshooting
1. This Add-on uses the Phone APIs for /CGI/Screenshot and /CGI/Execute.  While it's hard to test the /CGI/Execute, it does generally work or not work in tandem with /CGI/Screenshot.  Therefore, as a test, can you access the phone screenshot outside of this add-on by simply nagivating to: http://{phone ip}/CGI/Screenshot?  If not, it's not an Add-on problem then, you need to doublecheck the phone is reachable via IP, and that your user is properly controlling it, reboot the phone, all the normal stuff, etc.  Until you can get the screenshot to work in a vanilla browser (no add-ons required), the Add-on will not work either.
2. If you are controlling a phone which is MRA registered, make sure your Expressway-C has an HTTP Allow for the http://{cucm ip}:8080/ccmcip/authenticate.jsp URL
