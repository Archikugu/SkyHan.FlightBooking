using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SkyHan.FlightBooking.DataAccess.Context;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.DataAccess.Settings.Concrete;
using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.DataAccess.Repositories.Concrete;

public class BookingRepository : IBookingRepository
{
    private readonly IMongoCollection<Booking> _bookingCollection;

    public BookingRepository(
        MongoDbContext dbContext,
        IOptions<CollectionNames> collectionNames)
    {
        _bookingCollection = dbContext.GetCollection<Booking>(collectionNames.Value.BookingCollectionName);
    }

    public async Task<List<Booking>> GetAllAsync()
    {
        return await _bookingCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(string bookingId)
    {
        return await _bookingCollection.Find(x => x.BookingId == bookingId).FirstOrDefaultAsync();
    }

    public async Task<bool> ExistsWithPnrNumberAsync(string pnrNumber)
    {
        if (string.IsNullOrWhiteSpace(pnrNumber))
        {
            return false;
        }

        var normalized = pnrNumber.Trim().ToUpperInvariant();
        var escaped = Regex.Escape(normalized);
        var filter = Builders<Booking>.Filter.Regex(
            x => x.PnrNumber,
            new BsonRegularExpression($"^{escaped}$", "i"));
        var count = await _bookingCollection.CountDocumentsAsync(filter);
        return count > 0;
    }

    public async Task<Booking> CreateAsync(Booking booking)
    {
        if (string.IsNullOrWhiteSpace(booking.BookingId))
        {
            booking.BookingId = ObjectId.GenerateNewId().ToString();
        }

        await _bookingCollection.InsertOneAsync(booking);
        return booking;
    }

    public async Task<bool> UpdateAsync(Booking booking)
    {
        var result = await _bookingCollection.ReplaceOneAsync(x => x.BookingId == booking.BookingId, booking);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string bookingId)
    {
        var result = await _bookingCollection.DeleteOneAsync(x => x.BookingId == bookingId);
        return result.DeletedCount > 0;
    }
}
