using Microsoft.AspNetCore.Mvc;
using SkyHan.FlightBooking.Business.Dtos.Flight;
using SkyHan.FlightBooking.Business.Services.Abstract;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class FlightController : Controller
{
    readonly IFlightService _flightService;

    public FlightController(IFlightService flightService)
    {
        _flightService = flightService;
    }

    public async Task<IActionResult> FlightList()
    {
        var values = await _flightService.GetAllAsync();
        return View(values);
    }

    [HttpGet]
    public IActionResult CreateFlight()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> CreateFlight(CreateFlightDto createFlightDto)
    {
        await _flightService.CreateAsync(createFlightDto);
        return RedirectToAction(nameof(FlightList));
    }

}
