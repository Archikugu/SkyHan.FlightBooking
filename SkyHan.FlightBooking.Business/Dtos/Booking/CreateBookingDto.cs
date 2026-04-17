using SkyHan.FlightBooking.Business.Dtos.Passenger;

namespace SkyHan.FlightBooking.Business.Dtos.Booking;

public class CreateBookingDto
{
    public string FlightId { get; set; } = string.Empty;
    public string PnrNumber { get; set; } = string.Empty;
    public List<CreatePassengerDto> Passengers { get; set; } = [];
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
}
