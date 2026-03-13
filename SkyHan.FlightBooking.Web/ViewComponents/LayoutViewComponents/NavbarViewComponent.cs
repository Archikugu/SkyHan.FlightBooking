using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.LayoutViewComponents;

public class NavbarViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View("~/Views/Shared/Components/LayoutViewComponents/Navbar/Default.cshtml");
    }
}
