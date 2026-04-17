using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.DataAccess.Repositories.Abstract;

public interface IBookingRepository
{
    Task<List<Booking>> GetAllAsync();
    Task<Booking?> GetByIdAsync(string bookingId);
    Task<bool> ExistsWithPnrNumberAsync(string pnrNumber);
    Task<Booking> CreateAsync(Booking booking);
    Task<bool> UpdateAsync(Booking booking);
    Task<bool> DeleteAsync(string bookingId);
}
