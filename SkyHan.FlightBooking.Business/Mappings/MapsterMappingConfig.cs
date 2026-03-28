using Mapster;
using SkyHan.FlightBooking.Business.Dtos.Booking;
using SkyHan.FlightBooking.Business.Dtos.Flight;
using SkyHan.FlightBooking.Business.Dtos.Passenger;
using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.Business.Mappings;

public static class MapsterMappingConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Flight, FlightListDto>.NewConfig();
        TypeAdapterConfig<Flight, FlightDetailDto>.NewConfig();
        TypeAdapterConfig<CreateFlightDto, Flight>.NewConfig();
        TypeAdapterConfig<UpdateFlightDto, Flight>.NewConfig();

        TypeAdapterConfig<Passenger, PassengerDto>
            .NewConfig()
            .Map(dest => dest.Gender, src => src.Gender.ToString());

        TypeAdapterConfig<CreatePassengerDto, Passenger>
            .NewConfig()
            .Map(dest => dest.Gender, src => ParsePassengerGender(src.Gender));

        TypeAdapterConfig<UpdatePassengerDto, Passenger>
            .NewConfig()
            .Map(dest => dest.Gender, src => ParsePassengerGender(src.Gender));

        TypeAdapterConfig<Booking, BookingListDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString());

        TypeAdapterConfig<Booking, BookingDetailDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString());

        TypeAdapterConfig<CreateBookingDto, Booking>
            .NewConfig()  
            .Map(dest => dest.Status, src => ParseBookingStatus(src.Status));

        TypeAdapterConfig<UpdateBookingDto, Booking>
            .NewConfig()
            .Map(dest => dest.Status, src => ParseBookingStatus(src.Status));
    }

    private static PassengerGender ParsePassengerGender(string? gender)
    {
        return Enum.TryParse<PassengerGender>(gender, true, out var parsedGender)
            ? parsedGender
            : PassengerGender.Unknown;
    }

    private static BookingStatus ParseBookingStatus(string? status)
    {
        return Enum.TryParse<BookingStatus>(status, true, out var parsedStatus)
            ? parsedStatus
            : BookingStatus.Pending;
    }
}
