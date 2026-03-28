using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SkyHan.FlightBooking.Entity.Concrete;

[BsonIgnoreExtraElements]
public class Passenger
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }

    [BsonRepresentation(BsonType.String)]
    public PassengerGender Gender { get; set; } = PassengerGender.Unknown;
}

public enum PassengerGender
{
    Unknown = 0,
    Male = 1,
    Female = 2
}
