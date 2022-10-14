using MessagingLibrary;
using MessagingLibrary.Data;
using Microsoft.AspNetCore.Mvc;

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
        public List<string> LibReloadTime()
        {
            return new List<string> { HubLink.ChangedTime() };
        }
    }
}
