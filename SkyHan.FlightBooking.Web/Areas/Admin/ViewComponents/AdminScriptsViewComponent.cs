using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.ViewComponents;

public class AdminScriptsViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Areas/Admin/Views/Shared/Components/AdminScripts/Default.cshtml");
    }
}
