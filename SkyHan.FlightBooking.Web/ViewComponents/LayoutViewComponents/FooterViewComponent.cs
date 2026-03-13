using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.LayoutViewComponents;

public class FooterViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/LayoutViewComponents/Footer/Default.cshtml");
    }
}
