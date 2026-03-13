using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents;

public class BookingTagsViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/HomeViewComponents/BookingTags/Default.cshtml");
    }
}
