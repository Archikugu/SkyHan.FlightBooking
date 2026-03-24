using Mapster;
using SkyHan.FlightBooking.Business.Dtos.Flight;
using SkyHan.FlightBooking.Business.Services.Abstract;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.Business.Services.Concrete;

public class FlightManager : IFlightService
{
    private readonly IFlightRepository _flightRepository;

    public FlightManager(IFlightRepository flightRepository)
    {
        _flightRepository = flightRepository;
    }

    public async Task<List<FlightDetailDto>> GetAllAsync()
    {
        var flights = await _flightRepository.GetAllAsync();
        return flights.Adapt<List<FlightDetailDto>>();
    }

    public async Task<FlightDetailDto?> GetByIdAsync(string flightId)
    {
        var flight = await _flightRepository.GetByIdAsync(flightId);
        return flight?.Adapt<FlightDetailDto>();
    }

    public async Task<FlightDetailDto> CreateAsync(CreateFlightDto createFlightDto)
    {
        var flight = createFlightDto.Adapt<Flight>();
        var createdFlight = await _flightRepository.CreateAsync(flight);
        return createdFlight.Adapt<FlightDetailDto>();
    }

    public async Task<bool> UpdateAsync(UpdateFlightDto updateFlightDto)
    {
        var flight = updateFlightDto.Adapt<Flight>();
        return await _flightRepository.UpdateAsync(flight);
    }

    public async Task<bool> DeleteAsync(string flightId)
    {
        return await _flightRepository.DeleteAsync(flightId);
    }
}
