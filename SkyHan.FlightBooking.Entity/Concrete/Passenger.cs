using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SkyHan.FlightBooking.Entity.Serializers;

namespace SkyHan.FlightBooking.Entity.Concrete;

[BsonIgnoreExtraElements]
public class Passenger
{
    public string PassengerId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PassengerType { get; set; } = "Yetişkin";
    public string Pnr { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
    public string CheckInStatus { get; set; } = "Not Checked";
    public string PaymentStatus { get; set; } = "Pending";
    public string TicketStatus { get; set; } = "Not Issued";
    public bool IsCheckedIn { get; set; }
    public DateTime? CheckInDate { get; set; }
    public int BaggageKg { get; set; }
    public string? MealType { get; set; }
    public List<string>? ExtraServices { get; set; }
    public string? BoardingPassNumber { get; set; }
    public string? Gate { get; set; }
    public DateTime? BoardingTime { get; set; }

    [BsonSerializer(typeof(PassengerGenderBsonSerializer))]
    public PassengerGender Gender { get; set; } = PassengerGender.Unknown;
}

public enum PassengerGender
{
    Unknown = 0,
    Male = 1,
    Female = 2
}
