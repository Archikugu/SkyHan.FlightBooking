using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents
{
    public class DestinationOfferAreaViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("~/Views/Shared/Components/HomeViewComponents/DestinationOfferArea/Default.cshtml");
        }
    }
}
