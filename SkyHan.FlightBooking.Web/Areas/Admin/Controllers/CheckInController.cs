using Microsoft.AspNetCore.Mvc;
using SkyHan.FlightBooking.Business.Services.Abstract;
using SkyHan.FlightBooking.Business.Dtos.Passenger;
using System;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<IActionResult> Index(string? flightId, string? pnr, string? passengerId)
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
                
                PassengerDto? passenger = null;
                if (!string.IsNullOrWhiteSpace(passengerId))
                {
                    passenger = passengers.FirstOrDefault(x => string.Equals(x.PassengerId, passengerId, StringComparison.OrdinalIgnoreCase));
                }

                if (passenger is null && !string.IsNullOrWhiteSpace(pnr))
                {
                    passenger = passengers.FirstOrDefault(x => string.Equals(x.Pnr, pnr, StringComparison.OrdinalIgnoreCase));
                }

                if (passenger is null)
                {
                    passenger = passengers.FirstOrDefault();
                }

                if (passenger is not null)
                {
                    ViewBag.PassengerName = $"{passenger.Name} {passenger.Surname}".Trim();
                    ViewBag.Pnr = passenger.Pnr;
                    ViewBag.Gate = passenger.Gate;
                    ViewBag.PassengerId = passenger.PassengerId;
                    ViewBag.IsCheckedIn = passenger.IsCheckedIn;
                    ViewBag.SeatNumber = passenger.SeatNumber;
                }
                else if (!string.IsNullOrWhiteSpace(pnr))
                {
                    ViewBag.Pnr = pnr;
                }
            }

            ViewBag.FlightId = flightId;
            ViewBag.PassengerName ??= "—";
            ViewBag.Pnr ??= string.IsNullOrWhiteSpace(pnr) ? "—" : pnr;
            ViewBag.Gate ??= "—";
            ViewBag.BasePrice ??= 0;
            ViewBag.Currency ??= "TRY";
            ViewBag.PassengerId ??= "";
            ViewBag.IsCheckedIn ??= false;
            ViewBag.SeatNumber ??= "";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveCheckIn([FromBody] SaveCheckInDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.FlightId) || string.IsNullOrWhiteSpace(model.PassengerId))
            {
                return Json(new { success = false, message = "Eksik veya geçersiz check-in bilgileri." });
            }

            var success = await _bookingService.SavePassengerCheckInAsync(
                model.FlightId,
                model.PassengerId,
                model.SeatNumber,
                model.MealType,
                model.BaggageKg,
                model.ExtraServices);

            if (success)
            {
                return Json(new { success = true, message = "Check-In başarıyla kaydedildi!" });
            }

            return Json(new { success = false, message = "Check-in işlemi kaydedilirken bir hata oluştu." });
        }

        public class SaveCheckInDto
        {
            public string FlightId { get; set; } = string.Empty;
            public string PassengerId { get; set; } = string.Empty;
            public string SeatNumber { get; set; } = string.Empty;
            public string? MealType { get; set; }
            public int BaggageKg { get; set; }
            public List<string>? ExtraServices { get; set; }
        }
    }
}
