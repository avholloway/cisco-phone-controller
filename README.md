# Cisco Phone Controller
FireFox add-on which embeds a Remote Phone Control App on the Phone's Web Page

# Now in the FireFox Add-on Store
https://addons.mozilla.org/en-US/firefox/addon/cisco-phone-controller/

# Setup in CUCM
1. Create a new or use an existing End User or Application User
2. Associate the phone(s) to this user (no special groups to assign)
3. Enable the phone's web server on the phone page if not already enabled

# Use the Add-on
1. Navigate to the phone's web page in your FireFox browser
2. If it's a supported phone model, you will see "Control Me" in red at the top of the screen
3. Click "Control Me" and then enter the username and password of your user with control of this phone

Tip: You can even click on the phone screen to access line, softkeys, and session buttons!

# Screenshot
![Screenshot](https://i.imgur.com/TdkqKbx.png)

# Troubleshooting
1. This Add-on uses the Phone APIs for /CGI/Screenshot and /CGI/Execute.  While it's hard to test the /CGI/Execute, it does generally work or not work in tandem with /CGI/Screenshot.  Therefore, as a test, can you access the phone screenshot outside of this add-on by simply nagivating to: http://{phone ip}/CGI/Screenshot?  If not, it's not an Add-on problem then, you need to doublecheck the phone is reachable via IP, and that your user is properly controlling it, reboot the phone, all the normal stuff, etc.  Until you can get the screenshot to work in a vanilla browser (no add-ons required), the Add-on will not work either.
2. If you are controlling a phone which is MRA registered, and your Authentication URL is not HTTPS, make sure your Expressway-C has an HTTP Allow for the http://{cucm ip}:8080/ccmcip/authenticate.jsp URL.  HTTPS Auth works natively.
