namespace SkyHan.FlightBooking.Business.Utilities;

/// <summary>
/// Havayolu tarzı kısa kayıt kodu üretir (I, O, 0, 1 karışıklığını azaltmak için hariç tutulmuştur).
/// </summary>
public static class PnrGenerator
{
    private const string SafeAlphanumeric = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    /// <summary>
    /// Tek başına benzersizlik garantisi vermez; benzersizlik için depo ile doğrulanmalıdır.
    /// </summary>
    public static string GenerateRandomCode(int length = 6)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(length, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(length, 32);

        Span<char> buffer = stackalloc char[length];
        for (var i = 0; i < length; i++)
        {
            buffer[i] = SafeAlphanumeric[Random.Shared.Next(SafeAlphanumeric.Length)];
        }

        return new string(buffer);
    }
}
