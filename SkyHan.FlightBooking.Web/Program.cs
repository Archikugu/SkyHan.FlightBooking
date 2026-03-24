using SkyHan.FlightBooking.Business.Mappings;
using SkyHan.FlightBooking.Business.Services.Abstract;
using SkyHan.FlightBooking.Business.Services.Concrete;
using SkyHan.FlightBooking.DataAccess.Context;
using SkyHan.FlightBooking.DataAccess.Repositories.Abstract;
using SkyHan.FlightBooking.DataAccess.Repositories.Concrete;
using SkyHan.FlightBooking.DataAccess.Settings.Concrete;

namespace SkyHan.FlightBooking.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
            MapsterMappingConfig.RegisterMappings();
            builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettings"));
            builder.Services.Configure<CollectionNames>(builder.Configuration.GetSection("CollectionNames"));
            builder.Services.AddSingleton<MongoDbContext>();
            builder.Services.AddScoped<IFlightRepository, FlightRepository>();
            builder.Services.AddScoped<IFlightService, FlightManager>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthorization();

            app.MapStaticAssets();
            app.MapControllerRoute(
                name: "areas",
                pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}")
                .WithStaticAssets();

            app.Run();
        }
    }
}
