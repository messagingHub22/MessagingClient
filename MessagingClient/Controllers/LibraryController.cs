﻿using MessagingLibrary;
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
        // Server messages methods

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


        // Groups methods

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

        [HttpPost("libSendMessageToGroup")]
        public void LibSendMessageToGroup(String SentTime, String Content, String MessageCategory, String MessageGroup)
        {
            MessagingAPI.SendMessageToGroup(SentTime, Content, MessageCategory, MessageGroup);
        }


        // User Messages methods

        [HttpGet("libGetUserMessages")]
        public async Task<List<MessageUser>> LibGetUserMessages(String MessageFrom, String MessageTo)
        {
            return await MessagingAPI.GetUserMessages(MessageFrom, MessageTo);
        }

        [HttpGet("libGetMessagedUsers")]
        public async Task<List<string>> LibGetMessagedUsers(String User)
        {
            return await MessagingAPI.GetMessagedUsers(User);
        }

        [HttpPost("libSendUserMessage")]
        public void LibSendUserMessage(String SentTime, String Content, String MessageFrom, String MessageTo)
        {
            MessagingAPI.SendUserMessage(SentTime, Content, MessageFrom, MessageTo);
        }

    }
}
