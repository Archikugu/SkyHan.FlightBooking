using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.LayoutViewComponents;

public class ScriptsViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/LayoutViewComponents/Scripts/Default.cshtml");
    }
}
