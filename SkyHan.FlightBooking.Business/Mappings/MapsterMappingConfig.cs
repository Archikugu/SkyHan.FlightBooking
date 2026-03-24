using Mapster;
using SkyHan.FlightBooking.Business.Dtos.Flight;
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
    }
}
