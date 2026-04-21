namespace SkyHan.FlightBooking.Business.Dtos.Passenger;

public class CreatePassengerDto
{
    public string PassengerId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PassengerType { get; set; } = string.Empty;
    public string Pnr { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
    public string CheckInStatus { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string TicketStatus { get; set; } = string.Empty;
    public bool IsCheckedIn { get; set; }
    public DateTime? CheckInDate { get; set; }
    public int BaggageKg { get; set; }
    public string? MealType { get; set; }
    public List<string>? ExtraServices { get; set; }
    public string? BoardingPassNumber { get; set; }
    public string? Gate { get; set; }
    public DateTime? BoardingTime { get; set; }
}
