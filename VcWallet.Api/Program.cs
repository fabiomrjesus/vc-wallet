using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VcWallet.Api;
using VcWallet.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseInMemoryDatabase("AuthDb")); // replace with persistent provider in production
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddDbContext<VcWallet.DataAccess.VcWalletDbContext>(options =>
    options.UseInMemoryDatabase("VcWalletDb"));
builder.Services.AddScoped<VcWallet.DataAccess.Repositories.ProposalSignatureRepository>();
builder.Services.AddScoped<VcWallet.Business.Services.ProposalSignatureService>();

builder.Services.AddScoped<AuthMiddleware>();
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
