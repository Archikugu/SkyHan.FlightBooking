using Microsoft.AspNetCore.Mvc;
using SkyHan.FlightBooking.Business.Services.Abstract;
using System;
using System.Linq;

namespace SkyHan.FlightBooking.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CheckInController : Controller
    {
        private readonly IFlightService _flightService;
        private readonly IBookingService _bookingService;

        public CheckInController(
            IFlightService flightService,
            IBookingService bookingService)
        {
            _flightService = flightService;
            _bookingService = bookingService;
        }

        public async Task<IActionResult> Index(string? flightId, string? pnr)
        {
            if (!string.IsNullOrWhiteSpace(flightId))
            {
                var flight = await _flightService.GetByIdAsync(flightId);
                if (flight is not null)
                {
                    ViewBag.FlightNumber = flight.FlightNumber;
                    ViewBag.AirlineCode = flight.AirlineCode;
                    ViewBag.DepartureAirportCode = flight.DepartureAirportCode;
                    ViewBag.DepartureAirportName = flight.DepartureAirportName;
                    ViewBag.ArrivalAirportCode = flight.ArrivalAirportCode;
                    ViewBag.ArrivalAirportName = flight.ArrivalAirportName;
                    ViewBag.DepartureTime = flight.DepartureTime;
                    ViewBag.ArrivalTime = flight.ArrivalTime;
                    ViewBag.DurationMinutes = flight.DurationMinutes;
                    ViewBag.BasePrice = flight.BasePrice;
                    ViewBag.Currency = string.IsNullOrWhiteSpace(flight.Currency) ? "TRY" : flight.Currency;
                }
            }

            if (!string.IsNullOrWhiteSpace(flightId))
            {
                var passengers = await _bookingService.GetPassengersByFlightIdAsync(flightId);
                var passenger = string.IsNullOrWhiteSpace(pnr)
                    ? passengers.FirstOrDefault()
                    : passengers.FirstOrDefault(x => string.Equals(x.Pnr, pnr, StringComparison.OrdinalIgnoreCase));

                if (passenger is not null)
                {
                    ViewBag.PassengerName = $"{passenger.Name} {passenger.Surname}".Trim();
                    ViewBag.Pnr = passenger.Pnr;
                    ViewBag.Gate = passenger.Gate;
                }
                else if (!string.IsNullOrWhiteSpace(pnr))
                {
                    ViewBag.Pnr = pnr;
                }
            }

            ViewBag.PassengerName ??= "—";
            ViewBag.Pnr ??= string.IsNullOrWhiteSpace(pnr) ? "—" : pnr;
            ViewBag.Gate ??= "—";
            ViewBag.BasePrice ??= 0;
            ViewBag.Currency ??= "TRY";

            return View();
        }
    }
}
