using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SkyHan.FlightBooking.DataAccess.Context;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.DataAccess.Settings.Concrete;
using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.DataAccess.Repositories.Concrete;

public class FlightRepository : IFlightRepository
{
    private readonly IMongoCollection<Flight> _flightCollection;

    public FlightRepository(
        MongoDbContext dbContext,
        IOptions<CollectionNames> collectionNames)
    {
        _flightCollection = dbContext.GetCollection<Flight>(collectionNames.Value.FlightCollectionName);
    }

    public async Task<List<Flight>> GetAllAsync()
    {
        return await _flightCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Flight?> GetByIdAsync(string flightId)
    {
        return await _flightCollection.Find(x => x.FlightId == flightId).FirstOrDefaultAsync();
    }

    public async Task<Flight> CreateAsync(Flight flight)
    {
        if (string.IsNullOrWhiteSpace(flight.FlightId))
        {
            flight.FlightId = ObjectId.GenerateNewId().ToString();
        }

        await _flightCollection.InsertOneAsync(flight);
        return flight;
    }

    public async Task<bool> UpdateAsync(Flight flight)
    {
        var result = await _flightCollection.ReplaceOneAsync(x => x.FlightId == flight.FlightId, flight);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string flightId)
    {
        var result = await _flightCollection.DeleteOneAsync(x => x.FlightId == flightId);
        return result.DeletedCount > 0;
    }
}
