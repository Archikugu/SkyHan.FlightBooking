using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SkyHan.FlightBooking.DataAccess.Settings.Concrete;

namespace SkyHan.FlightBooking.DataAccess.Context;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<DatabaseSettings> databaseSettings)
    {
        var settings = databaseSettings.Value;
        var client = new MongoClient(settings.ConnectionString);
        _database = client.GetDatabase(settings.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
    {
        return _database.GetCollection<T>(collectionName);
    }
}
