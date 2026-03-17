using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.Areas.Admin.ViewComponents;

public class AdminFooterViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Areas/Admin/Views/Shared/Components/AdminFooter/Default.cshtml");
    }
}
