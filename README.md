# File Saver
Hosted on: https://rachitsharma2001.github.io/Save-My-Files/
This website provides users with an easy method to save their files to the cloud. Users upload files and place them in organized 
directories and sub-directories using similar commands to a regular Linux terminal. Since everything is stored on the cloud, they can download those files anywhere on any device, regardless of which device the file originated from. 

# Frameworks used
React JS in the front end + Python Django in the backend + PostgreSql for the database.

# How to use the site
Once you have created an account and signed in, you will be greeted with a terminal: <img src="images/Terminal.png" style="display: block; margin: auto;" /> If you type <b> ls </b>, you will see that you already have one directory made for you, called home. You are not allowed to add any other files or directories outside the home directory. <img src="images/First_ls.png" style="display: block; margin: auto;" />

You can start using the <b> makedir </b> command to make directories for organizing your files. For example: <img src="images/mkdir.png" style="display: block; margin: auto;" /> <br/> Inside directories, you can use the <b>upload</b> command to upload local files: <img src="images/upload.png" style="display: block; margin: auto;" /> And then, any time you need that file again, or if you are on a different device and want to download that file to that device, just download it using the <b>download</b> command: <img src="images/download.png" style="display: block; margin: auto;"/>

# The database
One of my big motivations for doing this project was to learn about relational databases and how to program them. For this project, I created a PostgreSql database which is stored on <b> Elephant Sql </b>. I used PostgreSql commands to create the different tables, as well as search for particular entries at the users request. 

# The backend
Another big motivation for doing this project was the gain expierence with Python Django and especially Django's REST framework. The backend was designed using RESTful api's.

# The front end
The front end was created using React JS. React makes UI and general front end design very easy, and helped give the website a good professional look.

# Contact
If you have any questions about how to use the website or how I made it, please contact me at: rachitsharma613@gmail.com
