namespace SkyHan.FlightBooking.Business.Dtos.Booking;

public class BookingListDto
{
    public string BookingId { get; set; } = string.Empty;
    public string FlightId { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public DateTime BookingDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int PassengerCount { get; set; }
}
