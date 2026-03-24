using SkyHan.FlightBooking.DataAccess.Settings.Abstract;

namespace SkyHan.FlightBooking.DataAccess.Settings.Concrete;

public class DatabaseSettings : IDatabaseSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
}
