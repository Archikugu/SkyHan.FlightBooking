namespace SkyHan.FlightBooking.Business.Dtos.Flight;

public class FlightListDto
{
    public string FlightId { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty;
    public string AirlineCode { get; set; } = string.Empty;
    public string DepartureAirportCode { get; set; } = string.Empty;
    public string ArrivalAirportCode { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public decimal BasePrice { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
