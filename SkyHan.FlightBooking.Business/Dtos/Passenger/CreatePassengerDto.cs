namespace SkyHan.FlightBooking.Business.Dtos.Passenger;

public class CreatePassengerDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
}
