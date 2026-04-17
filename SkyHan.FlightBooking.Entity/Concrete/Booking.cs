using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SkyHan.FlightBooking.Entity.Concrete;

[BsonIgnoreExtraElements]
public class Booking
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string BookingId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string FlightId { get; set; } = string.Empty;
    public string PnrNumber { get; set; } = string.Empty;
    public List<Passenger> Passengers { get; set; } = [];

    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;

    public decimal TotalPrice { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;

    [BsonRepresentation(BsonType.String)]
    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    [BsonIgnore]
    public int PassengerCount => Passengers.Count;
}

public enum BookingStatus
{
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3
}