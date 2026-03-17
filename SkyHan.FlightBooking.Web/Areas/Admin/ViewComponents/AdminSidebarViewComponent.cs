using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.ViewComponents;

public class AdminSidebarViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Areas/Admin/Views/Shared/Components/AdminSidebar/Default.cshtml");
    }
}
