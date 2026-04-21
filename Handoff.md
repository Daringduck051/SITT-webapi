## Architecture overview:
Tools Used:
- .NET 10 (Managing website files)
- SQLite (Used for persistence)
- HTML/CSS/JavaScript (Created the website)
- C# (Managed all the API's and controllers)
- Postmark (Sending emails)
- Visual Studio Code (Code Editor)

## Known Limitations:
While the counts and custom themes are saved when page is reloaded, if you were to send the email (making the buttons disabled) and then reload the page, the buttons are no longer disabled which could potentially result in a problem. Other than that, the only other way to get the buttons to no longer be disabled is to create a new shift. Also, at this point in the project, I had created a lot of different functions for each of the buttons and after adding more functions, it broke some of the functionalities which made it hard to figure out how to fix the things that broke.

## Lessons learned:
One lesson I learned from doing this project was that when you have a lot of different classes and Id's, it can get crowded and then it gets harder to figure out where something is, where something went wrong, or how something works. Also, I didn't realize how many different functions/ways to get something done in JavaScript there are and how big it can make the JavaScript file. I kept uploading different version of the JavaScript file to Azure DevOps and just noticed the file size getting bigger and bigger until I uploaded it to Github and it told me that the JavaScript file made up over 50% of my code.

## Decision Making:
One decision I had to make was whether or not to use SQL for the database as I had never used it before. The decision was kind of made for me as I couldn't figure out how to get SQL up and running, so I switched over to SQLite which runs in the project build. Another decision that I had to make was what service I was going to use for the email functionality of the website. I needed something free that would allow a user to send a certain number of emails a month, and while testing allowed me to test a good number of times. I ended up using Postmark because it checked all the requirements I needed for this project. I used a controller for the email portion, as I needed to set up Postmark and it was easiest to do in a seperate file instead of the Program.cs file. I also used a different number of files to set up the database so that everything was clean and readable.

## Changes if I were to do this again:
If I were to do this project again with the knowledge I have now, I would start by simplifying the different classes/Id's that I placed on each of the elements in the HTML code. This would allow for a cleaner look and a cleaner CSS file. I would then try to simplify the JavaScript file by sectioning the different parts of the code better, such as making sure all the constant variables are at the top, functions next, then start placing uses for each of the variables and elements from my HTML. Right now, things are jumbled around and it can get hard to figure out where something is when something goes wrong.