using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents;

public class BookingAreaViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/HomeViewComponents/BookingArea/Default.cshtml");
    }
}
