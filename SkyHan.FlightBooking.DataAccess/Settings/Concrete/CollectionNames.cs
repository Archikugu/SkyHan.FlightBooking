using SkyHan.FlightBooking.DataAccess.Settings.Abstract;

namespace SkyHan.FlightBooking.DataAccess.Settings.Concrete;

public class CollectionNames : ICollectionNames
{
    public string FlightCollectionName { get; set; } = "Flights";
}
