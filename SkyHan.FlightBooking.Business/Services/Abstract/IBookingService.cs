using SkyHan.FlightBooking.Business.Dtos.Booking;
using SkyHan.FlightBooking.Business.Dtos.Passenger;

namespace SkyHan.FlightBooking.Business.Services.Abstract;

public interface IBookingService
{
    Task<List<BookingListDto>> GetAllAsync();
    Task<BookingDetailDto?> GetByIdAsync(string bookingId);
    Task<List<PassengerDto>> GetPassengersByFlightIdAsync(string flightId);
    Task<BookingDetailDto> CreateAsync(CreateBookingDto createBookingDto);
    Task<bool> UpdateAsync(UpdateBookingDto updateBookingDto);
    Task<bool> DeleteAsync(string bookingId);
}
