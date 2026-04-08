using Microsoft.AspNetCore.Mvc;
using SkyHan.FlightBooking.Business.Dtos.Booking;
using SkyHan.FlightBooking.Business.Services.Abstract;
using System.Threading.Tasks;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class BookingController : Controller
{
    readonly IFlightService _flightService;
    readonly IBookingService _bookingService;

    public BookingController(IFlightService flightService, IBookingService bookingService)
    {
        _flightService = flightService;
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<IActionResult> CreateBooking(string? id, string? flightId)
    {
        var selectedFlightId = string.IsNullOrWhiteSpace(id) ? flightId : id;
        if (string.IsNullOrWhiteSpace(selectedFlightId))
        {
            TempData["ErrorMessage"] = "Ucus secimi bulunamadi.";
            return RedirectToAction("FlightList", "Flight", new { area = "Admin" });
        }

        var value = await _flightService.GetByIdAsync(selectedFlightId);
        if (value is null)
        {
            TempData["ErrorMessage"] = "Secilen ucus bulunamadi.";
            return RedirectToAction("FlightList", "Flight", new { area = "Admin" });
        }

        ViewBag.FlightId = selectedFlightId;
        ViewBag.FlightNumber = value.FlightNumber;
        ViewBag.DepartureAirportCode = value.DepartureAirportCode;
        ViewBag.DepartureAirportName = value.DepartureAirportName;
        ViewBag.ArrivalAirportCode = value.ArrivalAirportCode;
        ViewBag.ArrivalAirportName = value.ArrivalAirportName;
        ViewBag.DepartureTime = value.DepartureTime;
        ViewBag.ArrivalTime = value.ArrivalTime;
        ViewBag.AirlineCode = value.AirlineCode;
        ViewBag.BasePrice = value.BasePrice;
        ViewBag.Currency = value.Currency;
        ViewBag.Status = value.Status;
        return View(value);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateBooking(CreateBookingDto createBookingDto)
    {
        if (string.IsNullOrWhiteSpace(createBookingDto.FlightId))
        {
            TempData["ErrorMessage"] = "Ucus bilgisi eksik.";
            return RedirectToAction("FlightList", "Flight", new { area = "Admin" });
        }

        try
        {
            await _bookingService.CreateAsync(createBookingDto);  
            TempData["SuccessMessage"] = "Rezervasyon basariyla olusturuldu.";
            return RedirectToAction(nameof(BookingList));
        }
        catch (System.Exception ex)
        {
            TempData["ErrorMessage"] = ex.Message;
            return RedirectToAction(nameof(CreateBooking), new { id = createBookingDto.FlightId });
        }
    }
    [HttpGet]
    public async Task<IActionResult> BookingList()
    {
        try
        {
            var bookings = await _bookingService.GetAllAsync();
            return View(bookings);
        }
        catch (System.Exception)
        {
            TempData["ErrorMessage"] = "Rezervasyon listesi getirilirken bir hata olustu.";
            return View(new List<BookingListDto>());
        }
    }
}
