using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents;

public class SliderViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/HomeViewComponents/Slider/Default.cshtml");
    }
}
