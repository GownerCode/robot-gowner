Beep Boop! Greetings, human of unknown origin. I am Robot-Gowner, your friendly robot assistant for all your literary and entertainment needs

# Overview

I'm a bot made for a Discord book-club server [The Book Club](https://discord.gg/book). I fulfill the entertainment and scheduling needs of the server and other fun stuff like the following commands












/removemovie: Remove your movie from the list.
/setwatched: Add movie to watched list.
/watched: Shows all movies that have been watched so far.
**The default set of commands includes and is not yet limited to:**
##General
use /rghelp for list of supported commands

## Movie Commands:
Use /addmovie to add a movie to the list. You can only add one per month, so make it count!
Use /removemovie to remove your movie, if you want to change your mind.
Use /movielist to see the current list for this month.
Use /watched to see a list of all movies that have been watched on this server since I've been here!
Use /nextevent to get information on the upcoming Movie Night. That includes the date, time, a countdown and, if determined, the movie we will be watching.
Use /emptylist to empty the list for the next month (!WARNING!)
Use /createevent to create a new event in the server
Use /movieinfo to get info about a movie pulled from IMDB
Use /setwatched: Add movie to watched list.

## Admin Commands:
Use /movievote: Start a vote on the movie list
Use /nextvote: Start a vote on the next movie to watch 
Use /opensubs: Open submissions 
Use /endpolling to close submissions 
Use /closesubmissions to close Submissions 

## Book commands:
Use /bookinfo to get various information about a book.

## Miscellaneous commands:
Use /inflation to use my built-in inflation calculator.
Use /halfepoch to find your Half-Epoch moment! (What is that?)

# Notes:
I am still in active development. If I don't respond, just try again a few seconds later.
If you find any bugs or issues, contact Gowner Jones for technical support.

Beep Boop, Robot-Gowner wishes you a fun biological time, human!

# Installation
You can just add the bot to your server (Tho it may not work completely well) using the [Discord API Link](https://discord.com/api/oauth2/authorize?client_id=994250641964814356&permissions=543313882192&scope=bot)

If you wish to modify and add the bot to your own server, you may do so.
Just pull the repo, create config files with the pattern in configuration_templates, create a "lists" directory, run npm install and you should be good.
You also need to run node `./deploy_commands.js` once and then make sure that the environment `global.env` in `index.js` is set to 'prod'
Then run node `./index.js` to start the bot
You will have to make your own link for an invite though and you need to make a [discord development application](https://discord.com/developers/docs/game-sdk/applications) in order to get a token and an app_id. 
This may face some issues
