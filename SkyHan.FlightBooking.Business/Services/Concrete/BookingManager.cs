using Mapster;
using SkyHan.FlightBooking.Business.Dtos.Booking;
using SkyHan.FlightBooking.Business.Services.Abstract;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.Entity.Concrete;
using System;

namespace SkyHan.FlightBooking.Business.Services.Concrete;

public class BookingManager : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IFlightRepository _flightRepository;

    public BookingManager(
        IBookingRepository bookingRepository,
        IFlightRepository flightRepository)
    {
        _bookingRepository = bookingRepository;
        _flightRepository = flightRepository;
    }

    public async Task<List<BookingListDto>> GetAllAsync()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return bookings.Adapt<List<BookingListDto>>();
    }

    public async Task<BookingDetailDto?> GetByIdAsync(string bookingId)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId);
        return booking?.Adapt<BookingDetailDto>();
    }

    public async Task<BookingDetailDto> CreateAsync(CreateBookingDto createBookingDto)
    {
        if (string.IsNullOrWhiteSpace(createBookingDto.FlightId))
        {
            throw new ArgumentException("FlightId zorunludur.");
        }

        var passengers = createBookingDto.Passengers ?? [];
        if (passengers.Count == 0)
        {
            throw new InvalidOperationException("En az bir yolcu eklenmelidir.");
        }

        var flight = await _flightRepository.GetByIdAsync(createBookingDto.FlightId);
        if (flight is null)
        {
            throw new InvalidOperationException("Ucus bulunamadi.");
        }

        var booking = new Booking
        {
            FlightId = createBookingDto.FlightId,
            Passengers = passengers.Adapt<List<Passenger>>(),
            ContactName = createBookingDto.ContactName,
            ContactEmail = createBookingDto.ContactEmail,
            ContactPhone = createBookingDto.ContactPhone,
            TotalPrice = flight.BasePrice * passengers.Count,
            BookingDate = DateTime.UtcNow,
            Status = BookingStatus.Confirmed
        };
        var createdBooking = await _bookingRepository.CreateAsync(booking);
        return createdBooking.Adapt<BookingDetailDto>();
    }

    public async Task<bool> UpdateAsync(UpdateBookingDto updateBookingDto)
    {
        var booking = updateBookingDto.Adapt<Booking>();
        return await _bookingRepository.UpdateAsync(booking);
    }

    public async Task<bool> DeleteAsync(string bookingId)
    {
        return await _bookingRepository.DeleteAsync(bookingId);
    }
}
