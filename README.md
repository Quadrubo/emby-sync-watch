# Emby Sync Watch
A Chrome Extension / NodeJS Server for sync video watching on Emby.
This is my first Chrome Extension so please be gentle on me. The code is far from good but it works :)

# Setup Client (Extension)
1) Download the latest [Release](https://github.com/Quadrubo/emby-sync-watch/releases) of the Chrome Extension ("emby.sync.watch.EXTENSION. ... .zip") from the releases tab.
2) Extract the Zip file to a Folder of your choice.
3) Open Chrome and head to: "chrome://extensions/".
4) Tick the "Developer Mode" box on the top right corner of the screen.
5) Click on "load unpacked extension" and select the folder you created in step 2.
6) The Extension now shows up in the top right corner of the screen :)

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

# Usage

1) Open a the Emby Webpage and start the Video you want to watch.
2) Connect to the Server, if everything is setup right you should see a popup saying you're connected.
3) Everyone else who joins in from now on has control over your video and vice versa :)

# Help
### What should I enter on the Options page?
* Default Server
     * The IP-Adress of the Server you want to connect you.
        * If you setup the Server on your PC it's "localhost".
        * If you setup the Server on a different PC it's the IP of that PC (use "ipconfig" to get it)
* Default Port
    * The Port of the Server you want to connect to. If you didn't change my Code it's "8082".

### That didn't help me.
* Message me on Discord @ "Quadrubo#2536". I'm sure I can help you :)