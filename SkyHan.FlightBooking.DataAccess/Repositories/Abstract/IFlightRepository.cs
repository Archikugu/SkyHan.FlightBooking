using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.DataAccess.Repositories.Abstract;

public interface IFlightRepository
{
    Task<List<Flight>> GetAllAsync();
    Task<Flight?> GetByIdAsync(string flightId);
    Task<Flight> CreateAsync(Flight flight);
    Task<bool> UpdateAsync(Flight flight);
    Task<bool> DeleteAsync(string flightId);
}
