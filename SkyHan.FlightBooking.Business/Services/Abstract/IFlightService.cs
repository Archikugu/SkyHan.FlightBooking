using SkyHan.FlightBooking.Business.Dtos.Flight;

namespace SkyHan.FlightBooking.Business.Services.Abstract;

public interface IFlightService
{
    Task<List<FlightDetailDto>> GetAllAsync();
    Task<FlightDetailDto?> GetByIdAsync(string flightId);
    Task<FlightDetailDto> CreateAsync(CreateFlightDto createFlightDto);
    Task<bool> UpdateAsync(UpdateFlightDto updateFlightDto);
    Task<bool> DeleteAsync(string flightId);
}
