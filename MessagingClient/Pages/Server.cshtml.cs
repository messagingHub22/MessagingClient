using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MessagingClient.Pages
{
    public class ServerModel : PageModel
    {
        private readonly ILogger<ServerModel> _logger;

        public ServerModel(ILogger<ServerModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}