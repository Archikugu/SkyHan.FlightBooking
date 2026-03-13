using Microsoft.AspNetCore.Mvc;

namespace SkyHan.FlightBooking.Web.ViewComponents.HomeViewComponents
{
    public class FrequantlyAskedQuestionViewComponent : ViewComponent
    {
       public IViewComponentResult Invoke()
        {
            return View("~/Views/Shared/Components/HomeViewComponents/FrequantlyAskedQuestion/Default.cshtml");
        }
    }
}
