using MessagingLibrary;
using MessagingLibrary.Data;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace MessagingClient.Controllers
{
    // Controller to send data to the messaging library
    [Route("libApi")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        [HttpPost("libSendMessage")]
        public void LibSendMessage(String SentTime, String Content, String MessageCategory, String MessageUser)
        {
            MessagingAPI.SendMessage(SentTime, Content, MessageCategory, MessageUser);
        }

        [HttpPost("libMarkMessageRead")]
        public void LibMarkMessageRead(String Id)
        {
            MessagingAPI.MarkMessageRead(Id);
        }

        [HttpGet("libGetMessages")]
        public async Task<List<MessageData>> LibGetMessages()
        {
            return await MessagingAPI.GetMessages();
        }

        [HttpGet("libGetMessagesForUser")]
        public async Task<List<MessageData>> LibGetMessagesForUser(String User)
        {
            return await MessagingAPI.GetMessagesForUser(User);
        }

        [HttpPost("libLoginUser")]
        public void LibLoginUser(String User)
        {
            HubLink.LoginUser(User);
        }

        [HttpGet("libReloadTime")]
        public List<string> LibReloadTime(String User)
        {
            return new List<string> { HubLink.ChangedTime(User) };
        }


        [HttpGet("libGetGroups")]
        public async Task<List<string>> LibGetGroups()
        {
            return await MessagingAPI.GetGroups();
        }

        [HttpPost("libAddMemberToGroup")]
        public void LibAddMemberToGroup(String GroupName, String MemberName)
        {
            MessagingAPI.AddMemberToGroup(GroupName, MemberName);
        }

        [HttpGet("libGetGroupMembers")]
        public async Task<List<string>> LibGetGroupMembers(string Group)
        {
            return await MessagingAPI.GetGroupMembers(Group);
        }
    }
}
