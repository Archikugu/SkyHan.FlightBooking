using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CheckInController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
