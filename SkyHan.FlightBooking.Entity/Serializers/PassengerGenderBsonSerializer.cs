using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using SkyHan.FlightBooking.Entity.Concrete;

namespace SkyHan.FlightBooking.Entity.Serializers;

public class PassengerGenderBsonSerializer : SerializerBase<PassengerGender>
{
    public override PassengerGender Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var bsonType = context.Reader.GetCurrentBsonType();

        if (bsonType == BsonType.String)
        {
            var raw = (context.Reader.ReadString() ?? string.Empty).Trim();
            var normalized = raw.ToLowerInvariant();

            return normalized switch
            {
                "male" => PassengerGender.Male,
                "erkek" => PassengerGender.Male,
                "female" => PassengerGender.Female,
                "kadin" => PassengerGender.Female,
                "kadın" => PassengerGender.Female,
                "unknown" => PassengerGender.Unknown,
                _ => Enum.TryParse<PassengerGender>(raw, true, out var parsed)
                    ? parsed
                    : PassengerGender.Unknown
            };
        }

        if (bsonType == BsonType.Int32)
        {
            var value = context.Reader.ReadInt32();
            return Enum.IsDefined(typeof(PassengerGender), value)
                ? (PassengerGender)value
                : PassengerGender.Unknown;
        }

        context.Reader.SkipValue();
        return PassengerGender.Unknown;
    }

    public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, PassengerGender value)
    {
        context.Writer.WriteString(value.ToString());
    }
}
