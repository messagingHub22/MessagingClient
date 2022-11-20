# MessagingClient

MessagingClient is a ASP.NET Core Web App that is used for the messaging hub website.  
It can view/send user or server messages.  


### Main files/directories description  

**MessagingClient/Controllers/LibraryController.cs** - It is a class that maps the requests at libApi route to the MessagingLibrary.  
**MessagingClient/Pages/Shared/** - It is a folder which contains shared layouts used in all webpages.  
**MessagingClient/Pages/Index.cshtml** - It is the homepage which has login form and then the popup can show server to user messages.  
**MessagingClient/Pages/UserMessages.cshtml** - It is the user messages webpage where users can send messages to other users.  
**MessagingClient/Pages/Server.cshtml** - It is the server webpage which can send messages to users or groups. It can also create groups or add members to it.        
**MessagingClient/wwwroot/css/** - It is a folder which contains the css files used in the webpages.  
**MessagingClient/wwwroot/images/** - It is a folder which contains the image files used in the webpages.  
**MessagingClient/wwwroot/js/** - It is a folder which contains the javascript files used in the webpages.  


### Environment variable  

This environment variable need to be set for the application to function.

**SERVER_API_URL** - Its value should be the URL where the server is hosted. Used by MessagingLibrary to connect to the server.


### Dependency

MessagingClient depends on MessagingLibrary. Clone both projects in their folders which should be placed in the same directory.  


