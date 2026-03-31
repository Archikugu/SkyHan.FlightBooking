using SkyHan.FlightBooking.Business.Dtos.Booking;

namespace SkyHan.FlightBooking.Business.Services.Abstract;

public interface IBookingService
{
    Task<List<BookingListDto>> GetAllAsync();
    Task<BookingDetailDto?> GetByIdAsync(string bookingId);
    Task<BookingDetailDto> CreateAsync(CreateBookingDto createBookingDto);
    Task<bool> UpdateAsync(UpdateBookingDto updateBookingDto);
    Task<bool> DeleteAsync(string bookingId);
}
