using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.LayoutViewComponents;

public class HeadViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/LayoutViewComponents/Head/Default.cshtml");
    }
}
