using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MessagingClient.Pages
{
    public class UserMessagesModel : PageModel
    {
        private readonly ILogger<UserMessagesModel> _logger;

        public UserMessagesModel(ILogger<UserMessagesModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}