using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents
{
    public class OfferDealAreaViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("~/Views/Shared/Components/HomeViewComponents/OfferDealArea/Default.cshtml");
        }
    }
}
