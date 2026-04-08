using Microsoft.AspNetCore.Mvc;
using SkyHan.FlightBooking.Business.Dtos.Flight;
using SkyHan.FlightBooking.Business.Services.Abstract;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class FlightController : Controller
{
    readonly IFlightService _flightService;
    readonly IBookingService _bookingService;

    public FlightController(IFlightService flightService, IBookingService bookingService)
    {
        _flightService = flightService;
        _bookingService = bookingService;
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

    public async Task<IActionResult> FlightDetail(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            TempData["ErrorMessage"] = "Ucus bulunamadi.";
            return RedirectToAction(nameof(FlightList));
        }

        var flight = await _flightService.GetByIdAsync(id);
        if (flight is null)
        {
            TempData["ErrorMessage"] = "Ucus bulunamadi.";
            return RedirectToAction(nameof(FlightList));
        }

        ViewBag.FlightNumber = flight.FlightNumber;
        ViewBag.AirlineCode = flight.AirlineCode;
        ViewBag.DepartureAirportCode = flight.DepartureAirportCode;
        ViewBag.ArrivalAirportCode = flight.ArrivalAirportCode;
        ViewBag.DepartureTime = flight.DepartureTime;
        ViewBag.ArrivalTime = flight.ArrivalTime;
        ViewBag.TotalSeats = flight.TotalSeats;
        ViewBag.Status = flight.Status;

        var passengers = await _bookingService.GetPassengersByFlightIdAsync(id);
        return View(passengers);
    }

}
