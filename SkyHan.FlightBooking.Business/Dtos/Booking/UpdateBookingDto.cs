using SkyHan.FlightBooking.Business.Dtos.Passenger;

namespace SkyHan.FlightBooking.Business.Dtos.Booking;

public class UpdateBookingDto
{
    public string BookingId { get; set; } = string.Empty;
    public string FlightId { get; set; } = string.Empty;
    public List<UpdatePassengerDto> Passengers { get; set; } = [];
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
}
