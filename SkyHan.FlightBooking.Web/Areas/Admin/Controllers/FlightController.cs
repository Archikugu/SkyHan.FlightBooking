using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class FlightController : Controller
{
    public IActionResult FlightList()
    {
        return View();
    }
}
