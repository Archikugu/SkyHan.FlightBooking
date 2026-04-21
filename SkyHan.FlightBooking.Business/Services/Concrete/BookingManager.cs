using Mapster;
using SkyHan.FlightBooking.Business.Dtos.Booking;
using SkyHan.FlightBooking.Business.Dtos.Passenger;
using SkyHan.FlightBooking.Business.Services.Abstract;
using SkyHan.FlightBooking.Business.Utilities;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.Entity.Concrete;
using System;
using System.Linq;

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

    public async Task<List<PassengerDto>> GetPassengersByFlightIdAsync(string flightId)
    {
        if (string.IsNullOrWhiteSpace(flightId))
        {
            return [];
        }

        var bookings = await _bookingRepository.GetAllAsync();
        return bookings
            .Where(x => x.FlightId == flightId)
            .SelectMany(x => x.Passengers.Select(p => new PassengerDto
            {
                PassengerId = p.PassengerId,
                Name = p.Name,
                Surname = p.Surname,
                BirthDate = p.BirthDate,
                Gender = p.Gender.ToString(),
                Email = string.IsNullOrWhiteSpace(p.Email) ? x.ContactEmail : p.Email,
                Phone = string.IsNullOrWhiteSpace(p.Phone) ? x.ContactPhone : p.Phone,
                PassengerType = p.PassengerType,
                Pnr = p.Pnr,
                SeatNumber = p.SeatNumber,
                CheckInStatus = p.CheckInStatus,
                PaymentStatus = p.PaymentStatus,
                TicketStatus = p.TicketStatus,
                IsCheckedIn = p.IsCheckedIn,
                CheckInDate = p.CheckInDate,
                BaggageKg = p.BaggageKg,
                MealType = p.MealType,
                ExtraServices = p.ExtraServices,
                BoardingPassNumber = p.BoardingPassNumber,
                Gate = p.Gate,
                BoardingTime = p.BoardingTime
            }))
            .ToList();
    }

    public Task<string> GenerateUniquePnrNumberAsync() => GenerateUniquePnrAsync();

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

        var pnrNumber = await GenerateUniquePnrAsync();

        var booking = new Booking
        {
            FlightId = createBookingDto.FlightId,
            PnrNumber = pnrNumber,
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

    private async Task<string> GenerateUniquePnrAsync()
    {
        const int maxAttempts = 100;
        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            var candidate = PnrGenerator.GenerateRandomCode();
            if (!await _bookingRepository.ExistsWithPnrNumberAsync(candidate))
            {
                return candidate;
            }
        }

        throw new InvalidOperationException("Benzersiz PNR üretilemedi; lütfen tekrar deneyin.");
    }
}
