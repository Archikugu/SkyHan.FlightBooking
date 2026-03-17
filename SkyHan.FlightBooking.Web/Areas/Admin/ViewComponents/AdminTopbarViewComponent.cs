using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.ViewComponents;

public class AdminTopbarViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Areas/Admin/Views/Shared/Components/AdminTopbar/Default.cshtml");
    }
}
