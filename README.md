# Emby Sync Watch
A Chrome Extension / NodeJS Server for sync video watching on Emby.
This is my first Chrome Extension so please be gentle on me. The code is far from good but it works :)

# Need Logo Designer
* If you want to help me design a Logo for the Extension please contact me on Discord @ Quadrubo#2536 or just answer anywhere I posted about this Extension.
* Any help would be appreciated :)

# Setup Client (Extension)
1) Emby Sync Watch got accepted into the Chrome Webstore! (It's not up to Date right now, continue with step 2). Go to [Emby Sync Watch](https://chrome.google.com/webstore/detail/emby-sync-watch/cabhbnblooihogkhajehgmohhipnbach) to download it. Skip to step 8), if you wanna download it manually continue with step 2).
2) Download the latest [Release](https://github.com/Quadrubo/emby-sync-watch/releases) of the Chrome Extension ("emby.sync.watch.EXTENSION. ... .zip") from the releases tab.
3) Extract the Zip file to a Folder of your choice.
4) Open Chrome and head to: "chrome://extensions/".
5) Tick the "Developer Mode" box on the top right corner of the screen.
6) Click on "load unpacked extension" and select the folder you created in step 2.
7) The Extension now shows up in the top right corner of the screen :)
8) Go to [Usage](https://github.com/Quadrubo/emby-sync-watch#usage-extension) if you want to learn more about how to connect to servers.

# Setup Server
1) Download the latest [Release](https://github.com/Quadrubo/emby-sync-watch/releases) of the Server ("emby.sync.watch.SERVER. ... .zip") from the releases tab.
2) Extract the Zip file to a Folder of your choice.
3) Go to https://nodejs.org/en/download/ and install nodejs on your computer.
4) Go to the Folder you extracted in step 2. Now you can either:
    1) Click on "run-server.bat" to start the Server
    2) Start the Server by opening a command prompt and typing "node .\index.js".  
6) If everything went correct the Server should now say "Server started" and the Port it's listening on.
7) If you want to edit the port just open the port.json file the server created and change the port. Restart the server afterwards.
7) If you want to use the Server over the Internet please forward TCP Port 8082 (or the port you set yourself) on your router.

# Usage (Extension)

1) On Installation the Extension should open a Webpage where you can create Profiles. 
1) Open the Emby Webpage and start the Video you want to watch.
3) Click on the Chrome Extension on the top right Corner of your screen, if it's not there click on the puzzle piece and then on the Extension.
4) Select a Profile you want to connect to, if you didn't create a profile yet go back to step 1). If you want to connect manually don't select a profile and just enter the Server / Port manually.
2) Connect to the Server, if everything is setup right you should see a popup saying you're connected.
3) Everyone else who joins in from now on has control over your video and vice versa :)

# Help
### What should I enter on the Options page?
* Name
    * The Name you want to give the Profile
* Server
     * The IP-Adress of the Server you want to connect you.
        * If you setup the Server on your PC it's "localhost".
        * If you setup the Server on a different PC it's the IP of that PC
* Port
    * The Port of the Server you want to connect to. If you didn't change my Code it's "8082".

### That didn't help me.
* Message me on Discord @ "Quadrubo#2536". I'm sure I can help you :)