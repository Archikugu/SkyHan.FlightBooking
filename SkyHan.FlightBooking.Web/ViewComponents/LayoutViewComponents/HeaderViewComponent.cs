using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.LayoutViewComponents;

public class HeaderViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/LayoutViewComponents/Header/Default.cshtml");
    }
}
